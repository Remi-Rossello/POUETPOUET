import { useEffect, useState } from "react";
import TabButton from "./TabButton";

function TabsHeader({ tabs, activeTab, onTabChange }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [isContactOpen, setIsContactOpen] = useState(false);

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
          <img className="brand-mark" src="/assets/images/moomin.png" alt="Moomin" />
          <span className="brand-name">Remi Rossello</span>
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
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
            data-tooltip="toggle light/dark"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <a className="social-link" href="https://github.com/Remi-Rossello" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="social-link" href="https://www.linkedin.com/in/remi-rossello/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <button
            className="social-link contact-toggle"
            type="button"
            onClick={() => setIsContactOpen((open) => !open)}
            aria-expanded={isContactOpen}
            aria-controls="header-contact-card"
          >
            Contact
          </button>

          {isContactOpen && (
            <div id="header-contact-card" className="contact-card" role="dialog" aria-label="Contact details">
              <img className="contact-card-avatar" src="/assets/images/profile-pic.png" alt="Rémi Rossello" />
              <p className="contact-card-line">remi.rossello@gmail.com</p>
              <p className="contact-card-line">+33 07 81 00 50 32</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TabsHeader;