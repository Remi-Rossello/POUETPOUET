import { useMemo, useState } from "react";
import CallBackendButton from "./components/CallBackendButton";

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

function App() {
  const [view, setView] = useState("home");

  const title = useMemo(() => {
    if (view === "cv") return "Curriculum Vitae";
    if (view === "journey") return "My Journey to Understand Computers";
    return "Welcome";
  }, [view]);

  return (
    <main className="page-shell">
      <section className="card hero" hidden={view !== "home"}>
        <p className="eyebrow">Personal Website</p>
        <h1>{title}</h1>
        <p className="subtitle">Explore my profile and my journey in computer science.</p>
        <nav className="actions" aria-label="Main actions">
          <button className="button" onClick={() => setView("cv")} type="button">
            View CV
          </button>
          <button className="button button-secondary" onClick={() => setView("journey")} type="button">
            Computer Journey
          </button>
          <CallBackendButton />
        </nav>
      </section>

      <section className="card" hidden={view !== "cv"}>
        <nav className="top-nav">
          <button className="button button-secondary" onClick={() => setView("home")} type="button">
            Back Home
          </button>
        </nav>
        <h1 className="content-title">{title}</h1>
        <embed className="pdf-frame" src="/assets/docs/cv.pdf" type="application/pdf" />
      </section>

      <section className="card" hidden={view !== "journey"}>
        <nav className="top-nav">
          <button className="button button-secondary" onClick={() => setView("home")} type="button">
            Back Home
          </button>
        </nav>
        <h1 className="content-title">{title}</h1>
        <ul className="timeline">
          {journeyItems.map((item) => (
            <li key={item.year}>
              <span className="date">{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;