import { Suspense, lazy, useEffect, useState } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import TabsHeader from "./components/TabsHeader";

const LagrangianPanel = lazy(() => import("./projects/lagrangian/LagrangianPanel"));
const DigitRecognizerPanel = lazy(() => import("./projects/digit-recognizer/DigitRecognizerPanel"));
const DinoSkillPanel = lazy(() => import("./projects/dino/DinoSkillPanel"));
const PublicationPanel = lazy(() => import("./projects/publications/PublicationPanel"));
const linkedInCertificationsUrl = "https://www.linkedin.com/in/remi-rossello/details/certifications/";

const certificationItems = [
  {
    section: "Engineering",
    title: "Engineering Degree",
    issuer: "École des Mines de Nancy",
    date: "Issued 2024",
    diplomaImage: "/assets/images/engineering-diploma.png",
  },
  {
    section: "Computer Science",
    title: "Introduction to Scala Course",
    issuer: "DataCamp",
    date: "Issued Feb 2026",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=datacamp.com",
    credentialUrl:
      "https://www.datacamp.com/completed/statement-of-accomplishment/course/1056fcbaccaf5269242357074ab325a89de9f97c",
    diplomaImage: "/assets/images/scala-certif.png",
  },
  {
    section: "Computer Science",
    title: "Learn Git: Introduction Course",
    issuer: "Codecademy",
    date: "Issued Dec 2025",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=codecademy.com",
    credentialUrl: "https://www.codecademy.com/profiles/RosselloRemi/certificates/53f1ee480e524cd7b329b5854507c089",
    diplomaImage: "/assets/images/git-certif.png",
  },
  {
    section: "Computer Science",
    title: "Certification - Ada Programming Language",
    issuer: "Udemy",
    date: "Issued Dec 2025",
    credentialId: "UC-ea7a7b27-1c86-44b8-a4c3-32f55de55dea719e",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=udemy.com",
    credentialUrl: "https://www.udemy.com/certificate/UC-ea7a7b27-1c86-44b8-a4c3-32f55dea719e/",
    diplomaImage: "/assets/images/ada-certif.png",
  },
  {
    section: "Computer Science",
    title: "Learn TypeScript Course",
    issuer: "Codecademy",
    date: "Issued Dec 2025",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=codecademy.com",
    credentialUrl: "https://www.codecademy.com/profiles/RosselloRemi/certificates/56fb1e71303e37b643bb1905f31c8a09",
    diplomaImage: "/assets/images/typescript-certif.png",
  },
  {
    section: "Computer Science",
    title: "Intro to Cloud Computing Course",
    issuer: "Codecademy",
    date: "Issued Nov 2025",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=codecademy.com",
    credentialUrl: "https://www.codecademy.com/profiles/RosselloRemi/certificates/1353857e7ad5c1d0d578073e0d5e31e4",
    diplomaImage: "/assets/images/cloud-certif.png",
  },
  {
    section: "Computer Science",
    title: "Full-Stack Development",
    issuer: "Mimo",
    date: "Issued Nov 2025",
    credentialId: "09ec10ed-260c-4d8c-874c-8264c4d1d0d8",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=mimo.org",
    credentialUrl: "https://www.virtualbadge.io/certificate-validator?credential=09ec10ed-260c-4d8c-874c-8264c4d1d0d8",
    diplomaImage: "/assets/images/full-stack-certif.png",
  },
  {
    section: "Humanities",
    title: "IELTS - C1 level",
    issuer: "British Council",
    date: "Issued Jul 2022 · Expires Jul 2024",
    credentialId: "A3-FR585-S-7501954",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=britishcouncil.org",
    credentialUrl: linkedInCertificationsUrl,
  },
  {
    section: "Humanities",
    title: "Greek and Roman Mythology MOOC",
    issuer: "University of Pennsylvania",
    date: "Issued Jun 2022",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=upenn.edu",
    credentialUrl: linkedInCertificationsUrl,
  },
  {
    section: "Humanities",
    title: "Human Behavioral Biology (2010 Lecture Series)",
    issuer: "Stanford University (Robert Sapolsky)",
    date: "2010",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=stanford.edu",
    credentialUrl: "https://www.youtube.com/playlist?list=PL848F2368C90DDC3D",
    linkLabel: "Youtube link",
  },
  {
    section: "Humanities",
    title: "MOOC Gestion de Projet, Attestation session 18 Parcours Classique",
    issuer: "MOOC Gestion de Projet",
    date: "Issued Dec 2021 · Expires Dec 2024",
    credentialId: "GdP18a-MiAyndUyC",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=gestiondeprojet.pm",
    credentialUrl: linkedInCertificationsUrl,
    diplomaImage: "/assets/images/gestion-projet-certif.png",
  },
  {
    section: "Computer Science",
    title: "Elements of AI (collaboration with Reaktor)",
    issuer: "University of Helsinki",
    date: "Issued Mar 2019",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=helsinki.fi",
    credentialUrl: "https://certificates.mooc.fi/validate/9authjljnwq",
    diplomaImage: "/assets/images/AI-certif.png",
  },
];

