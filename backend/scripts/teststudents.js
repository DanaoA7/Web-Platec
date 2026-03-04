// import pool from '../src/db.js';

// async function testStudents() {
//       // Insert demo teachers with IDs 4, 5, 6, 7 if not present
//       const demoTeachers = [
//         { id: 4, admin_id: 'T1001', full_name: 'Super Admin', email: 'nodetest3@example.com', password_hash: '$2b$10$Y63Lr46IKtIJgpKW/2kgOBKTt/k1FOPP6zX1QzlBSd7zWHLw1Qw1y', phone: '09170000004', department: 'IT', is_active: true },
//         { id: 5, admin_id: 'T1005', full_name: 'Artchie Danao', email: 'act.artchiedanao@gmail.com', password_hash: '$2b$10$vmR5NwQ4y00KTskTcGxPuuOdrahJvHSoTf0KzUaBMGgTn6QwQw1y', phone: '09170000005', department: 'CS', is_active: true },
//         { id: 6, admin_id: 'T1006', full_name: 'shiena', email: 'act.smgomez@gmail.com', password_hash: '$2b$10$9uafsdMcXG7.bcr5M9wa5Oo.LErQ4o6JHPMEYMHeeQj4D9QwQw1y', phone: '09170000006', department: 'Math', is_active: true },
//         { id: 7, admin_id: 'T1007', full_name: 'ferlyn', email: 'ferlyn@gmail.com', password_hash: '$2b$10$Sn4ujYFH6t3SJv/yxnCaeWyKMiop0Bl/nYggeonDGfUuoccwDQwQw1y', phone: '09170000007', department: 'Science', is_active: true },
//       ];
//       for (const t of demoTeachers) {
//         const exists = await pool.query('SELECT id FROM teachers WHERE id = $1', [t.id]);
//         if (exists.rows.length === 0) {
//           await pool.query(
//             `INSERT INTO teachers (id, admin_id, full_name, email, password_hash, phone, department, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
//             [t.id, t.admin_id, t.full_name, t.email, t.password_hash, t.phone, t.department, t.is_active]
//           );
//           console.log(`Inserted demo teacher: ${t.full_name}`);
//         }
//       }
//   try {
//     console.log('🔍 Checking database connection...');

//     // Test DB connection
//     await pool.query('SELECT NOW()');
//     console.log('✅ Database connected successfully.\n');

//     // Check reference tables first
//     const programs = await pool.query('SELECT id, name FROM programs');
//     const yearLevels = await pool.query('SELECT id, level FROM year_levels');
//     const sections = await pool.query('SELECT id, name FROM sections');
//     const admin = await pool.query('SELECT id, full_name FROM teachers');
//     const dbName = await pool.query('SELECT current_database()');
//     console.log('Connected to DB:', dbName.rows[0].current_database);

//     console.log('📘 Programs:', programs.rows);
//     console.log('🎓 Year Levels:', yearLevels.rows);
//     console.log('🏫 Sections:', sections.rows);
//     // console.log('👨‍🏫 Teachers:', teachers.rows);
//     console.log('-----------------------------------');

//     // Insert demo reference data if missing
//     const demoProgram = { name: 'BS Information Technology', description: 'Demo program' };
//     const demoYearLevel = { level: '4th Year', description: 'Demo year level' };
//     const demoSection = { name: 'Section 802A', description: 'Demo section' };
//     const demoTeacher = {
//       teacher_id: 'T1001', full_name: 'Mr. Demo Teacher', email: 'demo.teacher@example.com', password_hash: '$2b$10$demoteacher', phone: '09170000000', department: 'Computer Science', is_active: true
//     };

//     // Insert program
//     let programId = 1;
//     const programRes = await pool.query('SELECT id FROM programs WHERE name = $1', [demoProgram.name]);
//     if (programRes.rows.length === 0) {
//       const insert = await pool.query('INSERT INTO programs (name, description) VALUES ($1, $2) RETURNING id', [demoProgram.name, demoProgram.description]);
//       programId = insert.rows[0].id;
//       console.log('Inserted demo program');
//     } else {
//       programId = programRes.rows[0].id;
//     }

//     // Insert year level
//     let yearLevelId = 1;
//     const yearRes = await pool.query('SELECT id FROM year_levels WHERE level = $1', [demoYearLevel.level]);
//     if (yearRes.rows.length === 0) {
//       const insert = await pool.query('INSERT INTO year_levels (level, description) VALUES ($1, $2) RETURNING id', [demoYearLevel.level, demoYearLevel.description]);
//       yearLevelId = insert.rows[0].id;
//       console.log('Inserted demo year level');
//     } else {
//       yearLevelId = yearRes.rows[0].id;
//     }

