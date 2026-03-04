import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import adminRoutes from './routes/admin.js';
import studentRoutes from './routes/students.js';
import studentAuthRoutes from './routes/studentAuth.js';
import teacherAuthRoutes from './routes/teacherAuth.js';
import attendanceRoutes from './routes/attendance.js';
import referenceRoutes from './routes/references.js';

dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// simple request logger for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/teacher-auth', teacherAuthRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/student-auth', studentAuthRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/references', referenceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Database Connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database Connection Failed:', err);
  });
