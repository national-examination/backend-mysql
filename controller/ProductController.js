require("dotenv").config();
const { Router } = require("express");
const dbConnection = require('../db/db');
const router = Router();
const dbService = require("../Services/DbService");
const authenticateToken = require("../middlewares/jwt.middleware");

router.use(authenticateToken);

// Get all products
router.get("/all", async (req, res) => {
    try {
        const parameters = [];

        await dbService.common_db_call("usp_list_product", parameters, (err, result) => {
            if (err) {
                return res.status(500).send("data service error: " + err.message);
            }
            return res.status(200).json({ result })
        });

    } catch (error) {
        res.status(400).json({ error });
    }
});

// Get product by Id
router.get("/:id", async (req, res) => {
    try {
        const productId = req.params.id;

        if (isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const parameters = [
            { ParamName: "id", Value: productId, Direction: 0, DataType: "int" }
        ];

        await dbService.common_db_call("usp_get_product", parameters, (err, result) => {
            if (err) {
                return res.status(500).send("data service error: " + err.message);
            }
            if (result[0].length == 0)
                return res.status(400).send({ message: "Product not found!" });

            return res.status(200).json(result);
        });

    } catch (error) {
        res.status(400).json({ error });
    }
});

// Create product
router.post("/create", async (req, res) => {
    try {
        const { name, description, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ error: 'Name and Price are required' });
        }
        const parametersByName = [
            { ParamName: "name", Value: name, Direction: 0, DataType: "nvarchar" }
        ]
        const parameters = [
            { ParamName: "name", Value: name, Direction: 0, DataType: "nvarchar" },
            { ParamName: "description", Value: description, Direction: 0, DataType: "nvarchar" },
            { ParamName: "price", Value: price, Direction: 0, DataType: "int" }
        ];

        await dbService.common_db_call("usp_get_product_by_name", parametersByName, async (err, result) => {
            if (err) {
                return res.status(500).send("data service error: " + err.message);
            }

            if (result[0].length != 0)
                return res.status(400).send({ message: "Product already exist!" });

            await dbService.common_db_call("usp_ins_product", parameters, (err, result) => {
                if (err) {
                    return res.status(500).send("data service error: " + err.message);
                }
                // console.log("Inserted product:", result);
                return res.status(200).json({ message: "Created successfully!", name: name, description: description, price: price })
            });
        });

    } catch (error) {
        res.status(400).json({ error: error });
    }
});

// Update product
router.put("/update/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const { name, description, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ error: 'Name and Price are required' });
        }

        const productParam = [{ ParamName: "id", Value: productId, Direction: 0, DataType: "int" }];

        const parameters = [
            { ParamName: "id", Value: productId, Direction: 0, DataType: "int" },
            { ParamName: "name", Value: name, Direction: 0, DataType: "nvarchar" },
            { ParamName: "description", Value: description, Direction: 0, DataType: "nvarchar" },
            { ParamName: "price", Value: price, Direction: 0, DataType: "int" }
        ];

        await dbService.common_db_call("usp_get_product", productParam, async (err, result) => {
            if (err) {
                return res.status(500).send("data service error: " + err.message);
            }
            if (result[0].length == 0)
                return res.status(400).send({ message: "Product not found!" });

            await dbService.common_db_call("usp_upd_product", parameters, (err, result) => {
                if (err) {
                    return res.status(500).send("data service error: " + err.message);
                }
                return res.status(201).json({ message: "Updated Successfully!", id: result.id, name, description, price });
            });
        });

    } catch (error) {
        res.status(400).json({ error });
    }
});

// Get product by Id
router.delete("/:id", async (req, res) => {
    try {
        const productId = req.params.id;

        if (isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const parameters = [
            { ParamName: "id", Value: productId, Direction: 0, DataType: "int" }
        ];

        await dbService.common_db_call("usp_get_product", parameters, async (err, result) => {
            if (err) {
                return res.status(500).send("data service error: " + err.message);
            }
            if (result[0].length == 0)
                return res.status(200).send({ message: "Product not found!" });

            await dbService.common_db_call("usp_del_product", parameters, (err, result) => {
                if (err) {
                    return res.status(500).send("data service error: " + err.message);
                }
                return res.status(200).json({ message: "Deleted successfully!" })
            });
        });



    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router;