const latestNewsItems = [
  {
    id: "dino-skill",
    title: "Agent Skill: Dino Game",
    status: "Available",
    date: "12 mars 2026",
    sortDate: "2026-03-12",
  },
  {
    id: "backend-test",
    title: "Digit recognizer",
    status: "Available",
    date: "12 mars 2026",
    sortDate: "2026-03-12",
  },
  {
    id: "lagrangian",
    title: "Lagrangian explorer",
    status: "In progress",
    date: "17 fevrier 2026",
    sortDate: "2026-02-17",
    previewMath: String.raw`\mathcal{L}_{SM}=-\frac{1}{4}F_{\mu\nu}F^{\mu\nu}+i\bar{\psi}\gamma^\mu D_\mu\psi-\left(y\bar{\psi}_L H\psi_R+h.c.\right)+|D_\mu H|^2-V(H)`,
  },
].sort((leftItem, rightItem) => rightItem.sortDate.localeCompare(leftItem.sortDate));

const aboutCvOptions = [
  {
    id: "engineering",
    label: "Engineering CV",
    subtitle: "Aerospace & materials track",
    pdfUrl: "/assets/docs/Rossello_CV_aerospace.pdf",
  },
  {
    id: "software",
    label: "Software CV",
    subtitle: "Software engineering track",
    pdfUrl: "/assets/docs/Rossello_CV_Software.pdf",
  },
];

const projectSections = [
  {
    title: "Interactive",
    items: [
      { id: "lagrangian", title: "Lagrangian explorer", status: "In progress" },
      { id: "backend-test", title: "Digit recognizer - backend AI", status: "Available" },
      { id: "dino-skill", title: "Agent Skill: Dino Game", status: "Available" },
      { id: "field-catalog", title: "Field catalog", status: "Upcoming" },
      { id: "computer-roadmap", title: "The ultimate computer roadmap", status: "Upcoming" },
    ],
  },
  {
    title: "Publications",
    items: [
      { id: "publication-lunar-geology", title: "Lunar geology", status: "Published" },
      { id: "publication-spintronics", title: "Spintronics", status: "Published" },
      { id: "publication-spectroscopy", title: "Spectroscopy", status: "Published" },
    ],
  },
];

/**
 * Root frontend component with tab-based navigation.
 * @returns {JSX.Element} Main application layout.
 */
