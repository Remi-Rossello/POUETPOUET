import { Suspense, lazy, useEffect, useState } from "react";
import TabsHeader from "./components/TabsHeader";

const LagrangianPanel = lazy(() => import("./projects/lagrangian/LagrangianPanel"));
const FieldCatalogPanel = lazy(() => import("./projects/field-catalog/FieldCatalogPanel"));
const DigitRecognizerPanel = lazy(() => import("./projects/digit-recognizer/DigitRecognizerPanel"));
const DinoSkillPanel = lazy(() => import("./projects/dino/DinoSkillPanel"));
const PublicationPanel = lazy(() => import("./projects/publications/PublicationPanel"));
const ProjectsOverview = lazy(() => import("./tabs/projects/ProjectsOverview"));
const CredentialsTab = lazy(() => import("./tabs/credentials/CredentialsTab"));

const latestNewsItems = [
  {
    id: "field-catalog",
    title: "Field catalog",
    status: "In progress",
    date: "March 21st 2026",
    sortDate: "2026-03-21",
  },
  {
    id: "dino-skill",
    title: "Agent Skill: Dino Game",
    status: "Available",
    date: "March 12th 2026",
    sortDate: "2026-03-12",
  },
  {
    id: "backend-test",
    title: "Digit recognizer",
    status: "Available",
    date: "March 12th 2026",
    sortDate: "2026-03-12",
  },
  {
    id: "lagrangian",
    title: "Lagrangian explorer",
    status: "In progress",
    date: "February 17th 2026",
    sortDate: "2026-02-17",
  },
].sort((leftItem, rightItem) => rightItem.sortDate.localeCompare(leftItem.sortDate));

const aboutCvOptions = [
  {
    id: "engineering",
    label: "Materials & Aerospace CV",
    pdfUrl: "/assets/docs/Rossello_CV_aerospace.pdf",
  },
  {
    id: "software",
    label: "Software CV",
    pdfUrl: "/assets/docs/Rossello_CV_Software.pdf",
  },
];

/**
 * Root frontend component with tab-based navigation.
 * @returns {JSX.Element} Main application layout.
 */
