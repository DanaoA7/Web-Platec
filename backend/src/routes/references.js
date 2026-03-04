import express from 'express';
import pool from '../db.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Get all programs
router.get('/programs', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM programs ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all year levels
router.get('/year-levels', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, level FROM year_levels ORDER BY level');
    res.json(result.rows);
  } catch (error) {
    console.error('Get year levels error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all sections
router.get('/sections', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM sections ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
