import { Link } from "react-router-dom";
import { site } from "../content/site";
import Icon from "../components/Icon";
import { DancerIllustration, SkeletonPreview } from "../components/Illustrations";
import "./LandingPage.css";

function initials(name) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SectionHeading({ eyebrow, title, body, id }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      <div className="divider-ornament" aria-hidden="true"><Icon name="lotus" size={20} /></div>
      {body && <p className="section-heading__body">{body}</p>}
    </div>
  );
}

// Illustrative preview rows for the feedback mock-up.
const PREVIEW_ROWS = [
  { part: "Upper body", status: "Aligned", tone: "good" },
  { part: "Right elbow", status: "Review", tone: "adjust" },
  { part: "Torso", status: "Aligned", tone: "good" },
  { part: "Left knee", status: "Review", tone: "adjust" },
];

export default function LandingPage() {
  const { hero, highlights, howItWorks, preview, about, motivation, cta } = site;

  return (
    <main className="landing">
      {/* ---------- Hero ---------- */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div className="hero__text">
            <p className="eyebrow">
              {hero.eyebrow.map((w, i) => (
                <span key={w}>
                  {i > 0 && <span className="eyebrow__dot" aria-hidden="true"> · </span>}
                  {w}
                </span>
              ))}
            </p>
            <h1 id="hero-title" className="hero__title">
              {hero.title[0]} <span>{hero.title[1]}</span>
            </h1>
            <p className="hero__lead">{hero.lead}</p>
            <p className="hero__body">{hero.body}</p>
            <div className="hero__actions">
              <Link to="/demo" className="btn btn--primary btn--lg">
                {hero.cta} <Icon name="arrow" size={18} />
              </Link>
              <a href="#how-it-works" className="btn btn--outline btn--lg">{hero.secondary}</a>
            </div>
            <p className="hero__note"><span className="status-dot" aria-hidden="true" />{hero.note}</p>
          </div>

          <div className="hero__art">
            <div className="floating-tag floating-tag--top">
              <span className="floating-tag__kicker"><Icon name="sparkle" size={14} /> {hero.tags[0].kicker}</span>
              <strong>{hero.tags[0].title}</strong>
            </div>
            <div className="arch-frame">
              <DancerIllustration />
            </div>
            <div className="floating-tag floating-tag--bottom">
              <span className="floating-tag__kicker"><Icon name="sparkle" size={14} /> {hero.tags[1].kicker}</span>
              <strong>{hero.tags[1].title}</strong>
              <small>{hero.tags[1].small}</small>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Highlights strip ---------- */}
      <section className="highlights" aria-label="Highlights">
        <ul className="container highlights__grid">
          {highlights.map((h) => (
            <li key={h.title} className="highlight">
              <span className="icon-circle"><Icon name={h.icon} size={24} /></span>
              <strong>{h.title}</strong>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className="section" aria-labelledby="how-title">
        <div className="container">
          <SectionHeading id="how-title" eyebrow={howItWorks.eyebrow} title={howItWorks.title} body={howItWorks.body} />
          <ol className="steps">
            {howItWorks.steps.map((step, i) => (
              <li key={step.title} className="card step">
                <span className="step__num" aria-hidden="true">{i + 1}</span>
                <span className="icon-circle"><Icon name={step.icon} size={26} /></span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Feedback preview ---------- */}
      <section className="preview-section" aria-labelledby="preview-title">
        <div className="container">
          <div className="preview-panel">
            <div className="mock-window" aria-hidden="true">
              <div className="mock-window__bar"><i /><i /><i /><span>Natya Drishti · Pose review</span></div>
              <div className="mock-window__content">
                <div className="mock-window__pose">
                  <SkeletonPreview />
                  <span className="mock-window__label">Highlighted joints</span>
                </div>
                <div className="mock-window__results">
                  <p className="mock-window__heading">Aramandi</p>
                  <div className="mock-score">82%</div>
                  <p className="mock-score__caption">Accuracy</p>
                  {PREVIEW_ROWS.map((r) => (
                    <div key={r.part} className="mock-row">
                      <span>{r.part}</span>
                      <strong className={`mock-row__status mock-row__status--${r.tone}`}>{r.status}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="preview-panel__copy">
              <p className="eyebrow">{preview.eyebrow}</p>
              <h2 id="preview-title">{preview.title}</h2>
              <p>{preview.body}</p>
              <Link to="/demo" className="btn btn--primary">
                {preview.cta} <Icon name="arrow" size={18} />
              </Link>
              <small className="preview-panel__caption">{preview.caption}</small>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- About ---------- */}
      <section id="about" className="section section--tinted" aria-labelledby="about-title">
        <div className="container">
          <SectionHeading id="about-title" eyebrow={about.eyebrow} title={about.title} />
          <ul className="people">
            {about.team.map((name) => (
              <li key={name} className="card person">
                <span className="person__avatar" aria-hidden="true">{initials(name)}</span>
                <span className="person__name">{name}</span>
                <span className="person__role">Team member</span>
              </li>
            ))}
            <li className="card person person--mentor">
              <span className="person__avatar" aria-hidden="true">{initials(about.mentor.name)}</span>
              <span className="person__name">{about.mentor.name}</span>
              <span className="person__role">{about.mentor.role}</span>
            </li>
          </ul>
          <div className="prose prose--center">
            {about.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* ---------- Motivation ---------- */}
      <section id="motivation" className="section" aria-labelledby="motivation-title">
        <div className="container motivation">
          <div className="motivation__aside">
            <p className="eyebrow">{motivation.eyebrow}</p>
            <h2 id="motivation-title">{motivation.title}</h2>
            <div className="divider-ornament divider-ornament--start" aria-hidden="true"><Icon name="lotus" size={20} /></div>
          </div>
          <div className="motivation__body">
            <blockquote className="quote">{motivation.lead}</blockquote>
            <div className="prose">
              {motivation.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="cta" aria-labelledby="cta-title">
        <div className="container cta__inner">
          <p className="eyebrow">{cta.eyebrow}</p>
          <h2 id="cta-title">{cta.title[0]}<br />{cta.title[1]}</h2>
          <p>{cta.body}</p>
          <Link to="/demo" className="btn btn--primary btn--lg">
            {cta.button} <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
