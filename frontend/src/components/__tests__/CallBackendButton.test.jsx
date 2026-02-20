// This test verifies that CallBackendButton displays the backend message on success and a fallback message on failed requests.
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CallBackendButton from "../CallBackendButton";

describe("CallBackendButton", () => {
  it("shows backend response on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Hello from backend" }),
    });

    render(<CallBackendButton />);
    fireEvent.click(screen.getByRole("button", { name: /call backend/i }));

    await waitFor(() => {
      expect(screen.getByText("Hello from backend")).toBeInTheDocument();
    });
  });

  it("shows fallback message on failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    render(<CallBackendButton />);
    fireEvent.click(screen.getByRole("button", { name: /call backend/i }));

    await waitFor(() => {
      expect(screen.getByText("Failed to call backend")).toBeInTheDocument();
    });
  });
});