//     // Insert section
//     let sectionId = 1;
//     const sectionRes = await pool.query('SELECT id FROM sections WHERE name = $1', [demoSection.name]);
//     if (sectionRes.rows.length === 0) {
//       const insert = await pool.query('INSERT INTO sections (name, description) VALUES ($1, $2) RETURNING id', [demoSection.name, demoSection.description]);
//       sectionId = insert.rows[0].id;
//       console.log('Inserted demo section');
//     } else {
//       sectionId = sectionRes.rows[0].id;
//     }

//     // Insert teacher
//     // let teacherId = 1;
//     // const teacherRes = await pool.query('SELECT id FROM teachers WHERE teacher_id = $1', [demoTeacher.teacher_id]);
//     // if (teacherRes.rows.length === 0) {
//     //   const insert = await pool.query(
//     //     'INSERT INTO teachers (teacher_id, full_name, email, password_hash, phone, department, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
//     //     [demoTeacher.teacher_id, demoTeacher.full_name, demoTeacher.email, demoTeacher.password_hash, demoTeacher.phone, demoTeacher.department, demoTeacher.is_active]
//     //   );
//     //   teacherId = insert.rows[0].id;
//     //   console.log('Inserted demo teacher');
//     // } else {
//     //   teacherId = teacherRes.rows[0].id;
//     // }

//     // Insert static students and attendance for demo/testing
//     const staticStudents = [
//       // Approved by 1
//       { student_id: 'S26-200001', full_name: 'Anna Cruz', email: 'anna.cruzsaa1@example.com', password_hash: '$2b$10$static1', phone: '09170000001', program_id: programId, year_level_id: yearLevelId, section_id: sectionId, approval_status: 'approved', approved_by: 1, approved_at: new Date(), rejection_reason: null },
//       // Approved by 4
//       { student_id: 'S26-200002', full_name: 'Lara Mendoza', email: 'larasd.mendoza1@example.com', password_hash: '$2b$10$static20', phone: '09170000020', program_id: programId, year_level_id: yearLevelId, section_id: sectionId, approval_status: 'approved', approved_by: 4, approved_at: new Date(), rejection_reason: null },
//       // Approved by 5
//       { student_id: 'S26-200003', full_name: 'Miguel Santos', email: 'migueldds.santos1a@example.com', password_hash: '$2b$10$static21', phone: '09170000021', program_id: programId, year_level_id: yearLevelId, section_id: sectionId, approval_status: 'approved', approved_by: 5, approved_at: new Date(), rejection_reason: null },
//       // Approved by 6
//       { student_id: 'S26-200004', full_name: 'Nina Garcia', email: 'ninaasd.garcia1s@example.com', password_hash: '$2b$10$static22', phone: '09170000022', program_id: programId, year_level_id: yearLevelId, section_id: sectionId, approval_status: 'approved', approved_by: 5, approved_at: new Date(), rejection_reason: null },
//       // Approved by 7
//       { student_id: 'S26-200005', full_name: 'Oscar Lim', email: 'oscarsd.lim1a@example.com', password_hash: '$2b$10$static23', phone: '09170000023', program_id: programId, year_level_id: yearLevelId, section_id: sectionId, approval_status: 'approved', approved_by: 5, approved_at: new Date(), rejection_reason: null },
//     ];

//     // Insert students if not already present
//     for (const student of staticStudents) {
//       const exists = await pool.query('SELECT id FROM students WHERE student_id = $1', [student.student_id]);
//       if (exists.rows.length === 0) {
//         await pool.query(
//           `INSERT INTO students (student_id, full_name, email, password_hash, phone, program_id, year_level_id, section_id, approval_status, approved_by, approved_at, rejection_reason)
//            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
//           [
//             student.student_id,
//             student.full_name,
//             student.email,
//             student.password_hash,
//             student.phone,
//             student.program_id,
//             student.year_level_id,
//             student.section_id,
//             student.approval_status,
//             student.approved_by,
//             student.approved_at,
//             student.rejection_reason
//           ]
//         );
//         console.log(`Inserted student: ${student.full_name}`);
//       }
//     }

