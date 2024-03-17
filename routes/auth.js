// routes/index.js
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret_key = process.env.SECRET_KEY;

router.use(bodyParser.json());

const pool = require('../db'); // Adjust the path as necessary


function generateToken(mobile){
    return jwt.sign(mobile, secret_key);
}

router.post('/login', (req, res) => {
    const { mobile, password } = req.body;
    const sql = "SELECT * FROM signup WHERE mobile = ? AND password = ?";
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: "Database connection failed" });
        }

        connection.query(sql, [mobile, password], (error, results) => {
            connection.release(); // Release the connection back to the pool

            if (error) {
                return res.status(500).json({ message: "Login failed" });
            }
            // Use results.length to check if any rows are returned
            if (results.length > 0) {
                const token = generateToken(mobile); // Assuming you have this function defined to generate a token
        
                // Send token as response
                res.status(200).json({ token: token });
            } else {
                // If credentials are incorrect, or no user found, send appropriate response
                res.status(401).json({ error: 'Invalid credentials or user does not exist' });
            }
        });
    });
});



router.post('/signup', (req, res) => {
    console.log(req.body)
    const { nam, mobile, password } = req.body;
    const query = 'INSERT INTO signup (name, mobile, password) VALUES (?, ?, ?)';

    pool.getConnection((err, connection) => {

        connection.query(query, [nam, mobile, password], (error, results) => {
            if (error) {
                console.error("Error occurred during signup:", error);
                res.status(500).json({ message: "Signup failed" });
            } else {
                console.log("Signup successful");
                res.status(200).json({ message: "Signup successful" });
            }
        });
    });
});






module.exports = router;
