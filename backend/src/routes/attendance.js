// import express from 'express';
// import pool from '../db.js';
// import { verifyToken } from '../middleware/auth.js';

// const router = express.Router();

// // Get attendance statistics for a specific date
// router.get('/stats', verifyToken, async (req, res) => {
//   try {
//     const { date, programId, yearLevelId, sectionId } = req.query;

//     if (!date) {
//       return res.status(400).json({ error: 'Date is required' });
//     }

//     let query = `
//       SELECT 
//         COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present,
//         COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent,
//         COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late,
//         ROUND(COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) as attendance_percentage
//       FROM attendance a
//       JOIN students s ON a.student_id = s.id
//       WHERE a.attendance_date = $1
//     `;
//     const params = [date];
//     let paramCount = 2;

//     if (programId) {
//       query += ` AND s.program_id = $${paramCount}`;
//       params.push(programId);
//       paramCount++;
//     }

//     if (yearLevelId) {
//       query += ` AND s.year_level_id = $${paramCount}`;
//       params.push(yearLevelId);
//       paramCount++;
//     }

//     if (sectionId) {
//       query += ` AND s.section_id = $${paramCount}`;
//       params.push(sectionId);
//       paramCount++;
//     }

//     const result = await pool.query(query, params);
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Get stats error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get attendance records for a specific date
// router.get('/', verifyToken, async (req, res) => {
//   try {
//     const { date, programId, yearLevelId, sectionId } = req.query;

//     if (!date) {
//       return res.status(400).json({ error: 'Date is required' });
//     }

//     let query = `
//       SELECT 
//         s.id,
//         s.student_id,
//         s.full_name,
//         p.name as program,
//         y.level as year_level,
//         sec.name as section,
//         COALESCE(a.status, 'Not Marked') as status,
//         a.id as attendance_id
//       FROM students s
//       JOIN programs p ON s.program_id = p.id
//       JOIN year_levels y ON s.year_level_id = y.id
//       JOIN sections sec ON s.section_id = sec.id
//       LEFT JOIN attendance a ON s.id = a.student_id AND a.attendance_date = $1
//       WHERE s.approval_status = 'approved'
//     `;
//     const params = [date];
//     let paramCount = 2;

//     if (programId) {
//       query += ` AND s.program_id = $${paramCount}`;
//       params.push(programId);
//       paramCount++;
//     }

//     if (yearLevelId) {
//       query += ` AND s.year_level_id = $${paramCount}`;
//       params.push(yearLevelId);
//       paramCount++;
//     }

//     if (sectionId) {
//       query += ` AND s.section_id = $${paramCount}`;
//       params.push(sectionId);
//       paramCount++;
//     }

//     query += ' ORDER BY s.student_id';

//     const result = await pool.query(query, params);
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Get attendance error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Mark attendance for a student
// router.post('/', verifyToken, async (req, res) => {
//   try {
//     const { studentId, date, status } = req.body;

//     // Validate input
//     if (!studentId || !date || !status) {
//       return res.status(400).json({ error: 'Student ID, date, and status are required' });
//     }

//     if (!['Present', 'Absent', 'Late'].includes(status)) {
//       return res.status(400).json({ error: 'Invalid status' });
//     }

//     // Check if student exists
//     const studentExists = await pool.query('SELECT id FROM students WHERE id = $1', [
//       studentId,
//     ]);

//     if (studentExists.rows.length === 0) {
//       return res.status(404).json({ error: 'Student not found' });
//     }

//     // Check if attendance already exists
//     const existingAttendance = await pool.query(
//       'SELECT id FROM attendance WHERE student_id = $1 AND attendance_date = $2',
//       [studentId, date]
//     );

//     if (existingAttendance.rows.length > 0) {
//       // Update existing attendance
//       const result = await pool.query(
//         'UPDATE attendance SET status = $1, marked_by = $2, updated_at = CURRENT_TIMESTAMP WHERE student_id = $3 AND attendance_date = $4 RETURNING id, status',
//         [status, req.user.id, studentId, date]
//       );
//       return res.json({
//         message: 'Attendance updated successfully',
//         attendance: result.rows[0],
//       });
//     }

//     // Create new attendance record
//     const result = await pool.query(
//       'INSERT INTO attendance (student_id, attendance_date, status, marked_by) VALUES ($1, $2, $3, $4) RETURNING id, status',
//       [studentId, date, status, req.user.id]
//     );