//     // Insert attendance for today
//     const today = new Date().toISOString().slice(0, 10);
//     const attendanceData = [
//       { student_id: 'S26-200001', status: 'Present' },
//       { student_id: 'S26-200002', status: 'Present' },
//       { student_id: 'S26-200003', status: 'Present' },
//       { student_id: 'S26-200004', status: 'Absent' },
//       { student_id: 'S26-200005', status: 'Late' }
//     ];
//     for (const att of attendanceData) {
//       // Get DB student id
//       const studentRow = await pool.query('SELECT id FROM students WHERE student_id = $1', [att.student_id]);
//       if (studentRow.rows.length > 0) {
//         const dbStudentId = studentRow.rows[0].id;
//         const exists = await pool.query('SELECT id FROM attendance WHERE student_id = $1 AND attendance_date = $2', [dbStudentId, today]);
//         if (exists.rows.length === 0) {
//           await pool.query(
//             `INSERT INTO attendance (student_id, attendance_date, status, marked_by, notes)
//              VALUES ($1,$2,$3,$4,$5)`,
//             [dbStudentId, today, att.status, teacherId, null]
//           );
//           console.log(`Inserted attendance for ${att.student_id}: ${att.status}`);
//         }
//       }
//     }

//     // Show students
//     const students = await pool.query(`
//       SELECT 
//         s.id,
//         s.student_id,
//         s.full_name,
//         s.email,
//         p.name AS program,
//         y.level AS year_level,
//         sec.name AS section,
//         s.approval_status
//       FROM students s
//       JOIN programs p ON s.program_id = p.id
//       JOIN year_levels y ON s.year_level_id = y.id
//       JOIN sections sec ON s.section_id = sec.id
//       LIMIT 10
//     `);

//     if (students.rows.length > 0) {
//       console.log('✅ Existing students found:\n');
//       students.rows.forEach((student) => {
//         console.log(student);
//       });
//     } else {
//       console.log('⚠️ No students found in the database.');
//     }

//   } catch (err) {
//     console.error('❌ Error querying database:', err.message);
//   } finally {
//     await pool.end();
//     process.exit(0);
//   }
// }

// testStudents();


import pool from '../src/db.js';

