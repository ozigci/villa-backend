const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/villas - List all villas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM villas ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// GET /api/villas/:id/items - List all items for a given villa
router.get('/:id/items', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM villa_items WHERE villa_id = $1 ORDER BY id',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// PUT /api/villas/:id/items - Update quantities for items in a villa
router.put('/:id/items', async (req, res) => {
  const { items } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const item of items) {
      await client.query(
        'UPDATE villa_items SET quantity = $1 WHERE id = $2 AND villa_id = $3',
        [item.quantity, item.id, req.params.id]
      );
    }

    await client.query('COMMIT');
    res.sendStatus(200);
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.sendStatus(500);

  } finally {
    client.release();
  }
});

module.exports = router;