//     res.status(201).json({
//       message: 'Attendance marked successfully',
//       attendance: result.rows[0],
//     });
//   } catch (error) {
//     console.error('Mark attendance error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get daily attendance reports
// router.get('/reports/daily', verifyToken, async (req, res) => {
//   try {
//     const { startDate, endDate, programId, yearLevelId, sectionId } = req.query;

//     if (!startDate || !endDate) {
//       return res.status(400).json({ error: 'Start date and end date are required' });
//     }

//     let query = `
//       SELECT 
//         a.attendance_date,
//         COUNT(*) as total_students,
//         COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_count,
//         COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_count,
//         COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_count,
//         ROUND(COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) as attendance_percentage
//       FROM attendance a
//       JOIN students s ON a.student_id = s.id
//       WHERE a.attendance_date BETWEEN $1 AND $2
//     `;
//     const params = [startDate, endDate];
//     let paramCount = 3;

//     if (programId) {
//       query += ` AND s.program_id = $${paramCount}`;
//       params.push(programId);
//       paramCount++;
//     }

//     if (yearLevelId) {
//       query += ` AND s.year_level_id = $${paramCount}`;
//       params.push(yearLevelId);
//       paramCount++;
//     }

//     if (sectionId) {
//       query += ` AND s.section_id = $${paramCount}`;
//       params.push(sectionId);
//       paramCount++;
//     }

//     query += ` GROUP BY a.attendance_date ORDER BY a.attendance_date DESC`;

//     const result = await pool.query(query, params);
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Get daily reports error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get weekly attendance reports
// router.get('/reports/weekly', verifyToken, async (req, res) => {
//   try {
//     const { startDate, endDate, programId, yearLevelId, sectionId } = req.query;

//     if (!startDate || !endDate) {
//       return res.status(400).json({ error: 'Start date and end date are required' });
//     }

//     let query = `
//       SELECT 
//         DATE_TRUNC('week', a.attendance_date)::date as week_start,
//         DATE_TRUNC('week', a.attendance_date)::date + INTERVAL '6 days' as week_end,
//         COUNT(*) as total_records,
//         COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_count,
//         COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_count,
//         COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_count,
//         ROUND(COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) as attendance_percentage
//       FROM attendance a
//       JOIN students s ON a.student_id = s.id
//       WHERE a.attendance_date BETWEEN $1 AND $2
//     `;
//     const params = [startDate, endDate];
//     let paramCount = 3;

//     if (programId) {
//       query += ` AND s.program_id = $${paramCount}`;
//       params.push(programId);
//       paramCount++;
//     }

//     if (yearLevelId) {
//       query += ` AND s.year_level_id = $${paramCount}`;
//       params.push(yearLevelId);
//       paramCount++;
//     }

//     if (sectionId) {
//       query += ` AND s.section_id = $${paramCount}`;
//       params.push(sectionId);
//       paramCount++;
//     }

//     query += ` GROUP BY DATE_TRUNC('week', a.attendance_date) ORDER BY week_start DESC`;

//     const result = await pool.query(query, params);
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Get weekly reports error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get student attendance history
// router.get('/reports/student/:studentId', verifyToken, async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     const { startDate, endDate } = req.query;

//     if (!startDate || !endDate) {
//       return res.status(400).json({ error: 'Start date and end date are required' });
//     }

//     const query = `
//       SELECT 
//         s.student_id,
//         s.full_name,
//         p.name as program,
//         y.level as year_level,
//         sec.name as section,
//         a.attendance_date,
//         a.status,
//         COUNT(CASE WHEN a.status = 'Present' THEN 1 END) OVER (PARTITION BY a.student_id ORDER BY a.attendance_date) as present_count,
//         COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) OVER (PARTITION BY a.student_id ORDER BY a.attendance_date) as absent_count,
//         COUNT(CASE WHEN a.status = 'Late' THEN 1 END) OVER (PARTITION BY a.student_id ORDER BY a.attendance_date) as late_count
//       FROM attendance a
//       JOIN students s ON a.student_id = s.id
//       JOIN programs p ON s.program_id = p.id
//       JOIN year_levels y ON s.year_level_id = y.id
//       JOIN sections sec ON s.section_id = sec.id
//       WHERE a.student_id = $1 AND a.attendance_date BETWEEN $2 AND $3
//       ORDER BY a.attendance_date DESC
//     `;

