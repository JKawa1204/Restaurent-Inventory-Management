const express = require('express');
const router = express.Router();
const pool = require("../mysql");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");


// POST request handler to add a new sale order
router.post('/add', authMiddleware, async (req, res) => {
    const { orderDate, totalAmount } = req.body;
    const sql = 'INSERT INTO SaleOrder (OrderDate, TotalAmount) VALUES (?, ?)';
    
    try {
        const result = await pool.query(sql, [orderDate, totalAmount]);
        console.log('Data inserted into SaleOrder table');
        res.status(200).json({ message: 'Data inserted successfully' });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data' });
    }
});

// PUT request handler to update a sale order
router.put('/update/:id', authMiddleware, async (req, res) => {
    const orderId = req.params.id;
    const { orderDate, totalAmount } = req.body;
    const sql = 'UPDATE SaleOrder SET OrderDate = ?, TotalAmount = ? WHERE OrderID = ?';
    
    try {
        const result = await pool.query(sql, [orderDate, totalAmount, orderId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sale order not found' });
        }
        console.log('Data updated for SaleOrder with ID:', orderId);
        res.status(200).json({ message: 'Data updated successfully' });
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ error: 'Error updating data' });
    }
});




// DELETE request handler to delete a sale order
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const orderId = req.params.id;
    const sql = 'DELETE FROM SaleOrder WHERE OrderID = ?';

    try {
        const result = await pool.query(sql, [orderId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sale order not found' });
        }
        console.log('Data deleted for SaleOrder with ID:', orderId);
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).json({ error: 'Error deleting data' });
    }
});

router.get('/', authMiddleware, (req, res) => {
    // Execute a SQL query to retrieve all rows from the table
    const sql = 'SELECT * FROM SaleOrder';
    pool.query(sql, (err, rows) => {
        if (err) throw err;

        // Send the rows as JSON
        res.status(200).json(rows);
    });
});

router.get('/sale-order/:orderId', authMiddleware, async (req, res) => {
    const orderId = req.params.orderId;

    // SQL query
    const sql = `
        SELECT i.Name, i.Description, si.Quantity, si.PricePerUnit
        FROM InventoryItem i
        INNER JOIN SaleOrderItem si ON i.ItemID = si.ItemID
        INNER JOIN SaleOrder so ON si.OrderID = so.OrderID
        WHERE so.OrderID = ?;
    `;

    try {
        const result = await pool.query(sql, [orderId]);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
    }
});

// GET request handler to fetch sale orders with customer names
router.get('/sale-orders', authMiddleware, async (req, res) => {
    try {
        const sql = `
            SELECT so.OrderID, so.OrderDate, so.TotalAmount, c.Name AS CustomerName
            FROM SaleOrder so
            JOIN Customer c ON so.CustomerID = c.CustomerID
        `;
        const result = await pool.query(sql);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching sale orders:', err);
        res.status(500).json({ error: 'Error fetching sale orders' });
    }
});

router.get('/search', authMiddleware, async (req, res) => {
  const search_term = req.query.term; // Get the search term from the query parameter
  
  // Construct the SQL query with the search term
  const sql = `SELECT * FROM SaleOrder 
               WHERE OrderID = ? OR OrderDate = ? OR TotalAmount = ?`;
  
  try {
      // Execute the SQL query with the search term as parameters
      const result = await pool.query(sql, [search_term, search_term, search_term]);
      
      // Send the result as JSON response
      res.status(200).json(result);
  } catch (err) {
      // Handle errors
      console.error('Error searching sale orders:', err);
      res.status(500).json({ error: 'Error searching sale orders' });
  }
});


module.exports = router;
