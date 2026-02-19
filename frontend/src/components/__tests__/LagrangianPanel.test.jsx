import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import LagrangianPanel from "../LagrangianPanel";

vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_, tag) => {
        const elementTag = typeof tag === "string" ? tag : "div";
        return React.forwardRef(({ children, ...props }, ref) =>
          React.createElement(elementTag, { ...props, ref }, children)
        );
      },
    }
  ),
}));

vi.mock("react-katex", () => ({
  InlineMath: ({ math }) => <span>{math}</span>,
  BlockMath: ({ math }) => <div>{math}</div>,
}));

describe("LagrangianPanel", () => {
  it("renders explorer title and toggles show-more section", () => {
    render(<LagrangianPanel />);

    expect(screen.getByText(/standard model lagrangian explorer/i)).toBeInTheDocument();
    const showMoreButton = screen.getByRole("button", { name: /show more/i });
    fireEvent.click(showMoreButton);

    expect(screen.getByText("Optimizing the Action")).toBeInTheDocument();
  });
});