const BACKEND_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://backend-production-rossello.up.railway.app";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeProject, setActiveProject] = useState(null);
  const [aboutTrack, setAboutTrack] = useState("engineering");
  const [visits, setVisits] = useState(null);

  // On mount, register a visit and fetch the total visit count from the backend.
  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/visits`, { method: 'POST' })
      .then((r) => r.json())
      .then((data) => setVisits(data.visits))
      .catch(() => {});
  }, []);

  // Contants for the structure of the website
  const tabs = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "certifications", label: "Credentials" },
    { id: "projects", label: "Projects" },
  ];
  const selectedAboutCv = aboutCvOptions.find((option) => option.id === aboutTrack) || aboutCvOptions[0];
  const selectedAboutPdf = selectedAboutCv.pdfUrl;
  const selectedAboutPdfPreview = `${selectedAboutPdf}#view=FitH&zoom=page-width&toolbar=0&navpanes=0`;
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || "Home";

  useEffect(() => {
    if (activeTab !== "projects") {
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeProject, activeTab]);

  /**
    * Opens the Projects tab and selects a specific project.
    * @param {string} projectId Project identifier to display.
   * @returns {void}
   */
  const openProjectTab = (projectId) => {
    setActiveProject(projectId);
    setActiveTab("projects");
  };

  return (
    <main className="page-shell">
      <TabsHeader tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <p className="sr-only" role="status" aria-live="polite">Current section: {activeTabLabel}</p>

      <section className={`page-content ${activeTab === "home" ? "hero" : ""}`}>
        {activeTab === "home" && (
          <section id="panel-home" role="tabpanel" aria-labelledby="tab-home">
            <h1 className="about-rainbow-title">Welcome to my website !</h1>
            <div className="home-panels">
              <section className="home-panel" aria-label="Comming soon">
                <h2 className="home-panel-title">Comming soon</h2>
                <div className="home-panel-list">
                  <button className="home-panel-card" type="button" onClick={() => openProjectTab("computer-roadmap")}>
                    <span className="home-panel-card-title">The ultimate computer roadmap</span>
                    <span className="home-panel-card-status">Planned</span>
                    <span className="home-panel-card-link">Open in Projects →</span>
                  </button>
                </div>
              </section>

              <section className="home-panel" aria-label="Latest news">
                <h2 className="home-panel-title">Latest news</h2>
                <div className="home-panel-list">
                  {latestNewsItems.map((item) => (
                    <button
                      key={item.id}
                      className="home-panel-card"
                      type="button"
                      onClick={() => openProjectTab(item.id)}
                    >
                      <span className="home-panel-card-head">
                        <span className="home-panel-card-title">{item.title}</span>
                        <span className="home-panel-card-date">{item.date}</span>
                      </span>
                      <span className="home-panel-card-status">{item.status}</span>
                      {item.previewMath && (
                        <span className="home-panel-preview-math" aria-hidden="true">{item.previewMath}</span>
                      )}
                      <span className="home-panel-card-link">Open in Projects →</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
            <div className="home-visit-counter">
              <span className="button button-secondary" aria-label="Unique visitors">
                👋 {visits !== null ? visits : "…"}
              </span>
            </div>
          </section>
        )}

        {activeTab === "about" && (
          <section id="panel-about" role="tabpanel" aria-labelledby="tab-about">
            <h1 className="content-title">About</h1>
            <section className="about-story" aria-label="About introduction">
              <div className="about-top-media">
                <img className="about-profile-pic" src="/assets/images/profile-pic.png" alt="Rémi Rossello profile" />
              </div>
              <h2 className="about-story-title">Hi.</h2>
              <p className="about-story-text">
                My name is Rémi Rossello, I come from Vence, a small but beautiful town in the French Riviera. Growing
                up, I wanted to know exactly why we are here and how the universe works. When I found out it was too
                hard, I began learning computer science instead ;) This website is part of the result.
              </p>

              <h2 className="about-story-title">Experiences</h2>
              <p className="about-story-text">
                Following a math/physics formation, in 2024, I received my engineering diploma from the "École des
                Mines" in Nancy, France, with a specialization in materials engineering. 
                In the same year, I worked as an intern for OffWorld in Luxembourg, a space startup from the US
                concentrating on the mining of space ressources, specifically Lunar water. There, I made use of both
                materials science and programming skills for ESA-sponsored experiments. 
                Then, I briefly joined the Cosmochemistry and Planetology team at the Petrological and Geochemical
                Research Center (CRPG) in Nancy, France, again as in intern. With my tutor Jessica Flahaut and <abbr title="French national space agency">CNES</abbr>
                engineer Nicolas Théret, we co-authored a scientific proceeding on the spectral identification of Lunar
                minerals thanks to scripts I had written in IDL. 
                Both experiences where related to planned rover missions on the Moon, but OffWorld's mission was
                scraped due to lack of funding. The scientific proceeding, however, was presented at the European Lunar
                Symposium 2025 in Munster, Germany.
              </p>

              <h2 className="about-story-title">The computer science journey</h2>
              <p className="about-story-text">
                During my years at school, I had learned how to code in Python, Caml, R, MATLAB, IDL... But we were
                never taught exactly what the computer is <em>doing</em>. And so towards the end of my formation, I
                sought out to understand in detail the mysterious and magical world of computers. 
                The starting point was NandGames, a game allowing one to build a CPU and RAM, level by level, from
                transistors, to Nand gates, and then circuits, RAM, ALU, CPU, and finally binary instructions and
                assembly scripts running on this home-made computer. 
                Then, I learned more about assembly and C, reading "Operating systems in three easy pieces". Putting
                this in practice, I installed Linux and experimented. The next chapter was getting certified in
                full-stack developpment, html/css, js, ts, react, downloading VSCode, learning the good practices,
                using LLMs, learning how LLMs work...
              </p>

              <h2 className="about-story-title">What's next</h2>
              <p className="about-story-text">
                Today, I'm working as a "math expert", writting and correcting math prompts for LLM RLHF training.
                The next step is to work in a more stimulating aerospace and/or software engineering role. Please hire
                me 🙏
              </p>
            </section>

            <div className="about-cv-picker" role="tablist" aria-label="CV selector">
              {aboutCvOptions.map((option) => (
                <button
                  id={`about-cv-${option.id}`}
                  key={option.id}
                  className={`about-cv-card ${aboutTrack === option.id ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setAboutTrack(option.id)}
                  role="tab"
                  aria-selected={aboutTrack === option.id}
                  aria-controls="about-cv-panel"
                >
                  <span className="about-cv-card-title">{option.label}</span>
                </button>
              ))}
            </div>

            <div
              className="about-pdf-viewer"
              id="about-cv-panel"
              role="tabpanel"
              aria-labelledby={`about-cv-${aboutTrack}`}
            >
              <div className="about-pdf-head">
                <p className="about-pdf-title">{selectedAboutCv.label}</p>
                <div className="about-pdf-actions">
                  <a className="button button-secondary" href={selectedAboutPdf} target="_blank" rel="noreferrer">
                    Open
                  </a>
                  <a className="button button-secondary" href={selectedAboutPdf} download>
                    Download
                  </a>
                </div>
              </div>
              <embed className="pdf-frame about-pdf-frame" src={selectedAboutPdfPreview} type="application/pdf" />
            </div>
          </section>
        )}

        {activeTab === "projects" && (
          <section id="panel-projects" role="tabpanel" aria-labelledby="tab-projects">
            {!activeProject && (
              <Suspense fallback={<p className="project-loading">Loading projects...</p>}>
                <ProjectsOverview onSelectProject={setActiveProject} />
              </Suspense>
            )}

            {activeProject && (
              <div className="projects-content projects-content-cards">
                <div className="project-detail-toolbar">
                  <button className="button button-secondary" type="button" onClick={() => setActiveProject(null)}>
                    ← Back to projects
                  </button>
                </div>

                <Suspense fallback={<p className="project-loading">Loading project...</p>}>
                  {activeProject === "lagrangian" && <LagrangianPanel />}

                  {activeProject === "backend-test" && <DigitRecognizerPanel />}

                  {activeProject === "dino-skill" && <DinoSkillPanel />}

                  {activeProject === "field-catalog" && (
                    <FieldCatalogPanel />
                  )}

                  {activeProject === "computer-roadmap" && (
                    <p className="project-loading">Upcoming</p>
                  )}

                  {activeProject === "publication-spintronics" && (
                    <PublicationPanel
                      key="publication-spintronics"
                      publicationId="publication-spintronics"
                    />
                  )}

                  {activeProject === "publication-spectroscopy" && (
                    <PublicationPanel
                      key="publication-spectroscopy"
                      publicationId="publication-spectroscopy"
                    />
                  )}

                  {activeProject === "publication-lunar-geology" && (
                    <PublicationPanel
                      key="publication-lunar-geology"
                      publicationId="publication-lunar-geology"
                    />
                  )}
                </Suspense>
              </div>
            )}
          </section>
        )}

        {activeTab === "certifications" && (
          <Suspense fallback={<p className="project-loading">Loading credentials...</p>}>
            <CredentialsTab />
          </Suspense>
        )}
      </section>
    </main>
  );
}

export default App;