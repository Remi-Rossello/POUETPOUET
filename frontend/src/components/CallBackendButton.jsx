import { useMemo, useState } from "react";

/**
 * Displays a button that calls the backend and shows the returned message.
 * @returns {JSX.Element} Backend call panel.
 */
function CallBackendButton() {
  const gridSize = 14;
  const [pixels, setPixels] = useState(() => Array(gridSize * gridSize).fill(0));
  const [prediction, setPrediction] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const backendBaseUrl = import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://backend-production-rossello.up.railway.app";
  const hasDrawing = useMemo(() => pixels.some((pixel) => pixel > 0), [pixels]);

  const paintPixel = (index) => {
    setPixels((previous) => {
      if (previous[index] === 1) {
        return previous;
      }

      const updated = [...previous];
      updated[index] = 1;
      return updated;
    });
  };

  const upscaleGridToModelInput = () => {
    const matrix = Array.from({ length: 28 }, () => Array(28).fill(0));

    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        const value = pixels[row * gridSize + col];
        const modelRow = row * 2;
        const modelCol = col * 2;

        matrix[modelRow][modelCol] = value;
        matrix[modelRow][modelCol + 1] = value;
        matrix[modelRow + 1][modelCol] = value;
        matrix[modelRow + 1][modelCol + 1] = value;
      }
    }

    return matrix;
  };

  /**
    * Sends a request to the backend and updates UI state.
    * @returns {Promise<void>} Promise resolved after response handling.
   */
  const handlePredict = async () => {
    if (!hasDrawing) {
      setPrediction(null);
      setStatusMessage("Draw a digit first, then click Predict digit.");
      return;
    }

    try {
      setIsLoading(true);
      setStatusMessage("");
      const result = await fetch(`${backendBaseUrl}/api/predict-digit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grid: upscaleGridToModelInput() }),
      });

      if (!result.ok) {
        throw new Error("Request failed");
      }

      const data = await result.json();
      setPrediction({
        digit: data.digit,
        confidence: data.confidence,
      });
    } catch {
      setPrediction(null);
      setStatusMessage("Prediction failed. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPixels(Array(gridSize * gridSize).fill(0));
    setPrediction(null);
    setStatusMessage("");
  };

  const handlePointerDown = (index) => {
    setIsDrawing(true);
    paintPixel(index);
  };

  const handlePointerEnter = (index) => {
    if (!isDrawing) {
      return;
    }

    paintPixel(index);
  };

  return (
    <section className="backend-call" aria-label="Digit recognizer demo">
      <h3 className="backend-demo-title">Draw a digit</h3>
      <p className="backend-demo-subtitle">Click and drag inside the grid, then ask the backend model to predict it.</p>

      <div
        className="digit-grid"
        role="grid"
        aria-label="Digit drawing grid"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        onPointerUp={() => setIsDrawing(false)}
        onPointerLeave={() => setIsDrawing(false)}
      >
        {pixels.map((pixel, index) => (
          <button
            key={index}
            type="button"
            role="gridcell"
            className={`digit-cell ${pixel ? "is-active" : ""}`}
            aria-label={`Cell ${index + 1}`}
            aria-pressed={pixel === 1}
            onPointerDown={() => handlePointerDown(index)}
            onPointerEnter={() => handlePointerEnter(index)}
          />
        ))}
      </div>

      <div className="backend-actions">
        <button className="button" onClick={handlePredict} type="button" disabled={isLoading} aria-busy={isLoading}>
          {isLoading ? "Predicting..." : "Predict digit"}
        </button>
        <button className="button button-secondary" onClick={handleClear} type="button" disabled={isLoading}>
          Clear
        </button>
      </div>

      {prediction && (
        <div className="prediction-card" role="status" aria-live="polite">
          <p className="prediction-card-label">Prediction</p>
          <p className="prediction-card-digit">{prediction.digit}</p>
          <p className="prediction-card-confidence">Confidence: {Math.round(prediction.confidence * 100)}%</p>
        </div>
      )}

      {statusMessage && (
        <p className="backend-response" role="status" aria-live="polite">
          {statusMessage}
        </p>
      )}
    </section>
  );
}

export default CallBackendButton;