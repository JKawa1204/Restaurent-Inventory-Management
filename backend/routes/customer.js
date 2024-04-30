const express = require('express');
const router = express.Router();
const pool = require("../mysql");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");
const zod = require('zod');

router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { name, address, phone, email } = req.body;

    const sql = 'INSERT INTO Customer (Name, Address, Phone, Email) VALUES (?, ?, ?, ?)';
    const result = await pool.query(sql, [name, address, phone, email]);
    
    console.log('Data inserted into Customer table');
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data' });
  }
});

// PUT request handler to update a customer
router.put('/update/:id',authMiddleware, async (req, res) => {
    const customerId = req.params.id;
    const { name, address, phone, email } = req.body;
    const sql = 'UPDATE Customer SET Name = ?, Address = ?, Phone = ?, Email = ? WHERE CustomerID = ?';
    
    try {
      const result = await pool.query(sql, [name, address, phone, email, customerId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      console.log('Data updated for Customer with ID:', customerId);
      res.status(200).json({ message: 'Data updated successfully' });
    } catch (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ error: 'Error updating data' });
    }
});

// DELETE request handler to delete a customer
router.delete('/delete/:id',authMiddleware, async (req, res) => {
    const customerId = req.params.id;
    const sql = 'DELETE FROM Customer WHERE CustomerID = ?';
    
    try {
      const result = await pool.query(sql, [customerId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      console.log('Data deleted for Customer with ID:', customerId);
      res.status(200).json({ message: 'Data deleted successfully' });
    } catch (err) {
      console.error('Error deleting data:', err);
      res.status(500).json({ error: 'Error deleting data' });
    }
});

// GET request handler to get all customers
router.get('/',authMiddleware, (req, res) => {
  // Execute a SQL query to retrieve all rows from the table
  const sql = 'SELECT * FROM Customer';
  pool.query(sql, (err, rows) => {
    if (err) throw err;

    // Send the rows as JSON
    res.status(200).json(rows);
  });
});

router.get('/search', authMiddleware, async (req, res) => {
  const search_term = req.query.term; // Get the search term from the query parameter
  
  // Construct the SQL query with the search term
  const sql = `SELECT * FROM Customer 
               WHERE Name LIKE ? OR Address LIKE ?`;
  
  try {
      // Execute the SQL query with the search term as parameters
      const result = await pool.query(sql, [`%${search_term}%`, `%${search_term}%`]);
      
      // Send the result as JSON response
      res.status(200).json(result);
  } catch (err) {
      // Handle errors
      console.error('Error searching customers:', err);
      res.status(500).json({ error: 'Error searching customers' });
  }
});

module.exports = router;
