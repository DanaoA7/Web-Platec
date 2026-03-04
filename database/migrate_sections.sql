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
