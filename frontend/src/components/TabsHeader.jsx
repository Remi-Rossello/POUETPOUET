import { useEffect, useState } from "react";
import TabButton from "./TabButton";

function TabsHeader({ tabs, activeTab, onTabChange }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <header className="tabs-shell">
      <div className="tabs-header">
        <div className="header-brand" aria-label="Brand">
          <img className="brand-mark" src="/favicon.ico" alt="Moomin" />
          <span className="brand-name">Rémi Rossello</span>
        </div>

        <nav className="header-nav" aria-label="Main tabs">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            />
          ))}
        </nav>

        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} type="button" aria-label="Toggle theme">
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <a className="social-link" href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="social-link" href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="social-link" href="https://x.com" target="_blank" rel="noreferrer">
            X
          </a>
        </div>
      </div>
    </header>
  );
}

export default TabsHeader;