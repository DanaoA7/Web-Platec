import pool from '../src/db.js';
import bcryptjs from 'bcryptjs';

const fixAdminPassword = async () => {
  try {
    const email = 'admin@nurtureacademy.com';
    const newPassword = 'nurtureadmin';

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    const result = await pool.query(
      'UPDATE admin SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING id, full_name, email',
      [hashedPassword, email]
    );

    if (result.rows.length === 0) {
      console.log('Admin not found.');
    } else {
      console.log('✅ Admin password updated successfully!');
      console.log(result.rows[0]);
      console.log('New login password:', newPassword);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error updating admin password:', err);
    process.exit(1);
  }
};

fixAdminPassword();
