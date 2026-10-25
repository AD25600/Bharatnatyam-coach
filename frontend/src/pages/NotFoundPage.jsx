import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="fallback">
      <section className="panel fallback__panel">
        <div className="panel__arch" aria-hidden="true" />
        <h1 className="panel__title">Page not found</h1>
        <p className="fallback__body">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn--primary">Back to home</Link>
      </section>
    </main>
  );
}
