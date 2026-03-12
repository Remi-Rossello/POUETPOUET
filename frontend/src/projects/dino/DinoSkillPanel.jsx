import docUrl from "./assets/SKILL.md?url";
import markdown from "./assets/SKILL.md?raw";
import "./dino.css";

/**
 * Displays the Dino skill documentation with setup details and markdown preview.
 * @returns {JSX.Element} Dino skill panel.
 */
function DinoSkillPanel() {
  return (
    <section className="project-panel dino-skill-panel" aria-label="Dino skill documentation">
      <header className="dino-simple-header">
        <p className="dino-eyebrow">Agent skill</p>
        <h1 className="content-title dino-content-title">Agent Skill: Dino Game</h1>
      </header>

      <section className="project-intro dino-story" aria-label="Dino skill overview">
        <p className="project-body-text dino-story-paragraph">
          After a long day of vibe-coding in VSCode, why not let your github copilot agent relax a little ?
          Type <code>/dino</code>, in copilot's chat, and it will open the game on an integrated browser window
          and set up a bot to play it automatically.
        </p>
        <p className="project-body-text dino-story-paragraph">
          A good setup for trying this out is the following: VScode, with github copilot available, and the Playright extension installed. 
          Once you have that, just copy the SKILL.md file into your local .copilot\skills\dino folder, and type <code>/dino</code> in copilot chat to see it in action.
        </p>
        <p className="project-body-text dino-story-paragraph">
          The skill file is available below. You can also <a href={docUrl} target="_blank" rel="noreferrer">open the source file</a> or <a href={docUrl} download="SKILL.md">download SKILL.md</a> directly.
        </p>
      </section>

      <section className="project-content dino-skill-content" aria-labelledby="dino-docs-title">
        <div className="dino-docs-header">
          <div>
            <h2 id="dino-docs-title" className="dino-docs-title">SKILL.md raw markdown</h2>
          </div>
        </div>

        <details className="dino-raw-source">
          <summary className="dino-raw-source-summary">View raw markdown</summary>
          <pre className="dino-skill-preview" aria-label="Dino skill markdown preview">
            {markdown}
          </pre>
        </details>
      </section>
    </section>
  );
}

export default DinoSkillPanel;
