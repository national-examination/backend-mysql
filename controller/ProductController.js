require("dotenv").config();
const { Router } = require("express");
const dbConnection = require('../db/db');
const router = Router();
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - Token not provided" });
        }
        token =  token.split(' ')[1];
        await jwt.verify(token, process.env.SECRET);
        
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
};

router.use(authenticateToken);

// Get all products
router.get("/all", async (req, res) => {
    try {
        const query = "CALL usp_list_product();"
        dbConnection.query(query, (error, results) => {
            if (error) {
                console.error('Error executing MySQL query:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                return res.status(200).json(results);
            }
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

        const query = "CALL usp_get_product(?);"
        dbConnection.query(query, [productId], (error, results) => {
            if (error) {
                console.error('Error executing MySQL query:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                return res.status(200).json(results);
            }
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

        const query = 'CALL usp_ins_product(?, ?, ?);';

        dbConnection.query(query, [name, description, price], (error, results) => {
            if (error) {
                console.error('Error executing MySQL query:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                return res.status(200).json({ id: results.id, name, description, price });
            }
        });
    } catch (error) {
        res.status(400).json({ error });
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

        const query = 'CALL usp_upd_product(?, ?, ?, ?);';

        dbConnection.query(query, [productId, name, description, price], (error, results) => {
            if (error) {
                console.error('Error executing MySQL query:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                return res.status(201).json({ id: results.id, name, description, price });
            }
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

        const query = "CALL usp_del_product(?);"
        const data = dbConnection.query(query, [productId], (error, results) => {
            if (error) {
                console.error('Error executing MySQL query:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                return res.status(200).json(results);
            }
        });

    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router;
