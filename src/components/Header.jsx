export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="40" height="40">
          <path
            d="M8 56 V30 A24 24 0 0 1 56 30 V56"
            fill="none"
            stroke="var(--maroon-deep)"
            strokeWidth="4"
          />
          <path d="M8 56 H56" stroke="var(--gold)" strokeWidth="4" />
          <circle cx="32" cy="30" r="4" fill="var(--gold)" />
        </svg>
      </div>
      <div>
        <h1 className="site-header__title">Natya Drishti</h1>
        <p className="site-header__subtitle">Bharatanatyam pose coach, built on your joint-angle model</p>
      </div>
    </header>
  );
}
