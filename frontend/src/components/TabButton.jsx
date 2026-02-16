function TabButton({ label, isActive, onClick, className = "" }) {
  return (
    <button className={`tab-button ${isActive ? "is-active" : ""} ${className}`.trim()} onClick={onClick} type="button">
      {label}
    </button>
  );
}

export default TabButton;