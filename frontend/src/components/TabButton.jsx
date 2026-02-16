function TabButton({ label, isActive, onClick }) {
  return (
    <button className={`tab-button ${isActive ? "is-active" : ""}`} onClick={onClick} type="button">
      {label}
    </button>
  );
}

export default TabButton;