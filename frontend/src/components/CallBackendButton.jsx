import { useState } from "react";

/**
 * Displays a button that calls the backend and shows the returned message.
 * @returns {JSX.Element} Backend call panel.
 */
function CallBackendButton() {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
    * Sends a request to the backend and updates UI state.
    * @returns {Promise<void>} Promise resolved after response handling.
   */
  const handleClick = async () => {
    try {
      setIsLoading(true);
      const result = await fetch("https://backend-production-rossello.up.railway.app/api/hello");
      if (!result.ok) {
        throw new Error("Request failed");
      }

      const data = await result.json();
      setResponse(data.message || "No message returned");
    } catch {
      setResponse("Failed to call backend");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backend-call">
      <button className="button" onClick={handleClick} type="button" disabled={isLoading} aria-busy={isLoading}>
        {isLoading ? "Calling..." : "Call Backend"}
      </button>
      {response && (
        <p className="backend-response" role="status" aria-live="polite">
          {response}
        </p>
      )}
    </div>
  );
}

export default CallBackendButton;