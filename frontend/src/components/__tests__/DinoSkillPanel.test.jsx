import { render, screen } from "@testing-library/react";
import DinoSkillPanel from "../../projects/dino/DinoSkillPanel";

describe("DinoSkillPanel", () => {
  it("renders a simple intro and keeps the raw markdown view", async () => {
    render(<DinoSkillPanel />);

    expect(await screen.findByRole("heading", { name: "Agent Skill: Dino Game" })).toBeInTheDocument();
    expect(screen.getByText(/let your github copilot agent relax a little/i)).toBeInTheDocument();
    expect(screen.getByText("View raw markdown")).toBeInTheDocument();
    expect(screen.getByText(/download SKILL.md/i)).toBeInTheDocument();
  });
});