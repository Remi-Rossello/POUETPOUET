// This test verifies that the App renders the home screen and navigates to the backend demo from the Coming soon section.
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("./components/LagrangianPanel", () => ({
  default: () => <div>Lagrangian Panel Mock</div>,
}));

vi.mock("react-katex", () => ({
  InlineMath: ({ math }) => <span>{math}</span>,
  BlockMath: ({ math }) => <div>{math}</div>,
}));

describe("App", () => {
  it("renders home view and opens backend test from coming soon", () => {
    render(<App />);

    expect(screen.getByText(/welcome to my website/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /backend test - demo/i }));

    expect(screen.getByRole("button", { name: /call backend/i })).toBeInTheDocument();
  });
});
