import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import BrandMark from "../components/BrandMark";
import { site } from "../content/site";

const FOOTER_LINKS = [
  { to: "/", label: "Home" },
  { to: "/#how-it-works", label: "How It Works" },
  { to: "/#about", label: "About" },
  { to: "/demo", label: "Demo" },
];

// Shared shell for every page: header, page content, footer.
export default function SiteLayout() {
  const { pathname, hash } = useLocation();

  // Scroll to #section links, otherwise to the top on page change.
  useEffect(() => {
    if (hash) {
      // Wait a frame so the target section exists after a page switch.
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" })
      );
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="app">
      <a href="#content" className="skip-link">Skip to content</a>
      <Header />
      <div id="content" className="app__content">
        <Outlet />
      </div>
      <footer className="site-footer">
        <div className="container">
          <div className="site-footer__top">
            <Link to="/" className="brand" aria-label={`${site.name} home`}>
              <BrandMark />
              <span className="brand__name">Natya<br />Drishti</span>
            </Link>
            <nav className="site-footer__links" aria-label="Footer">
              {FOOTER_LINKS.map((l) => (
                <Link key={l.to} to={l.to}>{l.label}</Link>
              ))}
            </nav>
          </div>
          <p className="site-footer__note">{site.footer.note}</p>
          <div className="site-footer__bottom">
            <span>© {new Date().getFullYear()} {site.name}. {site.footer.motto}</span>
            <span>Tradition · Practice · Progress</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
