import { projectSections } from "./projectSections";

function ProjectsOverview({ onSelectProject }) {
  return (
    <>
      <h1 className="content-title">Projects</h1>
      <div className="projects-sections">
        {projectSections.map((section) => (
          <section className="projects-section" key={section.title} aria-label={section.title}>
            <h2 className="projects-section-title">{section.title}</h2>
            <div className="projects-grid" aria-label={`${section.title} projects`}>
              {section.items.map((project) => (
                <button
                  className="certification-card-button project-card"
                  key={project.id}
                  type="button"
                  onClick={() => onSelectProject(project.id)}
                  style={{
                    "--project-image": `url(${project.imageUrl})`,
                  }}
                >
                  <span className="project-card-frame">
                    <span className="project-card-image" aria-hidden="true" />
                    {project.imageCredit && <span className="project-card-credit">{project.imageCredit}</span>}
                  </span>
                  <span className="project-card-status">{project.status}</span>
                  <h3 className="certification-title project-card-title">{project.title}</h3>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export default ProjectsOverview;
