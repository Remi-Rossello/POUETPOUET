// This test verifies that TabButton reflects active-state accessibility attributes and triggers its click handler.
import { fireEvent, render, screen } from "@testing-library/react";
import TabButton from "../TabButton";

describe("TabButton", () => {
  it("renders label and active state", () => {
    render(<TabButton label="Home" isActive onClick={() => {}} />);
    const button = screen.getByRole("tab", { name: "Home" });
    expect(button).toHaveClass("is-active");
    expect(button).toHaveAttribute("aria-selected", "true");
  });

  it("calls onClick when pressed", () => {
    const onClick = vi.fn();
    render(<TabButton label="Projects" isActive={false} onClick={onClick} />);
    fireEvent.click(screen.getByRole("tab", { name: "Projects" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
