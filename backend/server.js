const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://remi-rossello.up.railway.app/',
  process.env.FRONTEND_ORIGIN
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    }
  })
);

function helloFromBackend() {
  return 'hello from the backend';
}

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running.'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: helloFromBackend() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
