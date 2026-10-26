import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { site } from "../content/site";
import BrandMark from "./BrandMark";
import Icon from "./Icon";

// Add a link to the top nav by appending here (and a <Route> in App.jsx
// if it's a new page). Hash links scroll to a section on the landing page.
const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/#how-it-works", label: "How It Works" },
  { to: "/#about", label: "About" },
  { to: "/#motivation", label: "Motivation" },
];

export default function Header() {
  const location = useLocation();
  // The mobile menu is "open" only for the location it was opened on,
  // so navigating anywhere closes it without an extra effect.
  const [openAt, setOpenAt] = useState(null);
  const open = openAt === location.key;

  const isActive = (to) => {
    const [path, hash] = to.split("#");
    if (hash) return location.pathname === path && location.hash === `#${hash}`;
    return location.pathname === path && !location.hash;
  };

  return (
    <header className="site-header">
      <div className="container nav">
        <Link to="/" className="brand" aria-label={`${site.name} home`}>
          <BrandMark />
          <span className="brand__name">
            Natya<br />Drishti
          </span>
        </Link>

        <nav id="main-nav" className={`nav-links ${open ? "nav-links--open" : ""}`} aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-links__item ${isActive(link.to) ? "is-active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <NavLink to="/demo" className="btn btn--primary nav-links__mobile-cta">
            Try the demo <Icon name="arrow" size={18} />
          </NavLink>
        </nav>

        <NavLink to="/demo" className="btn btn--primary nav-cta">
          Try the demo <Icon name="arrow" size={18} />
        </NavLink>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpenAt(open ? null : location.key)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
    </header>
  );
}
