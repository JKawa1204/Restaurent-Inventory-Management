const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  db  = require('../mysql'); // Import MySQL connection
const { JWT_SECRET } = require('../config'); // Import JWT secret
const { authMiddleware } = require('../middleware'); // Import verifyToken middleware
const zod = require('zod');

const router = express.Router();

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    email: zod.string().email(),
  });

// Sign-up endpoint
router.post('/signup', async (req, res) => {
    try {
        const { username, password, email } = signupSchema.parse(req.body);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const result= await db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);

        // Generate JWT token
        const userId = result.insertId;
        const token = jwt.sign({ userId }, JWT_SECRET);

        // Send token in response
        res.json({
            message: "User created successfully",
            token: token
        });
    } catch (error) {
        if (error instanceof zod.ZodError) {
            console.error('Validation error:', error.errors);
            res.status(400).json({ error: 'Validation error', details: error.errors });
        } else {
            console.error('Error signing up:', error);
            res.status(500).json({ error: 'Error signing up' });
        }
    }
});

async function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      // Execute a SQL query to retrieve the user
      db.query('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {
        if (err) reject(err);
  
        // If the query returns no rows (i.e., the user doesn't exist), return null
        if (rows.length === 0) {
          resolve(null);
        }
  
        // Otherwise, return the user object
        resolve(rows[0]);
      });
    });
  }

// Sign-in endpoint
router.post('/signin', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Retrieve the user from the database
      const user = await getUserByUsername(username);
  
      // If the user doesn't exist, return an error message
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  
      // Send the token in the response
      res.json({ token });
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(500).json({ error: 'Error signing in' });
    }
  });
  // Protected route
router.get('/protected', authMiddleware, (req, res) => {
    // If token is valid, user is authenticated
    res.status(200).json({ message: 'Protected route accessed' });
});


module.exports = router;
