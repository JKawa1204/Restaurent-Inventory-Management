
const express = require('express');

const router = express.Router();
const zod = require("zod");
const  pool  = require("../mysql");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");

const app = express();




router.post('/add/',authMiddleware, async (req, res) => {
    const { name, description, unitPrice, quantityAvailable } = req.body;
  
    const sql = 'INSERT INTO InventoryItem (Name, Description, UnitPrice, QuantityAvailable) VALUES (?, ?, ?, ?)';
    
    try {
      const result = await pool.query(sql, [name, description, unitPrice, quantityAvailable]);
      console.log('Data inserted into InventoryItem table');
      res.status(200).json({ message: 'Data inserted successfully' });
    } catch (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Error inserting data' });
    }
  });
  

  router.delete('/delete/:id',authMiddleware, async (req, res) => {
    const itemId = req.params.id;
    const sql = 'DELETE FROM InventoryItem WHERE ItemID = ?';
    
    try {
      // Wrap the pool.query call in a Promise
      const result = await new Promise((resolve, reject) => {
        pool.query(sql, [itemId], (err, result) => {
          if (err) {
            reject(err); // Reject the promise if there's an error
          } else {
            resolve(result); // Resolve the promise with the query result
          }
        });
      });
  
      // Check if any rows were affected
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      console.log('Data deleted for InventoryItem with ID:', itemId);
      res.status(200).json({ message: 'Data deleted successfully' });
    } catch (err) {
      console.error('Error deleting data:', err);
      res.status(500).json({ error: 'Error deleting data' });
    }
  });
  

  // Define a utility function to promisify pool.query
function queryAsync(sql, values) {
    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  
  // Now you can use queryAsync to execute your queries with async/await
  router.put('/update/:id',authMiddleware, async (req, res) => {
    const itemId = req.params.id;
    const { name, description, unitPrice, quantityAvailable } = req.body;
  
    const sql = 'UPDATE InventoryItem SET Name = ?, Description = ?, UnitPrice = ?, QuantityAvailable = ? WHERE ItemID = ?';
  
    try {
      // Execute the update query using queryAsync
      const result = await queryAsync(sql, [name, description, unitPrice, quantityAvailable, itemId]);
      if (result.affectedRows === 0) {
        // No rows were updated, meaning the item with the provided ID does not exist
        return res.status(404).json({ error: 'Item not found' });
      }
      console.log('Data updated for InventoryItem with ID:', itemId);
      res.status(200).json({ message: 'Data updated successfully' });
    } catch (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ error: 'Error updating data' });
    }
  });


  router.get('/',authMiddleware, (req, res) => {
    // Execute a SQL query to retrieve all rows from the table
    const sql = 'SELECT * FROM InventoryItem';
    pool.query(sql, (err, rows) => {
      if (err) throw err;
  
      // Send the rows as JSON
      res.status(200).json(rows);
    });
  });
  
  router.get('/search', authMiddleware, async (req, res) => {
    const search_term = req.query.term; // Get the search term from the query parameter
    
    // Construct the SQL query with the search term
    const sql = `SELECT * FROM InventoryItem 
                 WHERE Name LIKE ? OR Description LIKE ?`;
    
    try {
        // Execute the SQL query with the search term as a parameter
        const result = await pool.query(sql, [`%${search_term}%`, `%${search_term}%`]);
        
        // Send the result as JSON response
        res.status(200).json(result);
    } catch (err) {
        // Handle errors
        console.error('Error searching InventoryItem:', err);
        res.status(500).json({ error: 'Error searching InventoryItem' });
    }
});
  
  module.exports = router;
  


