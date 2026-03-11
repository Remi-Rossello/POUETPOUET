// This test verifies that CallBackendButton sends drawn grid data and displays prediction or fallback states.
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CallBackendButton from "../CallBackendButton";

describe("CallBackendButton", () => {
  it("shows prediction on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ digit: 8, confidence: 0.92 }),
    });

    render(<CallBackendButton />);
    fireEvent.pointerDown(screen.getByLabelText("Cell 1"));
    fireEvent.pointerUp(screen.getByLabelText("Cell 1"));
    fireEvent.click(screen.getByRole("button", { name: /predict digit/i }));

    await waitFor(() => {
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText(/confidence: 92%/i)).toBeInTheDocument();
    });
  });

  it("asks for drawing when trying to predict with an empty grid", async () => {
    render(<CallBackendButton />);
    fireEvent.click(screen.getByRole("button", { name: /predict digit/i }));

    await waitFor(() => {
      expect(screen.getByText(/draw a digit first/i)).toBeInTheDocument();
    });
  });

  it("shows fallback message on backend failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    render(<CallBackendButton />);
    fireEvent.pointerDown(screen.getByLabelText("Cell 1"));
    fireEvent.pointerUp(screen.getByLabelText("Cell 1"));
    fireEvent.click(screen.getByRole("button", { name: /predict digit/i }));

    await waitFor(() => {
      expect(screen.getByText("Prediction failed. Please retry.")).toBeInTheDocument();
    });
  });
});