async function testStudents() {
  // Insert demo teachers with IDs 4, 5, 6, 7 if not present
  const demoTeachers = [
    { id: 4, admin_id: 'T1001', full_name: 'Super Admin', email: 'nodetest3@example.com', password_hash: '$2b$10$Y63Lr46IKtIJgpKW/2kgOBKTt/k1FOPP6zX1QzlBSd7zWHLw1Qw1y', phone: '09170000004', department: 'IT', is_active: true },
    { id: 5, admin_id: 'T1005', full_name: 'Artchie Danao', email: 'act.artchiedanao@gmail.com', password_hash: '$2b$10$vmR5NwQ4y00KTskTcGxPuuOdrahJvHSoTf0KzUaBMGgTn6QwQw1y', phone: '09170000005', department: 'CS', is_active: true },
    { id: 6, admin_id: 'T1006', full_name: 'shiena', email: 'act.smgomez@gmail.com', password_hash: '$2b$10$9uafsdMcXG7.bcr5M9wa5Oo.LErQ4o6JHPMEYMHeeQj4D9QwQw1y', phone: '09170000006', department: 'Math', is_active: true },
    { id: 7, admin_id: 'T1007', full_name: 'ferlyn', email: 'ferlyn@gmail.com', password_hash: '$2b$10$Sn4ujYFH6t3SJv/yxnCaeWyKMiop0Bl/nYggeonDGfUuoccwDQwQw1y', phone: '09170000007', department: 'Science', is_active: true },
  ];
  for (const t of demoTeachers) {
    const exists = await pool.query('SELECT id FROM teachers WHERE id = $1', [t.id]);
    if (exists.rows.length === 0) {
      await pool.query(
        `INSERT INTO teachers (id, admin_id, full_name, email, password_hash, phone, department, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [t.id, t.admin_id, t.full_name, t.email, t.password_hash, t.phone, t.department, t.is_active]
      );
      console.log(`Inserted demo teacher: ${t.full_name}`);
    }
  }
  try {
    console.log('🔍 Checking database connection...');

    // Test DB connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully.\n');

    // Check reference tables first
    const programs = await pool.query('SELECT id, name FROM programs');
    const yearLevels = await pool.query('SELECT id, level FROM year_levels');
    const sections = await pool.query('SELECT id, name FROM sections');
    const admin = await pool.query('SELECT id, full_name FROM teachers');
    const dbName = await pool.query('SELECT current_database()');
    console.log('Connected to DB:', dbName.rows[0].current_database);

    console.log('📘 Programs:', programs.rows);
    console.log('🎓 Year Levels:', yearLevels.rows);
    console.log('🏫 Sections:', sections.rows);
    console.log('-----------------------------------');

    // Insert demo reference data if missing
    // const demoProgram = { name: 'BS Information Technology', description: 'Demo program' };
    const demoProgram = { name: 'Bachelor of Science in Nursing', description: 'Nursing program'};
    const demoYearLevel = { level: '3rd Year', description: 'Third year level' };
    const demoSection = { name: 'Section 301N', description: 'Nursing section' };
    const demoTeacher = {
      teacher_id: 'T1001', full_name: 'Mr. Demo Teacher', email: 'demo.teacher@example.com', password_hash: '$2b$10$demoteacher', phone: '09170000000', department: 'Computer Science', is_active: true
    };

    // Insert program
    let programId = 1;
    const programRes = await pool.query('SELECT id FROM programs WHERE name = $1', [demoProgram.name]);
    if (programRes.rows.length === 0) {
      const insert = await pool.query('INSERT INTO programs (name, description) VALUES ($1, $2) RETURNING id', [demoProgram.name, demoProgram.description]);
      programId = insert.rows[0].id;
      console.log('Inserted demo program');
    } else {
      programId = programRes.rows[0].id;
    }

    // Insert year level
    let yearLevelId = 1;
    const yearRes = await pool.query('SELECT id FROM year_levels WHERE level = $1', [demoYearLevel.level]);
    if (yearRes.rows.length === 0) {
      const insert = await pool.query('INSERT INTO year_levels (level, description) VALUES ($1, $2) RETURNING id', [demoYearLevel.level, demoYearLevel.description]);
      yearLevelId = insert.rows[0].id;
      console.log('Inserted demo year level');
    } else {
      yearLevelId = yearRes.rows[0].id;
    }

    // Insert section
    let sectionId = 1;
    const sectionRes = await pool.query('SELECT id FROM sections WHERE name = $1', [demoSection.name]);
    if (sectionRes.rows.length === 0) {
      const insert = await pool.query('INSERT INTO sections (name, description) VALUES ($1, $2) RETURNING id', [demoSection.name, demoSection.description]);
      sectionId = insert.rows[0].id;
      console.log('Inserted demo section');
    } else {
      sectionId = sectionRes.rows[0].id;
    }

    // Insert static students and attendance for demo/testing
    const staticStudents = [
       {
    student_id: 'S26-300001', full_name: 'Anna Cruz', email: 'Shiena_Gomez.nursing1@example.com', password_hash: '$123123123', phone: '09170000031', program_id: programId, year_level_id: yearLevelId, section_id: sectionId, approval_status: 'pending', approved_by: null, approved_at: null, rejection_reason: null
  },
  {
    student_id: 'S26-300002', full_name: 'Lara Mendoza', email: 'Vannesa_Ylaya.nursing2@example.com', password_hash: '$123123123', phone: '09170000032', program_id: programId, year_level_id: yearLevelId, section_id: sectionId, approval_status: 'pending', approved_by: null, approved_at: null, rejection_reason: null
  },
  {
    student_id: 'S26-300003', full_name: 'Miguel Santos', email: 'Jerson_Vargas.nursing3@example.com', password_hash: '$123123123', phone: '09170000033', program_id: programId, year_level_id: yearLevelId, section_id: sectionId, approval_status: 'pending', approved_by: null, approved_at: null, rejection_reason: null}

  ];
      // Approved by 1
    //   { student_id: 'S26-200001', full_name: 'Anna Cruz', email: 'anna.cruzsaa1@example.com', password_hash: '$2b$10$static1', phone: '09170000001', program_id: programId, year_level_id: yearLevelId, section_id: sectionId, approval_status: 'approved', approved_by: 1, approved_at: new Date(), rejection_reason: null },
    //   // Approved by 4
    //   { student_id: 'S26-200002', full_name: 'Lara Mendoza', email: 'larasd.mendoza1@example.com', password_hash: '$2b$10$static20', phone: '09170000020', program_id: programId, year_level_id: yearLevelId, section_id: sectionId, approval_status: 'approved', approved_by: 4, approved_at: new Date(), rejection_reason: null },
    //   // Approved by 5
    //   { student_id: 'S26-200003', full_name: 'Miguel Santos', email: 'migueldds.santos1a@example.com', password_hash: '$2b$10$static21', phone: '09170000021', program_id: programId, year_level_id: yearLevelId, section_id: sectionId, approval_status: 'approved', approved_by: 5, approved_at: new Date(), rejection_reason: null },
    //   // Approved by 6
    //   { student_id: 'S26-200004', full_name: 'Nina Garcia', email: 'ninaasd.garcia1s@example.com', password_hash: '$2b$10$static22', phone: '09170000022', program_id: programId, year_level_id: yearLevelId, section_id: sectionId, approval_status: 'approved', approved_by: 5, approved_at: new Date(), rejection_reason: null },
    //   // Approved by 7
    //   { student_id: 'S26-200005', full_name: 'Oscar Lim', email: 'oscarsd.lim1a@example.com', password_hash: '$2b$10$static23', phone: '09170000023', program_id: programId, year_level_id: yearLevelId, section_id: sectionId, approval_status: 'approved', approved_by: 5, approved_at: new Date(), rejection_reason: null },
    // ];

    // Insert students if not already present
    for (const student of staticStudents) {
      const exists = await pool.query('SELECT id FROM students WHERE student_id = $1', [student.student_id]);
      if (exists.rows.length === 0) {
        await pool.query(
          `INSERT INTO students (student_id, full_name, email, password_hash, phone, program_id, year_level_id, section_id, approval_status, approved_by, approved_at, rejection_reason)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
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
        console.log(`Inserted student: ${student.full_name}`);
      }
    }

    // Fix: Define teacherId (admin ID) before attendance insertion
    const teacherId = 1; // Using admin teacher id as marked_by for attendance

    // Insert attendance for today
    // Insert attendance for today
const today = new Date().toISOString().slice(0, 10);
const attendanceData = [
  { student_id: 'S26-200001', status: 'Present' },
  { student_id: 'S26-200002', status: 'Present' },
  { student_id: 'S26-200003', status: 'Present' },
  { student_id: 'S26-200004', status: 'Absent' },
  { student_id: 'S26-200005', status: 'Late' }
];

// Assign a teacher/admin ID who approved the student
for (const att of attendanceData) {
  const studentRow = await pool.query('SELECT id, approved_by FROM students WHERE student_id = $1', [att.student_id]);
  if (studentRow.rows.length > 0) {
    const dbStudentId = studentRow.rows[0].id;
    const approvedBy = studentRow.rows[0].approved_by; // use this teacher/admin ID

    const exists = await pool.query(
      'SELECT id FROM attendance WHERE student_id = $1 AND attendance_date = $2',
      [dbStudentId, today]
    );

    if (exists.rows.length === 0) {
      await pool.query(
        `INSERT INTO attendance (student_id, attendance_date, status, marked_by, notes)
         VALUES ($1, $2, $3, $4, $5)`,
        [dbStudentId, today, att.status, approvedBy, null]
      );
      console.log(`Inserted attendance for ${att.student_id}: ${att.status}`);
    }
  }
}


    // const today = new Date().toISOString().slice(0, 10);
    // const attendanceData = [
    //   { student_id: 'S26-200001', status: 'Present' },
    //   { student_id: 'S26-200002', status: 'Present' },
    //   { student_id: 'S26-200003', status: 'Present' },
    //   { student_id: 'S26-200004', status: 'Absent' },
    //   { student_id: 'S26-200005', status: 'Late' }
    // ];
    // for (const att of attendanceData) {
    //   // Get DB student id
    //   const studentRow = await pool.query('SELECT id FROM students WHERE student_id = $1', [att.student_id]);
    //   if (studentRow.rows.length > 0) {
    //     const dbStudentId = studentRow.rows[0].id;
    //     const exists = await pool.query('SELECT id FROM attendance WHERE student_id = $1 AND attendance_date = $2', [dbStudentId, today]);
    //     if (exists.rows.length === 0) {
    //       await pool.query(
    //         `INSERT INTO attendance (student_id, attendance_date, status, marked_by, notes)
    //          VALUES ($1,$2,$3,$4,$5)`,
    //         [dbStudentId, today, att.status, teacherId, null]
    //       );
    //       console.log(`Inserted attendance for ${att.student_id}: ${att.status}`);
    //     }
    //   }
    // }

    // Show students
    const students = await pool.query(`
      SELECT 
        s.id,
        s.student_id,
        s.full_name,
        s.email,
        p.name AS program,
        y.level AS year_level,
        sec.name AS section,
        s.approval_status
      FROM students s
      JOIN programs p ON s.program_id = p.id
      JOIN year_levels y ON s.year_level_id = y.id
      JOIN sections sec ON s.section_id = sec.id
      LIMIT 10
    `);

    if (students.rows.length > 0) {
      console.log('✅ Existing students found:\n');
      students.rows.forEach((student) => {
        console.log(student);
      });
    } else {
      console.log('⚠️ No students found in the database.');
    }

  } catch (err) {
    console.error('❌ Error querying database:', err.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

testStudents();