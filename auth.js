const express = require('express');
const pool = require('../db');
const { hashPassword, verifyPassword } = require('../auth');
const router = express.Router();

// Register a new user (optional for now)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await hashPassword(password);
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashed]
    );
    res.sendStatus(201); // Created
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Log in an existing user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) return res.sendStatus(401); // user not found

    const user = result.rows[0];
    const valid = await verifyPassword(password, user.password);

    if (!valid) return res.sendStatus(401); // password mismatch

    req.session.userId = user.id;
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
