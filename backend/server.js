const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

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
