const express = require('express');
const router = express.Router();
const pool = require("../mysql");
const { authMiddleware } = require("../middleware");

router.post('/add', authMiddleware, async (req, res) => {
  const { name, address, phone, email } = req.body;

  const sql = 'INSERT INTO Restaurant (Name, Address, Phone, Email) VALUES (?, ?, ?, ?)';

  try {
    const result = await pool.query(sql, [name, address, phone, email]);
    console.log('Data inserted into Restaurant table');
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data' });
  }
});

router.delete('/delete/:id', authMiddleware, async (req, res) => {
  const restaurantId = req.params.id;
  const sql = 'DELETE FROM Restaurant WHERE RestaurantID = ?';

  try {
    const result = await pool.query(sql, [restaurantId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    console.log('Data deleted for Restaurant with ID:', restaurantId);
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ error: 'Error deleting data' });
  }
});

router.put('/update/:id', authMiddleware, async (req, res) => {
  const restaurantId = req.params.id;
  const { name, address, phone, email } = req.body;

  const sql = 'UPDATE Restaurant SET Name = ?, Address = ?, Phone = ?, Email = ? WHERE RestaurantID = ?';

  try {
    const result = await pool.query(sql, [name, address, phone, email, restaurantId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    console.log('Data updated for Restaurant with ID:', restaurantId);
    res.status(200).json({ message: 'Data updated successfully' });
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).json({ error: 'Error updating data' });
  }
});

router.get('/', authMiddleware, (req, res) => {
  const sql = 'SELECT * FROM Restaurant';
  pool.query(sql, (err, rows) => {
    if (err) throw err;

    res.status(200).json(rows);
  });
});

router.get('/search', authMiddleware, async (req, res) => {
  const search_term = req.query.term;
  const sql = `SELECT * FROM Restaurant 
               WHERE Name LIKE ? OR Address LIKE ?`;

  try {
    const result = await pool.query(sql, [`%${search_term}%`, `%${search_term}%`]);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error searching Restaurant:', err);
    res.status(500).json({ error: 'Error searching Restaurant' });
  }
});

module.exports = router;