//     const result = await pool.query(query, [studentId, startDate, endDate]);
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Get student history error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// export default router;


// import express from 'express';
// import pool from '../db.js';
// import { verifyToken } from '../middleware/auth.js';

// const router = express.Router();

// // Get attendance statistics for a specific date
// router.get('/stats', verifyToken, async (req, res) => {
//   try {
//     const { date, programId, yearLevelId, sectionId } = req.query;

//     if (!date) return res.status(400).json({ error: 'Date is required' });

//     let query = `
//       SELECT 
//         COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present,
//         COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent,
//         COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late,
//         ROUND(COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) as attendance_percentage
//       FROM attendance a
//       JOIN students s ON a.student_id = s.id
//       WHERE a.attendance_date = $1 AND s.approved_by = $2
//     `;

//     const params = [date, req.adminId]; // filter by logged-in admin
//     let paramCount = 3;

//     if (programId) {
//       query += ` AND s.program_id = $${paramCount}`;
//       params.push(programId);
//       paramCount++;
//     }
//     if (yearLevelId) {
//       query += ` AND s.year_level_id = $${paramCount}`;
//       params.push(yearLevelId);
//       paramCount++;
//     }
//     if (sectionId) {
//       query += ` AND s.section_id = $${paramCount}`;
//       params.push(sectionId);
//       paramCount++;
//     }

//     const result = await pool.query(query, params);
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Get stats error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get attendance records for a specific date
// router.get('/', verifyToken, async (req, res) => {
//   try {
//     const { date, programId, yearLevelId, sectionId } = req.query;

//     if (!date) return res.status(400).json({ error: 'Date is required' });

//     let query = `
//       SELECT 
//         s.id,
//         s.student_id,
//         s.full_name,
//         p.name as program,
//         y.level as year_level,
//         sec.name as section,
//         COALESCE(a.status, 'Not Marked') as status,
//         a.id as attendance_id
//       FROM students s
//       JOIN programs p ON s.program_id = p.id
//       JOIN year_levels y ON s.year_level_id = y.id
//       JOIN sections sec ON s.section_id = sec.id
//       LEFT JOIN attendance a ON s.id = a.student_id AND a.attendance_date = $1
//       WHERE s.approval_status = 'approved' AND s.approved_by = $2
//     `;

//     const params = [date, req.adminId];
//     let paramCount = 3;

//     if (programId) {
//       query += ` AND s.program_id = $${paramCount}`;
//       params.push(programId);
//       paramCount++;
//     }
//     if (yearLevelId) {
//       query += ` AND s.year_level_id = $${paramCount}`;
//       params.push(yearLevelId);
//       paramCount++;
//     }
//     if (sectionId) {
//       query += ` AND s.section_id = $${paramCount}`;
//       params.push(sectionId);
//       paramCount++;
//     }

//     query += ' ORDER BY s.student_id';
//     const result = await pool.query(query, params);
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Get attendance error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Mark attendance for a student
// router.post('/', verifyToken, async (req, res) => {
//   try {
//     const { studentId, date, status } = req.body;

//     if (!studentId || !date || !status)
//       return res.status(400).json({ error: 'Student ID, date, and status are required' });

//     if (!['Present', 'Absent', 'Late'].includes(status))
//       return res.status(400).json({ error: 'Invalid status' });

//     // Ensure student exists AND was approved by this admin
//     const studentResult = await pool.query(
//       'SELECT id FROM students WHERE id = $1 AND approved_by = $2',
//       [studentId, req.adminId]
//     );

//     if (studentResult.rows.length === 0)
//       return res.status(403).json({ error: 'You are not allowed to mark attendance for this student' });

//     // Check if attendance already exists
//     const existingAttendance = await pool.query(
//       'SELECT id FROM attendance WHERE student_id = $1 AND attendance_date = $2',
//       [studentId, date]
//     );

//     if (existingAttendance.rows.length > 0) {
//       const result = await pool.query(
//         'UPDATE attendance SET status = $1, marked_by = $2, updated_at = CURRENT_TIMESTAMP WHERE student_id = $3 AND attendance_date = $4 RETURNING id, status',
//         [status, req.adminId, studentId, date]
//       );
//       return res.json({ message: 'Attendance updated successfully', attendance: result.rows[0] });
//     }

