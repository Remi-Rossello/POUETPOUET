import { useState } from "react";

function CallBackendButton() {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const result = await fetch("http://backend-production-rossello.up.railway.app/api/hello");
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
      <button className="button" onClick={handleClick} type="button" disabled={isLoading}>
        {isLoading ? "Calling..." : "Call Backend"}
      </button>
      {response && <p className="backend-response">{response}</p>}
    </div>
  );
}

export default CallBackendButton;