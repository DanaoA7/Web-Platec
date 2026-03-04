import fetch from 'node-fetch';

(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@nurtureacademy.com', password: 'nurtureadmin' }),
    });
    const body = await res.text();
    console.log('status', res.status);
    console.log('body', body);
  } catch (err) {
    console.error('fetch error', err);
  }
})();
