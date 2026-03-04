import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import pool from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Admin Login (Single Admin Account)
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);

//     if (result.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     const admin = result.rows[0];
//     const passwordMatch = await bcryptjs.compare(password, admin.password_hash);

//     if (!passwordMatch) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     const token = jwt.sign(
//       { id: admin.id, email: admin.email, role: 'admin' },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       admin: {
//         id: admin.id,
//         full_name: admin.full_name,
//         email: admin.email,
//       },
//     });
//   } catch (error) {
//     console.error('Admin login error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Registration endpoint for new admin accounts (used by frontend)
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    console.log('Admin registration attempt:', { full_name, email });

    if (!full_name || !email || !password) {
      console.log('Missing fields in registration');
      return res.status(400).json({ error: 'Full name, email and password are required' });
    }

    // ensure there isn't already an account with this email
    const existing = await pool.query('SELECT id FROM admin WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log('Attempt to register existing admin email:', email);
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO admin (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, created_at`,
      [full_name, email, hashedPassword]
    );

    const admin = result.rows[0];
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server JWT configuration error' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, admin });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// existing login route follows
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt received:', { email, password });

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
    console.log('Database query result:', result.rows);

    if (result.rows.length === 0) {
      console.log('No admin found for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const admin = result.rows[0];
    console.log('Admin record:', admin);

    if (!admin.password_hash) {
      console.log('Admin password_hash is empty or null');
      return res.status(500).json({ error: 'Admin password not set' });
    }

    const passwordMatch = await bcryptjs.compare(password, admin.password_hash);
    console.log('Password match result:', passwordMatch);

    if (!passwordMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!process.env.JWT_SECRET) {
      console.log('JWT_SECRET missing in environment variables');
      return res.status(500).json({ error: 'Server JWT configuration error' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('JWT token generated:', token);

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Admin login error caught:', error);
    // include the error message so the frontend has a clue what went wrong
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});




// Get Admin Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, full_name, email, created_at FROM admin WHERE id = $1', [
      req.user.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Create Teacher Account (Admin Only)
router.post('/teachers', verifyToken, async (req, res) => {
  try {
    const { teacher_id, full_name, email, password, phone, department } = req.body;

    if (!teacher_id || !full_name || !email || !password) {
      return res
        .status(400)
        .json({ error: 'teacher_id, full_name, email, and password are required' });
    }

    // Check if teacher already exists
    const existingTeacher = await pool.query('SELECT id FROM teachers WHERE email = $1 OR teacher_id = $2', [
      email,
      teacher_id,
    ]);

    if (existingTeacher.rows.length > 0) {
      return res.status(400).json({ error: 'Teacher with this email or ID already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create teacher
    const result = await pool.query(
      `INSERT INTO teachers (teacher_id, full_name, email, password_hash, phone, department, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING id, teacher_id, full_name, email, phone, department, is_active, created_at`,
      [teacher_id, full_name, email, hashedPassword, phone || null, department || null]
    );

    res.status(201).json({
      message: 'Teacher account created successfully',
      teacher: result.rows[0],
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get All Teachers
router.get('/teachers', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, teacher_id, full_name, email, phone, department, is_active, created_at FROM teachers ORDER BY created_at DESC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Teacher
router.put('/teachers/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, department, is_active } = req.body;

    const result = await pool.query(
      `UPDATE teachers 
       SET full_name = COALESCE($1, full_name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           department = COALESCE($4, department),
           is_active = COALESCE($5, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, teacher_id, full_name, email, phone, department, is_active, updated_at`,
      [full_name, email, phone, department, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json({
      message: 'Teacher updated successfully',
      teacher: result.rows[0],
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Teacher
router.delete('/teachers/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM teachers WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Pending Student Approvals
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

// Approve Student Account
// router.post('/students/:id/approve', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(
//       `UPDATE students
//        SET approval_status = 'approved',
//            approved_by = NULL,
//            approved_at = CURRENT_TIMESTAMP,
//            updated_at = CURRENT_TIMESTAMP
//        WHERE id = $1 AND approval_status = 'pending'
//        RETURNING id, student_id, full_name, email, approval_status, approved_at`,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Student not found or not pending approval' });
//     }

//     res.json({
//       message: 'Student approved successfully',
//       student: result.rows[0],
//     });
//   } catch (error) {
//     console.error('Approve student error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.post('/students/:id/approve', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.adminId; // logged-in admin ID

    const result = await pool.query(
      `UPDATE students
       SET approval_status = 'approved',
           approved_by = $1,
           approved_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND approval_status = 'pending'
       RETURNING id, student_id, full_name, email, approval_status, approved_by, approved_at`,
      [adminId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found or not pending approval' });
    }

    res.json({
      message: 'Student approved successfully',
      approved_by_admin_id: adminId,
      student: result.rows[0],
    });

  } catch (error) {
    console.error('Approve student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject Student Account
// router.post('/students/:id/reject', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;

//     const result = await pool.query(
//       `UPDATE students
//        SET approval_status = 'rejected',
//            rejection_reason = $1,
//            updated_at = CURRENT_TIMESTAMP
//        WHERE id = $2 AND approval_status = 'pending'
//        RETURNING id, student_id, full_name, email, approval_status, rejection_reason`,
//       [reason || null, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Student not found or not pending approval' });
//     }

//     res.json({
//       message: 'Student rejected successfully',
//       student: result.rows[0],
//     });
//   } catch (error) {
//     console.error('Reject student error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.post('/students/:id/reject', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.adminId;

    const result = await pool.query(
      `UPDATE students
       SET approval_status = 'rejected',
           approved_by = $1,
           rejection_reason = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND approval_status = 'pending'
       RETURNING id, student_id, full_name, email, approval_status, approved_by, rejection_reason`,
      [adminId, reason || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found or not pending approval' });
    }

    res.json({
      message: 'Student rejected successfully',
      rejected_by_admin_id: adminId,
      student: result.rows[0],
    });

  } catch (error) {
    console.error('Reject student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get All Approved Students
// router.get('/students', verifyToken, async (req, res) => {
//   try {
//     // Only show students approved by the requesting admin
//     const approvedBy = req.query.approved_by || req.user?.id;
//     if (!approvedBy) {
//       return res.status(400).json({ error: 'Missing approved_by parameter or user id.' });
//     }
//     const result = await pool.query(
//       `SELECT 
//         s.id, s.student_id, s.full_name, s.email, s.phone,
//         p.name as program, y.level as year_level, sec.name as section,
//         s.approval_status, s.created_at
//        FROM students s
//        JOIN programs p ON s.program_id = p.id
//        JOIN year_levels y ON s.year_level_id = y.id
//        JOIN sections sec ON s.section_id = sec.id
//        WHERE s.approval_status = 'approved' AND s.approved_by = $1
//        ORDER BY s.created_at DESC`, [approvedBy]
//     );
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Get students error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Get all approved students — only those approved by logged-in admin
router.get('/students', verifyToken, async (req, res) => {
  try {
    const approvedBy = req.adminId; // or req.user.id

    const result = await pool.query(
      `SELECT 
         s.id, s.student_id, s.full_name, s.email, s.phone,
         p.name AS program, y.level AS year_level, sec.name AS section,
         s.approval_status, s.created_at
       FROM students s
       JOIN programs p ON s.program_id = p.id
       JOIN year_levels y ON s.year_level_id = y.id
       JOIN sections sec ON s.section_id = sec.id
       WHERE s.approval_status = 'approved' AND s.approved_by = $1
       ORDER BY s.created_at DESC`,
      [approvedBy]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
