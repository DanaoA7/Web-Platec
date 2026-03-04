import pool from '../src/db.js';

(async () => {
  try {
    const res = await pool.query('SELECT id, email, password_hash, created_at FROM admin');
    console.log('admins:', res.rows);
  } catch (err) {
    console.error('error querying admin table', err);
  } finally {
    process.exit(0);
  }
})();
