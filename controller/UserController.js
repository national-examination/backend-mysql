require("dotenv").config();
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbConnection = require('../db/db');
const router = Router();

const { SECRET = "secret" } = process.env;

// Signup route to create a new user
router.post("/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const query = 'INSERT INTO users (userid, password) VALUES (?, ?)';
        const rows = dbConnection.query(query, [req.body.userid, hashedPassword]);

        // send new user as response
        res.json({ userid: req.body.userid, password: req.body.hashedPassword, message: "Created successfuly!" });
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Login route to verify a user and get a token
router.post("/login", async (req, res) => {
    try {
        console.log("heloo");
        const query = 'SELECT * FROM users WHERE userid = ?';
        dbConnection.query(query, [req.body.userid], async (error, results) => {
            if (error) {
                console.error('Error executing MySQL query:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                const user = results[0];
                console.log("heloo");
                if (user) {
                    // check if password matches
                    const result = await bcrypt.compare(req.body.password, user.password);

                    if (result) {
                        // sign token and send it in response
                        const token = await jwt.sign({ userid: user.userid }, SECRET);
                        return res.json({ token });
                    } else {
                        return res.status(400).json({ error: "Password doesn't match" });
                    }
                } else {
                    return res.status(400).json({ error: "User doesn't exist" });
                }
                // return res.json(results);
            }
        });

    } catch (error) {
        res.status(400).json({ error: error });
    }
});

module.exports = router;
