const express = require('express');
const router = express.Router();
const pool = require("../mysql");
const { authMiddleware } = require("../middleware");

// POST request handler to add a new purchase order
router.post('/add',authMiddleware, async (req, res) => {
    const { supplierId, orderDate, totalAmount } = req.body;
    const sql = 'INSERT INTO PurchaseOrder (SupplierID, OrderDate, TotalAmount) VALUES (?, ?, ?)';
    
    try {
      const result = await pool.query(sql, [supplierId, orderDate, totalAmount]);
      console.log('Data inserted into PurchaseOrder table');
      res.status(200).json({ message: 'Data inserted successfully' });
    } catch (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Error inserting data' });
    }
});

// PUT request handler to update a purchase order
router.put('/update/:id',authMiddleware, async (req, res) => {
    const orderId = req.params.id;
    const { supplierId, orderDate, totalAmount } = req.body;
    const sql = 'UPDATE PurchaseOrder SET SupplierID = ?, OrderDate = ?, TotalAmount = ? WHERE OrderID = ?';
    
    try {
      const result = await pool.query(sql, [supplierId, orderDate, totalAmount, orderId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Purchase order not found' });
      }
      console.log('Data updated for PurchaseOrder with ID:', orderId);
      res.status(200).json({ message: 'Data updated successfully' });
    } catch (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ error: 'Error updating data' });
    }
});

// DELETE request handler to delete a purchase order
router.delete('/delete/:id',authMiddleware, async (req, res) => {
    const orderId = req.params.id;
    const sql = 'DELETE FROM PurchaseOrder WHERE OrderID = ?';
    
    try {
      const result = await pool.query(sql, [orderId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Purchase order not found' });
      }
      console.log('Data deleted for PurchaseOrder with ID:', orderId);
      res.status(200).json({ message: 'Data deleted successfully' });
    } catch (err) {
      console.error('Error deleting data:', err);
      res.status(500).json({ error: 'Error deleting data' });
    }
});

// GET request handler to get all purchase orders
router.get('/',authMiddleware, (req, res) => {
  // Execute a SQL query to retrieve all rows from the table
  const sql = 'SELECT * FROM PurchaseOrder';
  pool.query(sql, (err, rows) => {
    if (err) throw err;

    // Send the rows as JSON
    res.status(200).json(rows);
  });
});

router.get('/purchase-order/:supplierId', async (req, res) => {
  const supplierId = req.params.supplierId;

  // SQL query
  const sql = `
      SELECT i.Name, i.Description, pi.Quantity, pi.PricePerUnit
      FROM InventoryItem i
      INNER JOIN PurchaseOrderItem pi ON i.ItemID = pi.ItemID
      INNER JOIN PurchaseOrder po ON pi.OrderID = po.OrderID
      WHERE po.SupplierID = ?;
  `;
  
  try {
      const result = await pool.query(sql, [supplierId]);
      res.status(200).json(result);
  } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Error executing query' });
  }
});

router.get('/purchase-orders',authMiddleware, async (req, res) => {
  try {
      const sql = `
          SELECT po.OrderID, po.OrderDate, po.TotalAmount, s.Name AS SupplierName
          FROM PurchaseOrder po
          JOIN Supplier s ON po.SupplierID = s.SupplierID
      `;
      const result = await pool.query(sql);
      res.status(200).json(result);
  } catch (err) {
      console.error('Error fetching purchase orders:', err);
      res.status(500).json({ error: 'Error fetching purchase orders' });
  }
});

router.get('/purchase-order-items',authMiddleware, async (req, res) => {
  try {
      const sql = `
          SELECT po.OrderID, pi.ItemID, i.Name AS ItemName, pi.Quantity
          FROM PurchaseOrder po
          JOIN PurchaseOrderItem pi ON po.OrderID = pi.OrderID
          JOIN InventoryItem i ON pi.ItemID = i.ItemID
      `;
      const result = await pool.query(sql);
      res.status(200).json(result);
  } catch (err) {
      console.error('Error fetching purchase order items:', err);
      res.status(500).json({ error: 'Error fetching purchase order items' });
  }
});

router.get('/search', authMiddleware, async (req, res) => {
  const search_term = req.query.term; // Get the search term from the query parameter
  
  // Construct the SQL query with the search term
  const sql = `SELECT * FROM PurchaseOrder 
               WHERE OrderID = ? OR OrderDate = ? OR TotalAmount = ?`;
  
  try {
      // Execute the SQL query with the search term as parameters
      const result = await pool.query(sql, [search_term, search_term, search_term]);
      
      // Send the result as JSON response
      res.status(200).json(result);
  } catch (err) {
      // Handle errors
      console.error('Error searching purchase orders:', err);
      res.status(500).json({ error: 'Error searching purchase orders' });
  }
});

module.exports = router;

