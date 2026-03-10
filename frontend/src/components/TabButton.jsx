/**
 * Renders a clickable tab button with active state.
 * @param {object} props Component props.
 * @param {string} props.label Button label.
 * @param {boolean} props.isActive Indicates whether the tab is active.
 * @param {() => void} props.onClick Click handler.
 * @param {string} props.id Button id.
 * @param {string} props.controlsId Controlled panel id.
 * @param {string} [props.className=""] Additional CSS class.
 * @returns {JSX.Element} Tab button.
 */
function TabButton({ label, isActive, onClick, id, controlsId, className = "" }) {
  return (
    <button
      id={id}
      className={`tab-button ${isActive ? "is-active" : ""} ${className}`.trim()}
      onClick={onClick}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={controlsId}
      tabIndex={isActive ? 0 : -1}
    >
      {label}
    </button>
  );
}

export default TabButton;