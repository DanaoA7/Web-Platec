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
