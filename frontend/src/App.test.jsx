// This test verifies that the App renders the home screen and navigates to the backend demo card.
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("./projects/lagrangian/LagrangianPanel", () => ({
  default: () => <div>Lagrangian Panel Mock</div>,
}));

vi.mock("./projects/digit-recognizer/DigitRecognizerPanel", () => ({
  default: () => <div>Digit Recognizer Panel Mock</div>,
}));

vi.mock("react-katex", () => ({
  InlineMath: ({ math }) => <span>{math}</span>,
  BlockMath: ({ math }) => <div>{math}</div>,
}));

describe("App", () => {
  it("renders home view and opens the digit recognizer project from the home cards", async () => {
    render(<App />);

    expect(screen.getByText(/welcome to my website/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /digit recognizer - backend ai/i }));

    expect(await screen.findByText(/digit recognizer panel mock/i)).toBeInTheDocument();
  });
});