//     const result = await pool.query(
//       'INSERT INTO attendance (student_id, attendance_date, status, marked_by) VALUES ($1, $2, $3, $4) RETURNING id, status',
//       [studentId, date, status, req.adminId]
//     );

//     res.status(201).json({ message: 'Attendance marked successfully', attendance: result.rows[0] });
//   } catch (error) {
//     console.error('Mark attendance error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Daily, weekly, and student-specific reports
// // Add s.approved_by = req.adminId filter to all report queries
// // Example: daily report
// router.get('/reports/daily', verifyToken, async (req, res) => {
//   try {
//     const { startDate, endDate, programId, yearLevelId, sectionId } = req.query;

//     if (!startDate || !endDate) return res.status(400).json({ error: 'Start date and end date are required' });

//     let query = `
//       SELECT 
//         a.attendance_date,
//         COUNT(*) as total_students,
//         COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_count,
//         COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_count,
//         COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_count,
//         ROUND(COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) as attendance_percentage
//       FROM attendance a
//       JOIN students s ON a.student_id = s.id
//       WHERE a.attendance_date BETWEEN $1 AND $2 AND s.approved_by = $3
//     `;

//     const params = [startDate, endDate, req.adminId];
//     let paramCount = 4;

//     if (programId) {
//       query += ` AND s.program_id = $${paramCount}`;
//       params.push(programId);
//       paramCount++;
//     }
//     if (yearLevelId) {
//       query += ` AND s.year_level_id = $${paramCount}`;
//       params.push(yearLevelId);
//       paramCount++;
//     }
//     if (sectionId) {
//       query += ` AND s.section_id = $${paramCount}`;
//       params.push(sectionId);
//       paramCount++;
//     }

//     query += ` GROUP BY a.attendance_date ORDER BY a.attendance_date DESC`;
//     const result = await pool.query(query, params);
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Get daily reports error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// export default router;






import express from 'express';
import pool from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get attendance statistics for a specific date
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const { date, programId, yearLevelId, sectionId } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    let query = `
      SELECT 
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present,
        COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent,
        COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late,
        ROUND(COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) as attendance_percentage
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.attendance_date = $1 AND s.approved_by = $2
    `;

    const params = [date, req.adminId];
    let paramCount = 3;

    if (programId) { query += ` AND s.program_id = $${paramCount}`; params.push(programId); paramCount++; }
    if (yearLevelId) { query += ` AND s.year_level_id = $${paramCount}`; params.push(yearLevelId); paramCount++; }
    if (sectionId) { query += ` AND s.section_id = $${paramCount}`; params.push(sectionId); paramCount++; }

    const result = await pool.query(query, params);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get attendance records for a specific date
