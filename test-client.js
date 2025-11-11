// Адреса вашого локального сервера
const BASE_URL = 'http://localhost:3000';

// Дані для аутентифікації
const userCredentials = {
  'X-Login': 'user1',
  'X-Password': 'password123',
};

const adminCredentials = {
  'X-Login': 'admin1',
  'X-Password': 'password123',
};

const runTests = async () => {
  console.log('--- Running API Tests ---');

  // TEST 1: user -> GET /documents (200)
  console.log('\n[TEST 1] Getting documents as a user...');
  try {
    const response = await fetch(`${BASE_URL}/documents`, {
      method: 'GET',
      headers: userCredentials,
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Data:', data);
  } catch (e) {
    console.error('Error:', e.message);
  }

  // TEST 2: user -> GET /employees (403)
  console.log('\n[TEST 2] Trying to get employees as a user...');
  try {
    const response = await fetch(`${BASE_URL}/employees`, {
      method: 'GET',
      headers: userCredentials,
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Data:', data);
  } catch (e) {
    console.error('Error:', e.message);
  }

  // TEST 3: admin -> GET /employees (200)
  console.log('\n[TEST 3] Getting employees as an admin...');
  try {
    const response = await fetch(`${BASE_URL}/employees`, {
      method: 'GET',
      headers: adminCredentials,
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Data:', data);
  } catch (e) {
    console.error('Error:', e.message);
  }

  // TEST 4: user -> POST /documents (201)
  console.log('\n[TEST 4] Creating a document as a user...');
  try {
    const response = await fetch(`${BASE_URL}/documents`, {
      method: 'POST',
      headers: { ...userCredentials, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Doc', content: '...' }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Data:', data);
  } catch (e) {
    console.error('Error:', e.message);
  }

  // TEST 5: user -> POST /documents (400)
  console.log('\n[TEST 5] Creating a document with missing title (should be 400)...');
  try {
    const response = await fetch(`${BASE_URL}/documents`, {
      method: 'POST',
      headers: { ...userCredentials, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'only content' }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Data:', data);
  } catch (e) {
    console.error('Error:', e.message);
  }

  console.log('\n--- Tests finished ---');
};

runTests();
