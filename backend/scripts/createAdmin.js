import pool from '../src/db.js';
import bcryptjs from 'bcryptjs';

const createAdminAccount = async () => {
  try {
    console.log('Creating default admin account...');

    const fullName = 'Administrator';
    const email = 'admin@nurtureacademy.com';
    const password = 'nurtureadmin';

    // Check if admin already exists
    const existingAdmin = await pool.query('SELECT id FROM admin WHERE email = $1', [email]);

    if (existingAdmin.rows.length > 0) {
      console.log('Admin account already exists with email:', email);
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Insert the admin account
    const result = await pool.query(
      `INSERT INTO admin (full_name, email, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, full_name, email, created_at`,
      [fullName, email, hashedPassword]
    );

    const admin = result.rows[0];
    console.log('\n✓ Admin account created successfully!\n');
    console.log('Admin Details:');
    console.log('─'.repeat(50));
    console.log(`ID: ${admin.id}`);
    console.log(`Full Name: ${admin.full_name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${password}`);
    console.log(`Created: ${admin.created_at}`);
    console.log('─'.repeat(50));
    console.log('\nIMPORTANT: Change this password after first login!');
    console.log('Login URL: http://localhost:3000/login\n');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
};

createAdminAccount();
