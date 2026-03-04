// using built-in fetch so we don't need extra packages

(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@nurtureacademy.com',
        password: 'nurtureadmin',
      }),
    });
    const data = await res.json().catch(() => null);
    console.log('status', res.status);
    console.log('data', data);
  } catch (err) {
    console.error('fetch error', err);
  }
})();