function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeProject, setActiveProject] = useState(null);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [aboutTrack, setAboutTrack] = useState("engineering");

  const tabs = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "certifications", label: "Credentials" },
    { id: "projects", label: "Projects" },
  ];
  const certificationSections = ["Engineering", "Computer Science", "Humanities"];
  const canShowVerificationLink =
    selectedCertification?.credentialUrl && selectedCertification.credentialUrl !== linkedInCertificationsUrl;
  const selectedLinkLabel = selectedCertification?.linkLabel || "Verify credential";
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
                  <button className="home-panel-card" type="button" onClick={() => openProjectTab("field-catalog")}>
                    <span className="home-panel-card-title">Field catalog</span>
                    <span className="home-panel-card-status">Upcoming</span>
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
                        <span className="home-panel-preview-math" aria-hidden="true">
                          <InlineMath math={item.previewMath} />
                        </span>
                      )}
                      <span className="home-panel-card-link">Open in Projects →</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </section>
        )}

        {activeTab === "about" && (
          <section id="panel-about" role="tabpanel" aria-labelledby="tab-about">
            <h1 className="content-title">About</h1>
            <div className="about-top-media">
              <img className="about-profile-pic" src="/assets/images/profile-pic.png" alt="Rémi Rossello profile" />
            </div>
            <section className="about-story" aria-label="About introduction">
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
                  <span className="about-cv-card-subtitle">{option.subtitle}</span>
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
              <>
                <h1 className="content-title">Projects</h1>
                <div className="projects-sections">
                  {projectSections.map((section) => (
                    <section className="projects-section" key={section.title} aria-label={section.title}>
                      <h2 className="projects-section-title">{section.title}</h2>
                      <div className="projects-grid" aria-label={`${section.title} projects`}>
                        {section.items.map((project) => (
                          <button
                            className="certification-card certification-card-button project-card"
                            key={project.id}
                            type="button"
                            onClick={() => setActiveProject(project.id)}
                          >
                            <p className="certification-issuer">{section.title}</p>
                            <h3 className="certification-title">{project.title}</h3>
                            <p className="certification-date">{project.status}</p>
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </>
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
                    <p className="project-loading">Upcoming</p>
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
          <section id="panel-certifications" role="tabpanel" aria-labelledby="tab-certifications">
            <h1 className="content-title">Credentials</h1>

            {selectedCertification ? (
              <div className="certification-viewer">
                <button className="button button-secondary" type="button" onClick={() => setSelectedCertification(null)}>
                  ← Back to grid
                </button>

                <div className="certification-viewer-head">
                  {selectedCertification.logoUrl && (
                    <img className="certification-logo" src={selectedCertification.logoUrl} alt={selectedCertification.issuer} />
                  )}
                  <div>
                    <h2>{selectedCertification.title}</h2>
                    <p className="certification-issuer">{selectedCertification.issuer}</p>
                    {selectedCertification.date && <p className="certification-date">{selectedCertification.date}</p>}
                    {selectedCertification.credentialId && (
                      <p className="certification-id">Credential ID: {selectedCertification.credentialId}</p>
                    )}
                  </div>
                </div>

                {selectedCertification.diplomaImage ? (
                  <div className="certification-image-wrap">
                    <img
                      className="certification-image"
                      src={selectedCertification.diplomaImage}
                      alt={`${selectedCertification.title} diploma`}
                    />

                    {canShowVerificationLink && (
                      <a
                        className="button button-secondary certification-link"
                        href={selectedCertification.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {selectedLinkLabel}
                      </a>
                    )}
                  </div>
                ) : (
                  canShowVerificationLink && (
                    <a
                      className="button button-secondary certification-link"
                      href={selectedCertification.credentialUrl || linkedInCertificationsUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {selectedLinkLabel}
                    </a>
                  )
                )}
              </div>
            ) : certificationItems.length === 0 ? (
              <p className="subtitle certifications-empty">
                LinkedIn blocks automated extraction here. Share your certification list and I can populate this grid
                instantly.
              </p>
            ) : (
              <div className="certifications-sections">
                {certificationSections.map((sectionTitle) => {
                  const sectionItems = certificationItems.filter((certification) => certification.section === sectionTitle);
                  if (sectionItems.length === 0) {
                    return null;
                  }

                  return (
                    <section className="certifications-section" key={sectionTitle} aria-label={sectionTitle}>
                      <h2 className="certifications-section-title">{sectionTitle}</h2>
                      <div className="certifications-grid" aria-label={`${sectionTitle} credentials`}>
                        {sectionItems.map((certification) => (
                          <button
                            className="certification-card certification-card-button"
                            key={`${certification.title}-${certification.issuer}`}
                            type="button"
                            onClick={() => setSelectedCertification(certification)}
                          >
                            <div className="certification-card-head">
                              {certification.logoUrl && (
                                <img className="certification-logo" src={certification.logoUrl} alt={certification.issuer} />
                              )}
                              <p className="certification-issuer">{certification.issuer}</p>
                            </div>
                            <h3 className="certification-title">{certification.title}</h3>
                            {certification.date && <p className="certification-date">{certification.date}</p>}
                            {certification.credentialId && <p className="certification-id">Credential ID: {certification.credentialId}</p>}
                          </button>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

export default App;