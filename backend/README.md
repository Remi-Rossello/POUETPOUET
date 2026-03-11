# Backend Digit Recognizer

This backend now exposes a lightweight digit prediction API used by the frontend project card.

## What was added

- A new `POST /api/predict-digit` endpoint.
- Input validation for a `28 x 28` matrix of values between `0` and `1`.
- A pretrained ONNX MNIST model downloaded automatically from:
  - `https://media.githubusercontent.com/media/onnx/models/main/validated/vision/classification/mnist/model/mnist-8.onnx`
- Inference with `onnxruntime-node`.
- JSON response containing:
  - `digit` (predicted class between `0` and `9`)
  - `confidence` (probability for the predicted class)
  - `probabilities` (raw model output array)

## Existing endpoint

- `GET /api/hello` remains available.

## Run locally

From the repository root:

```bash
npm install
npm run start --workspace backend
```