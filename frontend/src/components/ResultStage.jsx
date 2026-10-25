import { useEffect, useState } from "react";
import ArchGauge from "./ArchGauge";

function toTitle(str) {
  return String(str ?? "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// Same thresholds ArchGauge uses for its colour, so label and arc agree.
function accuracyTier(accuracy) {
  if (accuracy >= 90) return { label: "Excellent", tone: "good", hint: "Your alignment closely matches the reference pose." };
  if (accuracy >= 75) return { label: "Good — refine a few joints", tone: "fair", hint: "Small adjustments to the focus areas will sharpen this pose." };
  return { label: "Needs work", tone: "poor", hint: "Start with the focus areas below, one joint at a time." };
}

// Deviation in degrees → severity bucket for the row colour.
function severity(degrees) {
  if (degrees >= 25) return "high";
  if (degrees >= 10) return "medium";
  return "low";
}

function EmptyState({ live, title, body, actions }) {
  return (
    <section className="panel result-panel result-panel--empty" aria-live={live}>
      <div className="panel__arch" aria-hidden="true" />
      {title && <p className="result-panel__error-title">{title}</p>}
      <p className={title ? "result-panel__error-body" : "result-panel__waiting"}>{body}</p>
      {actions && <div className="result-panel__actions">{actions}</div>}
    </section>
  );
}

function SlowServerHint() {
  // Only mention a cold start if the request has been pending a while.
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(t);
  }, []);
  if (!slow) return null;
  return <p className="result-panel__hint">Still working — the server may be waking up, this can take up to a minute.</p>;
}

export default function ResultStage({ result, error, loading, onRetry, onReset }) {
  if (loading) {
    return (
      <section className="panel result-panel result-panel--empty" aria-live="polite" aria-busy="true">
        <div className="panel__arch" aria-hidden="true" />
        <span className="spinner" aria-hidden="true" />
        <p className="result-panel__waiting">Reading joint angles against the reference pose…</p>
        <SlowServerHint />
      </section>
    );
  }

  const retryButton = onRetry && (
    <button type="button" className="btn btn--primary" onClick={onRetry}>Try again</button>
  );

  if (error) {
    return <EmptyState live="assertive" title="Couldn't read that frame" body={error} actions={retryButton} />;
  }

  if (!result) {
    return <EmptyState live="polite" body="Your reading will appear here once you analyze a pose." />;
  }

  if (!result.success) {
    return (
      <EmptyState
        live="assertive"
        title="No clear pose found"
        body={
          <>
            {result.message}
            <span className="result-panel__tips">
              Tips: make sure your whole body — head to ankles — is in frame, the room is well lit,
              and you're facing the camera.
            </span>
          </>
        }
        actions={
          <button type="button" className="btn btn--ghost" onClick={onReset}>Choose a different frame</button>
        }
      />
    );
  }

  const accuracy = toNumber(result.accuracy);
  const tier = accuracyTier(accuracy);
  const incorrect = toNumber(result.incorrect_joints);
  const total = toNumber(result.total_joints);
  const focusAreas = Array.isArray(result.worst_body_parts) ? result.worst_body_parts : [];
  const deviationEntries = Object.entries(result.deviations || {})
    .map(([joint, degrees]) => [joint, toNumber(degrees)])
    .sort((a, b) => b[1] - a[1]);
  const maxDeviation = Math.max(45, ...deviationEntries.map(([, d]) => d));

  return (
    <section className="panel result-panel" aria-labelledby="result-heading" aria-live="polite">
      <div className="panel__arch" aria-hidden="true" />
      <div className="result-panel__header">
        <h2 id="result-heading" className="panel__title">Reading</h2>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onReset}>Try another pose</button>
      </div>

      <div className="result-columns">
        {result.image ? (
          <img
            src={`data:image/jpeg;base64,${result.image}`}
            alt={`Highlighted pose analysis for ${toTitle(result.pose)}`}
            className="result-columns__image"
          />
        ) : (
          <div className="result-columns__image result-columns__image--missing">Annotated image unavailable</div>
        )}

        <div className="result-columns__info">
          <div className="result-top__summary">
            <p className="result-top__pose-label">Detected pose</p>
            <h3 className="result-top__pose-name">{toTitle(result.pose)}</h3>
            <ArchGauge accuracy={accuracy} />
            <span className={`tier-badge tier-badge--${tier.tone}`}>{tier.label}</span>
            {total > 0 && (
              <p className="result-top__joints">
                {incorrect === 0
                  ? `All ${total} joints are within range`
                  : `${incorrect} of ${total} joints need correction`}
              </p>
            )}
            <p className="result-top__hint">{tier.hint}</p>
          </div>

          {result.feedback && (
            <div className="info-card info-card--feedback">
              <p className="info-card__eyebrow">Overall Feedback</p>
              <p className="result-feedback__body">{result.feedback}</p>
            </div>
          )}

          {focusAreas.length > 0 && (
            <div className="info-card">
              <p className="info-card__eyebrow">Focus Areas</p>
              <ul className="worst-parts__list">
                {focusAreas.map((part) => (
                  <li key={part} className="worst-parts__tag">{toTitle(part)}</li>
                ))}
              </ul>
            </div>
          )}

          {deviationEntries.length > 0 && (
            <div className="info-card">
              <p className="info-card__eyebrow">Joint-by-Joint Deviation</p>
              <p className="deviations__intro">
                How far each joint's measured angle differs from the expected angle, largest first.
              </p>
              <ul className="deviations__legend" aria-hidden="true">
                <li><span className="dot dot--low" />under 10°</li>
                <li><span className="dot dot--medium" />10–25°</li>
                <li><span className="dot dot--high" />over 25°</li>
              </ul>
              <ul className="deviations__list">
                {deviationEntries.map(([joint, degrees]) => (
                  <li key={joint} className={`deviations__row deviations__row--${severity(degrees)}`}>
                    <div className="deviations__row-top">
                      <span className="deviations__joint">{toTitle(joint)}</span>
                      <span className="deviations__degrees">{degrees.toFixed(1)}°</span>
                    </div>
                    <span className="deviations__bar-track">
                      <span
                        className="deviations__bar-fill"
                        style={{ width: `${Math.min(100, (degrees / maxDeviation) * 100)}%` }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
