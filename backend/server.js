const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const ort = require('onnxruntime-node');

const MODEL_URL = 'https://media.githubusercontent.com/media/onnx/models/main/validated/vision/classification/mnist/model/mnist-8.onnx';
const MODEL_LOCAL_PATH = path.join(__dirname, 'models', 'mnist-8.onnx');
let sessionPromise;

function getFrontendOrigin() {
  if (process.env.FRONTEND_ORIGIN) {
    return process.env.FRONTEND_ORIGIN;
  }

  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^\s*FRONTEND_ORIGIN\s*=\s*(.+)\s*$/m);
    if (!match) {
      return undefined;
    }

    return match[1].replace(/^['"]|['"]$/g, '');
  } catch {
    return undefined;
  }
}

const app = express();
const port = process.env.PORT || 3000;
const frontendOrigin = getFrontendOrigin();

app.use(express.json({ limit: '1mb' }));

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
  return `Hello, Backend here, the current date is ${currentDate}`;
}

async function getDigitModel() {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      await fs.promises.mkdir(path.dirname(MODEL_LOCAL_PATH), { recursive: true });

      let shouldDownload = false;
      try {
        const modelStats = await fs.promises.stat(MODEL_LOCAL_PATH);
        // Guard against storing a tiny Git LFS pointer file instead of the binary model.
        shouldDownload = modelStats.size < 1000;
      } catch {
        shouldDownload = true;
      }

      if (shouldDownload) {
        const response = await fetch(MODEL_URL);
        if (!response.ok) {
          throw new Error(`Model download failed with status ${response.status}.`);
        }

        const arrayBuffer = await response.arrayBuffer();
        await fs.promises.writeFile(MODEL_LOCAL_PATH, Buffer.from(arrayBuffer));
      }

      return ort.InferenceSession.create(MODEL_LOCAL_PATH);
    })();
  }

  return sessionPromise;
}

function validateGridPayload(grid) {
  if (!Array.isArray(grid) || grid.length !== 28) {
    return false;
  }

  return grid.every(
    (row) =>
      Array.isArray(row)
      && row.length === 28
      && row.every((value) => Number.isFinite(value) && value >= 0 && value <= 1)
  );
}

app.get('/api/hello', (req, res) => {
  res.json({ message: helloFromBackend() });
});

app.post('/api/predict-digit', async (req, res) => {
  const { grid } = req.body || {};

  if (!validateGridPayload(grid)) {
    res.status(400).json({ error: 'Invalid grid payload. Expected a 28x28 matrix with values between 0 and 1.' });
    return;
  }

  try {
    const session = await getDigitModel();
    const flattened = new Float32Array(28 * 28);

    for (let row = 0; row < 28; row += 1) {
      for (let col = 0; col < 28; col += 1) {
        flattened[row * 28 + col] = grid[row][col];
      }
    }

    const inputTensor = new ort.Tensor('float32', flattened, [1, 1, 28, 28]);
    const inputName = session.inputNames[0];
    const outputName = session.outputNames[0];
    const results = await session.run({ [inputName]: inputTensor });
    const logits = Array.from(results[outputName].data);
    const maxLogit = Math.max(...logits);
    const expValues = logits.map((value) => Math.exp(value - maxLogit));
    const expSum = expValues.reduce((sum, value) => sum + value, 0);
    const probabilities = expValues.map((value) => value / expSum);
    const bestIndex = probabilities.reduce(
      (maxIndex, value, index, array) => (value > array[maxIndex] ? index : maxIndex),
      0
    );

    res.json({
      digit: bestIndex,
      confidence: probabilities[bestIndex],
      probabilities,
    });
  } catch (error) {
    console.error('Digit prediction failed:', error);
    res.status(500).json({ error: 'Prediction failed.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
