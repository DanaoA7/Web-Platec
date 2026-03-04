import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import pool from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Student Self-Registration (Mobile)
router.post('/register', async (req, res) => {
  try {
    const { student_id, full_name, email, password, phone, program_id, year_level_id, section_id } = req.body;

    if (!student_id || !full_name || !email || !password || !program_id || !year_level_id || !section_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if student already exists
    const existingStudent = await pool.query('SELECT id FROM students WHERE email = $1 OR student_id = $2', [
      email,
      student_id,
    ]);

    if (existingStudent.rows.length > 0) {
      return res.status(400).json({ error: 'Student with this email or ID already exists' });
    }

    // Validate program, year level, and section exist
    const programCheck = await pool.query('SELECT id FROM programs WHERE id = $1', [program_id]);
    const yearCheck = await pool.query('SELECT id FROM year_levels WHERE id = $1', [year_level_id]);
    const sectionCheck = await pool.query('SELECT id FROM sections WHERE id = $1', [section_id]);

    if (programCheck.rows.length === 0 || yearCheck.rows.length === 0 || sectionCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid program, year level, or section' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create student (pending approval)
    const result = await pool.query(
      `INSERT INTO students (student_id, full_name, email, password_hash, phone, program_id, year_level_id, section_id, approval_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
       RETURNING id, student_id, full_name, email, phone, program_id, year_level_id, section_id, approval_status, created_at`,
      [student_id, full_name, email, hashedPassword, phone || null, program_id, year_level_id, section_id]
    );

    res.status(201).json({
      message: 'Registration successful. Awaiting admin approval.',
      student: result.rows[0],
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Student Login (Mobile)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM students WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const student = result.rows[0];

    // Check approval status
    if (student.approval_status !== 'approved') {
      return res.status(403).json({
        error: 'Your account is pending approval. Please wait for admin verification.',
        approval_status: student.approval_status,
      });
    }

    const passwordMatch = await bcryptjs.compare(password, student.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: student.id, email: student.email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      student: {
        id: student.id,
        student_id: student.student_id,
        full_name: student.full_name,
        email: student.email,
      },
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Student Profile
router.get('/profile', verifyToken, async (req, res) => {
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
       WHERE s.id = $1 AND s.approval_status = 'approved'`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Student Attendance History
router.get('/attendance/history', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT 
        a.id, a.attendance_date, a.status,
        t.full_name as marked_by,
        s.student_id, s.full_name
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      LEFT JOIN teachers t ON a.marked_by = t.id
      WHERE s.id = $1
    `;

    const params = [req.user.id];
    let paramCount = 2;

    if (startDate && endDate) {
      query += ` AND a.attendance_date BETWEEN $${paramCount} AND $${paramCount + 1}`;
      params.push(startDate, endDate);
      paramCount += 2;
    }

    query += ' ORDER BY a.attendance_date DESC';

    const result = await pool.query(query, params);

    // Calculate statistics
    const stats = {
      total: result.rows.length,
      present: result.rows.filter((r) => r.status === 'Present').length,
      absent: result.rows.filter((r) => r.status === 'Absent').length,
      late: result.rows.filter((r) => r.status === 'Late').length,
    };

    res.json({
      attendance: result.rows,
      statistics: stats,
    });
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Student Notifications
router.get('/notifications', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, type, title, message, is_read, created_at, related_attendance_id
       FROM notifications
       WHERE student_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark Notification as Read
router.put('/notifications/:id/read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE id = $1 AND student_id = $2
       RETURNING id, is_read`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Notification
router.delete('/notifications/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM notifications WHERE id = $1 AND student_id = $2 RETURNING id', [
      id,
      req.user.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
