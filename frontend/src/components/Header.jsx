import { Link, NavLink } from "react-router-dom";
import { site } from "../content/site";

// Add a page to the top nav by appending here (and a <Route> in App.jsx).
const NAV_LINKS = [
  { to: "/#about", label: "About" },
  { to: "/#motivation", label: "Motivation" },
];

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__brand" aria-label={`${site.name} home`}>
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
          <p className="site-header__title">{site.name}</p>
          <p className="site-header__subtitle">{site.tagline}</p>
        </div>
      </Link>

      <nav className="site-nav" aria-label="Main">
        {NAV_LINKS.map((link) => (
          <Link key={link.to} to={link.to} className="site-nav__link">
            {link.label}
          </Link>
        ))}
        <NavLink to="/demo" className="btn btn--primary site-nav__cta">
          Try it
        </NavLink>
      </nav>
    </header>
  );
}
