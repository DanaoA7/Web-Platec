-- Admin Table (Single Admin Account)
CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Programs Table
CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Year Levels Table
CREATE TABLE IF NOT EXISTS year_levels (
  id SERIAL PRIMARY KEY,
  level VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sections Table
CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teachers Table (Created by Admin)
CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  teacher_id VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students Table (Self-Registered via Mobile)
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  program_id INT NOT NULL,
  year_level_id INT NOT NULL,
  section_id INT NOT NULL,
  approval_status VARCHAR(20) DEFAULT 'pending',
  approved_by INT,
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  FOREIGN KEY (year_level_id) REFERENCES year_levels(id) ON DELETE CASCADE,
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES teachers(id) ON DELETE SET NULL
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
  marked_by INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (marked_by) REFERENCES teachers(id) ON DELETE SET NULL,
  UNIQUE(student_id, attendance_date)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_attendance_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (related_attendance_id) REFERENCES attendance(id) ON DELETE SET NULL
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_students_program ON students(program_id);
CREATE INDEX IF NOT EXISTS idx_students_year_level ON students(year_level_id);
CREATE INDEX IF NOT EXISTS idx_students_section ON students(section_id);
CREATE INDEX IF NOT EXISTS idx_students_approval_status ON students(approval_status);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_marked_by ON attendance(marked_by);
CREATE INDEX IF NOT EXISTS idx_notifications_student ON notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);


-- Migrate Sections to support Year Level + Semester Structure
-- Format: Year Level (1-4) + Semester (1-2) = Section Code
-- Example: 1st Year 1st Semester = 301, 1st Year 2nd Semester = 401
--          4th Year 2nd Semester = 804

-- Clear existing sections
DELETE FROM sections;

-- Insert new sections based on Year Level + Semester
-- 1st Year Sections
INSERT INTO sections (name, description) VALUES
  ('101', '1st Year - 1st Semester'),
  ('102', '1st Year - 1st Semester'),
  ('103', '1st Year - 1st Semester'),
  ('104', '1st Year - 1st Semester'),
  ('201', '1st Year - 2nd Semester'),
  ('202', '1st Year - 2nd Semester'),
  ('203', '1st Year - 2nd Semester'),
  ('204', '1st Year - 2nd Semester');

-- 2nd Year Sections
INSERT INTO sections (name, description) VALUES
  ('301', '2nd Year - 1st Semester'),
  ('302', '2nd Year - 1st Semester'),
  ('303', '2nd Year - 1st Semester'),
  ('304', '2nd Year - 1st Semester'),
  ('401', '2nd Year - 2nd Semester'),
  ('402', '2nd Year - 2nd Semester'),
  ('403', '2nd Year - 2nd Semester'),
  ('404', '2nd Year - 2nd Semester');

-- 3rd Year Sections
INSERT INTO sections (name, description) VALUES
  ('501', '3rd Year - 1st Semester'),
  ('502', '3rd Year - 1st Semester'),
  ('503', '3rd Year - 1st Semester'),
  ('504', '3rd Year - 1st Semester'),
  ('601', '3rd Year - 2nd Semester'),
  ('602', '3rd Year - 2nd Semester'),
  ('603', '3rd Year - 2nd Semester'),
  ('604', '3rd Year - 2nd Semester');

-- 4th Year Sections
INSERT INTO sections (name, description) VALUES
  ('701', '4th Year - 1st Semester'),
  ('702', '4th Year - 1st Semester'),
  ('703', '4th Year - 1st Semester'),
  ('704', '4th Year - 1st Semester'),
  ('801', '4th Year - 2nd Semester'),
  ('802', '4th Year - 2nd Semester'),
  ('803', '4th Year - 2nd Semester'),
  ('804', '4th Year - 2nd Semester'),
  ('901', '4th Year - 2nd Semester (Extended)'),
  ('902', '4th Year - 2nd Semester (Extended)'),
  ('903', '4th Year - 2nd Semester (Extended)'),
  ('904', '4th Year - 2nd Semester (Extended)');

-- Update default sections in app.json for mobile

-- Add password column to students table if it doesn't exist
ALTER TABLE students
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Make program_id, year_level_id, section_id, and created_by optional for student self-registration
ALTER TABLE students
ALTER COLUMN program_id DROP NOT NULL;

ALTER TABLE students
ALTER COLUMN year_level_id DROP NOT NULL;

ALTER TABLE students
ALTER COLUMN section_id DROP NOT NULL;

ALTER TABLE students
ALTER COLUMN created_by DROP NOT NULL;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'general',
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX notifications_student_id (student_id),
  INDEX notifications_created_at (created_at)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
