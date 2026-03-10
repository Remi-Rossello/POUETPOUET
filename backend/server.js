const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === frontendOrigin) {
        callback(null, true);
        return;
      }

      callback(null, false);
    }
  })
);

function helloFromBackend() {
  const currentDate = new Date().toISOString().split('T')[0];
  return `Backend here, the current date is ${currentDate}`;
}

app.get('/api/hello', (req, res) => {
  res.json({ message: helloFromBackend() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
