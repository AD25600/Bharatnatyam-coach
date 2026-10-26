import { Component } from "react";

// Last-resort catch so a render bug shows a friendly message instead of a
// blank white page in production.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="app fallback">
        <section className="panel fallback__panel">
          <div className="panel__arch" aria-hidden="true" />
          <h1 className="panel__title">Something went wrong</h1>
          <p className="fallback__body">An unexpected error occurred. Reloading the page usually fixes it.</p>
          <button type="button" className="btn btn--primary" onClick={() => window.location.assign("/")}>
            Back to home
          </button>
        </section>
      </div>
    );
  }
}
