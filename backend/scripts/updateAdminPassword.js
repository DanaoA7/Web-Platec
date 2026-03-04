import pool from './src/db.js';
import bcryptjs from 'bcryptjs';

const updateAdminPassword = async () => {
  const password = 'nurtureadmin'; // or Admin@123456 if you prefer
  const hashedPassword = await bcryptjs.hash(password, 10);

  await pool.query(
    `UPDATE admin
     SET password_hash = $1
     WHERE email = $2`,
    [hashedPassword, 'admin@nurtureacademy.com']
  );

  console.log('✅ Admin password updated successfully!');
  process.exit(0);
};

updateAdminPassword();
