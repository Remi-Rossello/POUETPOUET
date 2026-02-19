/**
 * Renders a clickable tab button with active state.
 * @param {object} props Component props.
 * @param {string} props.label Button label.
 * @param {boolean} props.isActive Indicates whether the tab is active.
 * @param {() => void} props.onClick Click handler.
 * @param {string} [props.className=""] Additional CSS class.
 * @returns {JSX.Element} Tab button.
 */
function TabButton({ label, isActive, onClick, className = "" }) {
  return (
    <button
      className={`tab-button ${isActive ? "is-active" : ""} ${className}`.trim()}
      onClick={onClick}
      type="button"
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </button>
  );
}

export default TabButton;