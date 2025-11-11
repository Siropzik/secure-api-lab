const express = require('express');
const { users, documents, employees } = require('./data');

const app = express();
const PORT = 3000;

// JSON body
app.use(express.json());

// ----- LOGGING MIDDLEWARE -----
const loggingMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};
app.use(loggingMiddleware);

// ----- AUTH MIDDLEWARE -----
const authMiddleware = (req, res, next) => {
  const login = req.headers['x-login'];
  const password = req.headers['x-password'];

  const user = users.find(u => u.login === login && u.password === password);
  if (!user) {
    return res
      .status(401)
      .json({
        message:
          'Authentication failed. Please provide valid credentials in headers X-Login and X-Password.',
      });
  }
  req.user = user;
  next();
};

// ----- ADMIN ONLY MIDDLEWARE -----
const adminOnlyMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// ----- ROUTES -----

// Health
app.get('/', (req, res) => {
  res.send('Hello World! The server is running.');
});

// Documents: list (auth required)
app.get('/documents', authMiddleware, (req, res) => {
  res.status(200).json(documents);
});

// Documents: create (auth required) + validation
app.post('/documents', authMiddleware, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res
      .status(400)
      .json({ message: 'Bad Request. Fields "title" and "content" are required.' });
  }
  const newDocument = {
    id: Date.now(),
    title,
    content,
  };
  documents.push(newDocument);
  res.status(201).json(newDocument);
});

// Documents: delete by id (auth + admin required)
app.delete('/documents/:id', authMiddleware, adminOnlyMiddleware, (req, res) => {
  const documentId = parseInt(req.params.id, 10);
  const index = documents.findIndex(d => d.id === documentId);
  if (index === -1) {
    return res.status(404).json({ message: 'Document not found' });
  }
  documents.splice(index, 1);
  res.status(204).send();
});

// Employees: list (auth + admin only)
app.get('/employees', authMiddleware, adminOnlyMiddleware, (req, res) => {
  res.status(200).json(employees);
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Start
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
