import express from 'express';
import pool from '../db.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Get all students with filters
router.get('/', verifyToken, async (req, res) => {
  try {
    const { programId, yearLevelId, sectionId } = req.query;

    let query =
      'SELECT s.id, s.student_id, s.full_name, s.email, p.name as program, y.level as year_level, sec.name as section FROM students s JOIN programs p ON s.program_id = p.id JOIN year_levels y ON s.year_level_id = y.id JOIN sections sec ON s.section_id = sec.id WHERE s.approval_status = \'approved\'';
    const params = [];
    let paramCount = 1;

    if (programId) {
      query += ` AND s.program_id = $${paramCount}`;
      params.push(programId);
      paramCount++;
    }

    if (yearLevelId) {
      query += ` AND s.year_level_id = $${paramCount}`;
      params.push(yearLevelId);
      paramCount++;
    }

    if (sectionId) {
      query += ` AND s.section_id = $${paramCount}`;
      params.push(sectionId);
      paramCount++;
    }

    query += ' ORDER BY s.student_id';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new student
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      studentId,
      fullName,
      email,
      programId,
      yearLevelId,
      sectionId,
    } = req.body;

    // Validate input
    if (
      !studentId ||
      !fullName ||
      !email ||
      !programId ||
      !yearLevelId ||
      !sectionId
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if student ID already exists
    const existingStudent = await pool.query(
      'SELECT * FROM students WHERE student_id = $1',
      [studentId]
    );

    if (existingStudent.rows.length > 0) {
      return res.status(400).json({ error: 'Student ID already exists' });
    }

    // Check if email already exists
    const existingEmail = await pool.query(
      'SELECT * FROM students WHERE email = $1',
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const result = await pool.query(
      'INSERT INTO students (student_id, full_name, email, program_id, year_level_id, section_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, student_id, full_name, email',
      [
        studentId,
        fullName,
        email,
        programId,
        yearLevelId,
        sectionId,
        req.adminId,
      ]
    );

    res.status(201).json({
      message: 'Student created successfully',
      student: result.rows[0],
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a student
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
