
const express = require('express');

const router = express.Router();
const zod = require("zod");
const  pool  = require("../mysql");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");
const app = express();



// POST request handler to add a new supplier
router.post('/add',authMiddleware, async (req, res) => {
    const { name, contactPerson, phone, email } = req.body;
    const sql = 'INSERT INTO Supplier (Name, ContactPerson, Phone, Email) VALUES (?, ?, ?, ?)';
    
    try {
      const result = await pool.query(sql, [name, contactPerson, phone, email]);
      console.log('Data inserted into Supplier table');
      res.status(200).json({ message: 'Data inserted successfully' });
    } catch (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Error inserting data' });
    }
  });
  
  // PUT request handler to update a supplier
  router.put('/update/:id',authMiddleware, async (req, res) => {
    const supplierId = req.params.id;
    const { name, contactPerson, phone, email } = req.body;
    const sql = 'UPDATE Supplier SET Name = ?, ContactPerson = ?, Phone = ?, Email = ? WHERE SupplierID = ?';
    
    try {
      const result = await pool.query(sql, [name, contactPerson, phone, email, supplierId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      console.log('Data updated for Supplier with ID:', supplierId);
      res.status(200).json({ message: 'Data updated successfully' });
    } catch (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ error: 'Error updating data' });
    }
  });
  
  // DELETE request handler to delete a supplier
  router.delete('/delete/:id',authMiddleware, async (req, res) => {
    const supplierId = req.params.id;
    const sql = 'DELETE FROM Supplier WHERE SupplierID = ?';
    
    try {
      const result = await pool.query(sql, [supplierId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      console.log('Data deleted for Supplier with ID:', supplierId);
      res.status(200).json({ message: 'Data deleted successfully' });
    } catch (err) {
      console.error('Error deleting data:', err);
      res.status(500).json({ error: 'Error deleting data' });
    }
  });
  
  // GET request handler to get all suppliers
  router.get('/',authMiddleware, (req, res) => {
    // Execute a SQL query to retrieve all rows from the table
    const sql = 'SELECT * FROM Supplier';
    pool.query(sql, (err, rows) => {
      if (err) throw err;
  
      // Send the rows as JSON
      res.status(200).json(rows);
    });
  });

  router.get('/search', authMiddleware, async (req, res) => {
    const search_term = req.query.term; // Get the search term from the query parameter
    
    // Construct the SQL query with the search term
    const sql = `SELECT * FROM Supplier 
                 WHERE Name LIKE ? OR ContactPerson LIKE ?`;
    
    pool.query(sql, [`%${search_term}%`, `%${search_term}%`], (err, rows) => {
        if (err) {
            console.error('Error searching suppliers:', err);
            res.status(500).json({ error: 'Error searching suppliers' });
            return;
        }
        
        // Send the rows as JSON
        res.status(200).json(rows);
    });
});



  module.exports=router;

  