import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { site } from "../content/site";

// Shared shell for every page: header, page content, footer.
export default function SiteLayout() {
  const { pathname, hash } = useLocation();

  // Scroll to #section links, otherwise to the top on page change.
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="app kolam-field">
      <Header />
      <Outlet />
      <footer className="site-footer">
        <p>{site.footer}</p>
        <p>© {new Date().getFullYear()} {site.name}</p>
      </footer>
    </div>
  );
}
