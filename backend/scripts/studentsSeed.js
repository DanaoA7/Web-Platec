// studentsSeed.js
// Script to seed students into the database for testing reports

import db from '../src/db.js';

const students = [
  {
    student_id: 'S1001',
    full_name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    password_hash: '$2b$10$examplehash1',
    phone: '09171234567',
    program_id: 1,
    year_level_id: 1,
    section_id: 1,
    approval_status: 'approved',
    approved_by: 1,
    approved_at: new Date(),
    rejection_reason: null
  },
  {
    student_id: 'S1002',
    full_name: 'Bob Smith',
    email: 'bob.smith@example.com',
    password_hash: '$2b$10$examplehash2',
    phone: '09181234567',
    program_id: 1,
    year_level_id: 1,
    section_id: 1,
    approval_status: 'pending',
    approved_by: null,
    approved_at: null,
    rejection_reason: null
  },
  {
    student_id: 'S1003',
    full_name: 'Charlie Lee',
    email: 'charlie.lee@example.com',
    password_hash: '$2b$10$examplehash3',
    phone: '09191234567',
    program_id: 2,
    year_level_id: 2,
    section_id: 2,
    approval_status: 'rejected',
    approved_by: 2,
    approved_at: new Date(),
    rejection_reason: 'Incomplete documents'
  }
];

async function seedStudents() {
  for (const student of students) {
    try {
      await db.query(
        `INSERT INTO students (
          student_id, full_name, email, password_hash, phone, program_id, year_level_id, section_id, approval_status, approved_by, approved_at, rejection_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          student.student_id,
          student.full_name,
          student.email,
          student.password_hash,
          student.phone,
          student.program_id,
          student.year_level_id,
          student.section_id,
          student.approval_status,
          student.approved_by,
          student.approved_at,
          student.rejection_reason
        ]
      );
      console.log(`Seeded: ${student.full_name}`);
    } catch (err) {
      console.error(`Error seeding ${student.full_name}:`, err.message);
    }
  }
  console.log('Student seeding complete.');
  process.exit();
}

seedStudents();
