import { Suspense, lazy, useState } from "react";
import CallBackendButton from "./components/CallBackendButton";
import TabsHeader from "./components/TabsHeader";

const LagrangianPanel = lazy(() => import("./components/LagrangianPanel"));
const linkedInCertificationsUrl = "https://www.linkedin.com/in/remi-rossello/details/certifications/";

const journeyItems = [
  {
    year: "2025",
    title: "Systems & Networks",
    description: "Started building complete web deployments and server workflows.",
  },
  {
    year: "2024",
    title: "Backend Foundations",
    description: "Learned API routing, server structure, and deployment basics.",
  },
  {
    year: "2023",
    title: "Web Development",
    description: "Developed first static websites with HTML and CSS organization.",
  },
  {
    year: "2022",
    title: "First Steps",
    description: "Discovered programming and began exploring how computers work.",
  },
];

const certificationItems = [
  {
    title: "Learn Git: Introduction Course",
    issuer: "Codecademy",
    date: "Issued Dec 2025",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=codecademy.com",
    credentialUrl: "https://www.codecademy.com/profiles/RosselloRemi/certificates/53f1ee480e524cd7b329b5854507c089",
    diplomaImage: "/assets/images/git-certif.png",
  },
  {
    title: "Certification - Ada Programming Language",
    issuer: "Udemy",
    date: "Issued Dec 2025",
    credentialId: "UC-ea7a7b27-1c86-44b8-a4c3-32f55de55dea719e",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=udemy.com",
    credentialUrl: "https://www.udemy.com/certificate/UC-ea7a7b27-1c86-44b8-a4c3-32f55dea719e/",
    diplomaImage: "/assets/images/ada-certif.png",
  },
  {
    title: "Learn TypeScript Course",
    issuer: "Codecademy",
    date: "Issued Dec 2025",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=codecademy.com",
    credentialUrl: "https://www.codecademy.com/profiles/RosselloRemi/certificates/56fb1e71303e37b643bb1905f31c8a09",
    diplomaImage: "/assets/images/typescript-certif.png",
  },
  {
    title: "Intro to Cloud Computing Course",
    issuer: "Codecademy",
    date: "Issued Nov 2025",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=codecademy.com",
    credentialUrl: "https://www.codecademy.com/profiles/RosselloRemi/certificates/1353857e7ad5c1d0d578073e0d5e31e4",
    diplomaImage: "/assets/images/cloud-certif.png",
  },
  {
    title: "Full-Stack Development",
    issuer: "Mimo",
    date: "Issued Nov 2025",
    credentialId: "09ec10ed-260c-4d8c-874c-8264c4d1d0d8",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=mimo.org",
    credentialUrl: "https://www.virtualbadge.io/certificate-validator?credential=09ec10ed-260c-4d8c-874c-8264c4d1d0d8",
    diplomaImage: "/assets/images/full-stack-certif.png",
  },
  {
    title: "IELTS - C1 level",
    issuer: "British Council",
    date: "Issued Jul 2022 · Expires Jul 2024",
    credentialId: "A3-FR585-S-7501954",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=britishcouncil.org",
    credentialUrl: linkedInCertificationsUrl,
  },
  {
    title: "Greek and Roman Mythology MOOC",
    issuer: "University of Pennsylvania",
    date: "Issued Jun 2022",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=upenn.edu",
    credentialUrl: linkedInCertificationsUrl,
  },
  {
    title: "MOOC Gestion de Projet, Attestation session 18 Parcours Classique",
    issuer: "MOOC Gestion de Projet",
    date: "Issued Dec 2021 · Expires Dec 2024",
    credentialId: "GdP18a-MiAyndUyC",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=gestiondeprojet.pm",
    credentialUrl: linkedInCertificationsUrl,
    diplomaImage: "/assets/images/gestion-projet-certif.png",
  },
  {
    title: "Elements of AI (collaboration with Reaktor)",
    issuer: "University of Helsinki",
    date: "Issued Mar 2019",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=helsinki.fi",
    credentialUrl: "https://certificates.mooc.fi/validate/9authjljnwq",
    diplomaImage: "/assets/images/AI-certif.png",
  },
];

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeProject, setActiveProject] = useState(null);
  const [isProjectsPanelOpen, setIsProjectsPanelOpen] = useState(true);
  const [selectedCertification, setSelectedCertification] = useState(null);

  const tabs = [
    { id: "home", label: "Home" },
    { id: "cv", label: "CV" },
    { id: "journey", label: "Computer Journey" },
    { id: "certifications", label: "Certifications" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <main className="page-shell">
      <TabsHeader tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <section className={`card ${activeTab === "home" ? "hero" : ""}`}>
        {activeTab === "home" && (
          <>
            <p className="eyebrow">Personal Website</p>
            <h1>Welcome</h1>
            <p className="subtitle">Explore my profile and my journey in computer science.</p>
            <div className="home-actions">
              <CallBackendButton />
            </div>
          </>
        )}

        {activeTab === "cv" && (
          <>
            <h1 className="content-title">Curriculum Vitae</h1>
            <embed className="pdf-frame" src="/assets/docs/cv.pdf" type="application/pdf" />
          </>
        )}

        {activeTab === "journey" && (
          <>
            <h1 className="content-title">My Journey to Understand Computers</h1>
            <ul className="timeline">
              {journeyItems.map((item) => (
                <li key={item.year}>
                  <span className="date">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </>
        )}

        {activeTab === "projects" && (
          <>
            <h1 className="content-title">Projects</h1>
            <button
              className="button button-secondary projects-sidebar-toggle"
              type="button"
              onClick={() => setIsProjectsPanelOpen((isOpen) => !isOpen)}
            >
              {isProjectsPanelOpen ? "Hide panel" : "Open panel"}
            </button>

            <div className="projects-layout">
              {isProjectsPanelOpen && (
                <aside className="projects-sidebar" aria-label="Projects sidebar">
                  <button className="button" type="button" onClick={() => setActiveProject("lagrangian")}>
                    Lagrangian explorer
                  </button>
                  <button className="button" type="button" onClick={() => setActiveProject("field-catalog")}>
                    Field catalog
                  </button>
                </aside>
              )}

              <div className="projects-content">
                {activeProject === "lagrangian" && (
                  <Suspense fallback={<p className="lagrangian-loading">Loading equation...</p>}>
                    <LagrangianPanel />
                  </Suspense>
                )}

                {activeProject === "field-catalog" && (
                  <p className="lagrangian-loading">Field catalog</p>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "certifications" && (
          <>
            <h1 className="content-title">Certifications</h1>

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

                    {selectedCertification.credentialUrl && (
                      <a
                        className="button button-secondary certification-link"
                        href={selectedCertification.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Verify credential
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="certification-fallback">
                    <p className="subtitle certifications-empty">
                      Add a local JPG/PNG in /frontend/assets/images and set `diplomaImage` for this certification.
                    </p>
                    {selectedCertification.credentialUrl && (
                      <a
                        className="button button-secondary certification-link"
                        href={selectedCertification.credentialUrl || linkedInCertificationsUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Verify credential
                      </a>
                    )}
                  </div>
                )}
              </div>
            ) : certificationItems.length === 0 ? (
              <p className="subtitle certifications-empty">
                LinkedIn blocks automated extraction here. Share your certification list and I can populate this grid
                instantly.
              </p>
            ) : (
              <div className="certifications-grid" role="list" aria-label="Certifications list">
                {certificationItems.map((certification) => (
                  <button
                    className="certification-card certification-card-button"
                    key={`${certification.title}-${certification.issuer}`}
                    role="listitem"
                    type="button"
                    onClick={() => setSelectedCertification(certification)}
                  >
                    <div className="certification-card-head">
                      {certification.logoUrl && <img className="certification-logo" src={certification.logoUrl} alt={certification.issuer} />}
                      <p className="certification-issuer">{certification.issuer}</p>
                    </div>
                    <h3>{certification.title}</h3>
                    {certification.date && <p className="certification-date">{certification.date}</p>}
                    {certification.credentialId && <p className="certification-id">Credential ID: {certification.credentialId}</p>}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default App;