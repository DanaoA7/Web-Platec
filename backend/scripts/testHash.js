import bcryptjs from 'bcryptjs';
import pool from '../src/db.js';

const test = async () => {
  const email = 'admin@nurtureacademy.com';
  const password = 'nurtureadmin';

  const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
  const admin = result.rows[0];
  console.log('Admin record from DB:', admin);

  const match = await bcryptjs.compare(password, admin.password_hash);
  console.log('Does the password match?', match);
};

test();
