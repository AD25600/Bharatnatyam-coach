import { Link } from "react-router-dom";
import { site } from "../content/site";

function initials(name) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function LandingPage() {
  const { hero, steps, about, motivation } = site;

  return (
    <main className="landing">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__text">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">{hero.title}</h1>
          <p className="hero__body">{hero.body}</p>
          <div className="hero__actions">
            <Link to="/demo" className="btn btn--primary btn--lg">{hero.cta}</Link>
            <a href="#about" className="btn btn--ghost btn--lg">Meet the team</a>
          </div>
        </div>
        <div className="hero__art" aria-hidden="true">
          <svg viewBox="0 0 240 260">
            <path d="M20 250 V120 A100 100 0 0 1 220 120 V250" fill="none" stroke="var(--maroon-deep)" strokeWidth="6" />
            <path d="M44 250 V126 A76 76 0 0 1 196 126 V250" fill="none" stroke="var(--gold)" strokeWidth="2" strokeDasharray="4 8" />
            <path d="M10 250 H230" stroke="var(--gold)" strokeWidth="6" />
            <circle cx="120" cy="120" r="10" fill="var(--gold)" />
            <circle cx="120" cy="120" r="22" fill="none" stroke="var(--gold-soft)" strokeWidth="2" />
          </svg>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="how-title">
        <h2 id="how-title" className="section-title">How it works</h2>
        <ol className="steps">
          {steps.map((step, i) => (
            <li key={step.title} className="info-card step">
              <span className="step__num" aria-hidden="true">{i + 1}</span>
              <h3 className="info-card__eyebrow">{step.title}</h3>
              <p className="step__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="about" className="landing-section" aria-labelledby="about-title">
        <div className="panel prose-panel">
          <div className="panel__arch" aria-hidden="true" />
          <h2 id="about-title" className="panel__title">{about.title}</h2>
          <ul className="people">
            {about.team.map((name) => (
              <li key={name} className="person">
                <span className="person__avatar" aria-hidden="true">{initials(name)}</span>
                <span className="person__name">{name}</span>
              </li>
            ))}
            <li className="person person--mentor">
              <span className="person__avatar" aria-hidden="true">{initials(about.mentor.name)}</span>
              <span className="person__name">{about.mentor.name}</span>
              <span className="person__role">{about.mentor.role}</span>
            </li>
          </ul>
          <div className="prose">
            {about.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>
      </section>

      <section id="motivation" className="landing-section" aria-labelledby="motivation-title">
        <div className="panel prose-panel">
          <div className="panel__arch" aria-hidden="true" />
          <h2 id="motivation-title" className="panel__title">{motivation.title}</h2>
          <blockquote className="prose__lead">{motivation.lead}</blockquote>
          <div className="prose">
            {motivation.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>
      </section>

      <section className="landing-section cta-band" aria-labelledby="cta-title">
        <h2 id="cta-title" className="section-title">Ready to try a pose?</h2>
        <p className="cta-band__body">No sign-up needed — upload a photo or use your webcam.</p>
        <Link to="/demo" className="btn btn--primary btn--lg">{hero.cta}</Link>
      </section>
    </main>
  );
}
