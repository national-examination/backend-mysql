require("dotenv").config();
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbConnection = require('../db/db');
const router = Router();

const { SECRET = "secret" } = process.env;
const dbService = require("../Services/DbService");


// Signup route
router.post("/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const parameters = [
            { ParamName: "userid", Value: req.body.userid, Direction: 0, DataType: "varchar" },
            { ParamName: "password", Value: hashedPassword, Direction: 0, DataType: "varchar" }
        ];

        let email = [
            { ParamName: "userid", Value: req.body.userid, Direction: 0, DataType: "varchar" },
        ]

        await dbService.common_db_call("usp_get_user_email", email, async (err, results) => {
            if (err) {
                return res.status(500).send("data service error: " + err.message);
            }
            const user = results[0].length;
            if (user != 0) {
                return res.status(201).json({ error: "User already exist!" });
            } else {
                await dbService.common_db_call("usp_ins_user", parameters, (err, result) => {
                    if (err) {
                        return res.status(500).send("data service error 1: " + err.message);
                    }
                    return res.status(201).json({ message: "Created successfully!" })
                });
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message || "An error occurred." });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        if (!req.body.userid || !req.body.password)
            return res.status(400).send("Enter all inputs");

        const parameters = [
            { ParamName: "userid", Value: req.body.userid, Direction: 0, DataType: "varchar" }
        ];

        await dbService.common_db_call("usp_get_user_email", parameters, async (err, results) => {
            if (err) {
                return res.status(500).send("data service error: " + err.message);
            }
            const user = results[0];
            if (user.length != 0) {
                const result = await bcrypt.compare(req.body.password, user[0].password);
                if (result) {
                    const token = await jwt.sign({ userid: user.userid }, SECRET);
                    return res.json({ token });
                } else {
                    return res.status(400).json({ error: "Password doesn't match" });
                }
            } else {
                return res.status(400).json({ error: "User doesn't exist" });
            }
        });

    } catch (error) {
        res.status(400).json({ error: error });
    }
});

module.exports = router;