router.get('/', verifyToken, async (req, res) => {
  try {
    const { date, programId, yearLevelId, sectionId } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    let query = `
      SELECT 
        s.id,
        s.student_id,
        s.full_name,
        p.name as program,
        y.level as year_level,
        sec.name as section,
        COALESCE(a.status, 'Not Marked') as status,
        a.id as attendance_id
      FROM students s
      JOIN programs p ON s.program_id = p.id
      JOIN year_levels y ON s.year_level_id = y.id
      JOIN sections sec ON s.section_id = sec.id
      LEFT JOIN attendance a ON s.id = a.student_id AND a.attendance_date = $1
      WHERE s.approval_status = 'approved' AND s.approved_by = $2
    `;

    const params = [date, req.adminId];
    let paramCount = 3;

    if (programId) { query += ` AND s.program_id = $${paramCount}`; params.push(programId); paramCount++; }
    if (yearLevelId) { query += ` AND s.year_level_id = $${paramCount}`; params.push(yearLevelId); paramCount++; }
    if (sectionId) { query += ` AND s.section_id = $${paramCount}`; params.push(sectionId); paramCount++; }

    query += ' ORDER BY s.student_id';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark attendance for a student
router.post('/', verifyToken, async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    if (!studentId || !date || !status)
      return res.status(400).json({ error: 'Student ID, date, and status are required' });

    if (!['Present', 'Absent', 'Late'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });

    const studentResult = await pool.query(
      'SELECT id FROM students WHERE id = $1 AND approved_by = $2',
      [studentId, req.adminId]
    );
    if (studentResult.rows.length === 0)
      return res.status(403).json({ error: 'You are not allowed to mark attendance for this student' });

    const existingAttendance = await pool.query(
      'SELECT id FROM attendance WHERE student_id = $1 AND attendance_date = $2',
      [studentId, date]
    );

    if (existingAttendance.rows.length > 0) {
      const result = await pool.query(
        'UPDATE attendance SET status = $1, marked_by = $2, updated_at = CURRENT_TIMESTAMP WHERE student_id = $3 AND attendance_date = $4 RETURNING id, status',
        [status, req.adminId, studentId, date]
      );
      return res.json({ message: 'Attendance updated successfully', attendance: result.rows[0] });
    }

    const result = await pool.query(
      'INSERT INTO attendance (student_id, attendance_date, status, marked_by) VALUES ($1, $2, $3, $4) RETURNING id, status',
      [studentId, date, status, req.adminId]
    );
    res.status(201).json({ message: 'Attendance marked successfully', attendance: result.rows[0] });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Daily attendance report
router.get('/reports/daily', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, programId, yearLevelId, sectionId } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ error: 'Start date and end date are required' });

    let query = `
      SELECT 
        a.attendance_date,
        COUNT(*) as total_students,
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_count,
        COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_count,
        COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_count,
        ROUND(COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) as attendance_percentage
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.attendance_date BETWEEN $1 AND $2 AND s.approved_by = $3
    `;

    const params = [startDate, endDate, req.adminId];
    let paramCount = 4;
    if (programId) { query += ` AND s.program_id = $${paramCount}`; params.push(programId); paramCount++; }
    if (yearLevelId) { query += ` AND s.year_level_id = $${paramCount}`; params.push(yearLevelId); paramCount++; }
    if (sectionId) { query += ` AND s.section_id = $${paramCount}`; params.push(sectionId); paramCount++; }

    query += ' GROUP BY a.attendance_date ORDER BY a.attendance_date DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get daily reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Weekly attendance report
router.get('/reports/weekly', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, programId, yearLevelId, sectionId } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ error: 'Start date and end date are required' });

    let query = `
      SELECT 
        DATE_TRUNC('week', a.attendance_date)::date as week_start,
        DATE_TRUNC('week', a.attendance_date)::date + INTERVAL '6 days' as week_end,
        COUNT(*) as total_records,
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_count,
        COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_count,
        COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_count,
        ROUND(COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) as attendance_percentage
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.attendance_date BETWEEN $1 AND $2 AND s.approved_by = $3
    `;

    const params = [startDate, endDate, req.adminId];
    let paramCount = 4;
    if (programId) { query += ` AND s.program_id = $${paramCount}`; params.push(programId); paramCount++; }
    if (yearLevelId) { query += ` AND s.year_level_id = $${paramCount}`; params.push(yearLevelId); paramCount++; }
    if (sectionId) { query += ` AND s.section_id = $${paramCount}`; params.push(sectionId); paramCount++; }

    query += ' GROUP BY DATE_TRUNC(\'week\', a.attendance_date) ORDER BY week_start DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get weekly reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Student-specific attendance history
router.get('/reports/student/:studentId', verifyToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ error: 'Start date and end date are required' });

    // Ensure student was approved by this admin
    const studentCheck = await pool.query(
      'SELECT id FROM students WHERE id = $1 AND approved_by = $2',
      [studentId, req.adminId]
    );
    if (studentCheck.rows.length === 0)
      return res.status(403).json({ error: 'You are not allowed to view this student\'s attendance' });

    const query = `
      SELECT 
        s.student_id,
        s.full_name,
        p.name as program,
        y.level as year_level,
        sec.name as section,
        a.attendance_date,
        a.status,
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) OVER (PARTITION BY a.student_id ORDER BY a.attendance_date) as present_count,
        COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) OVER (PARTITION BY a.student_id ORDER BY a.attendance_date) as absent_count,
        COUNT(CASE WHEN a.status = 'Late' THEN 1 END) OVER (PARTITION BY a.student_id ORDER BY a.attendance_date) as late_count
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN programs p ON s.program_id = p.id
      JOIN year_levels y ON s.year_level_id = y.id
      JOIN sections sec ON s.section_id = sec.id
      WHERE a.student_id = $1 AND a.attendance_date BETWEEN $2 AND $3
      ORDER BY a.attendance_date DESC
    `;
    const result = await pool.query(query, [studentId, startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    console.error('Get student history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;