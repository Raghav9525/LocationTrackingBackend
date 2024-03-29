// routes/index.js
const express = require('express');
const router = express.Router();

const pool = require('../db'); // Adjust the path as necessary

//delete location history
router.post('/location_delete', (req, res) => {
    const sql = 'delete from location_history';

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json({ message: "Internal server error" });
            return;
        }
        
        connection.query(sql, (error, results) => {
            connection.release(); // Release the connection when done with it
            
            if (error) {
                res.status(500).json({ message: "Failed to delete Location history" });
            } else {
                console.log("deleted")
                res.status(200).json({ message: "Location history deleted successfully" });
            }
        });
    });
});

//fectch location details
router.post('/location_history', (req, res) => {
    const { mobile } = req.body;
    const sql = 'SELECT * FROM location_history WHERE mobile = ?';

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json({ message: "Internal server error" });
            return;
        }
        
        connection.query(sql, [mobile], (error, results) => {
            connection.release(); // Release the connection when done with it
            
            if (error) {
                console.error("Error executing SQL query:", error);
                res.status(500).json({ message: "Error fetching location history" });
            } else {
                console.log("Location history fetched successfully");
                res.status(200).json(results);
            }
        });
    });
});

//store location
router.post('/location', (req, res) => {
    const { mobile, current_location } = req.body;
    const sql = `INSERT INTO location_history (mobile, location, time) VALUES (?, ?, CONVERT_TZ(NOW(), @@session.time_zone, '+05:30'))`;
    
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting MySQL connection:", err);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
        
        connection.query(sql, [mobile, current_location], (error, results) => {
            connection.release(); // Release the connection when done with it
            
            if (error) {
                console.error("Error executing SQL query:", error);
                res.status(500).json({ message: "Error storing location" });
            } else {
                console.log("Location stored successfully");
                res.status(200).json({ message: "Location stored successfully" });
            }
        });
    });
});



module.exports = router;
