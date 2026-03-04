import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import pool from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Teacher Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM teachers WHERE email = $1 AND is_active = true', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const teacher = result.rows[0];
    const passwordMatch = await bcryptjs.compare(password, teacher.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: teacher.id, email: teacher.email, role: 'teacher' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      teacher: {
        id: teacher.id,
        teacher_id: teacher.teacher_id,
        full_name: teacher.full_name,
        email: teacher.email,
      },
    });
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Teacher Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, teacher_id, full_name, email, phone, department, is_active, created_at 
       FROM teachers WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get teacher profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Pending Student Approvals (for Teachers)
router.get('/students/pending', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        s.id, s.student_id, s.full_name, s.email, s.phone,
        p.name as program, y.level as year_level, sec.name as section,
        s.approval_status, s.created_at
       FROM students s
       JOIN programs p ON s.program_id = p.id
       JOIN year_levels y ON s.year_level_id = y.id
       JOIN sections sec ON s.section_id = sec.id
       WHERE s.approval_status = 'pending'
       ORDER BY s.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get pending students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve Student Account (Teachers can approve)
router.post('/students/:id/approve', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE students
       SET approval_status = 'approved',
           approved_by = $1,
           approved_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND approval_status = 'pending'
       RETURNING id, student_id, full_name, email, approval_status, approved_at`,
      [req.user.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found or not pending approval' });
    }

    res.json({
      message: 'Student approved successfully',
      student: result.rows[0],
    });
  } catch (error) {
    console.error('Approve student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject Student Account (Teachers can reject)
router.post('/students/:id/reject', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await pool.query(
      `UPDATE students
       SET approval_status = 'rejected',
           rejection_reason = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND approval_status = 'pending'
       RETURNING id, student_id, full_name, email, approval_status, rejection_reason`,
      [reason || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found or not pending approval' });
    }

    res.json({
      message: 'Student rejected successfully',
      student: result.rows[0],
    });
  } catch (error) {
    console.error('Reject student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
