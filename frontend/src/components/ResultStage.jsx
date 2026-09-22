import ArchGauge from "./ArchGauge";

function toTitle(str) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ResultStage({ result, error, loading }) {
  if (loading) {
    return (
      <section className="panel result-panel result-panel--empty" aria-live="polite">
        <div className="panel__arch" aria-hidden="true" />
        <p className="result-panel__waiting">Reading joint angles against the reference pose…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel result-panel result-panel--empty" aria-live="assertive">
        <div className="panel__arch" aria-hidden="true" />
        <p className="result-panel__error-title">Couldn't read that frame</p>
        <p className="result-panel__error-body">{error}</p>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="panel result-panel result-panel--empty">
        <div className="panel__arch" aria-hidden="true" />
        <p className="result-panel__waiting">Your reading will appear here once you analyze a pose.</p>
      </section>
    );
  }

  if (!result.success) {
    return (
      <section className="panel result-panel result-panel--empty" aria-live="assertive">
        <div className="panel__arch" aria-hidden="true" />
        <p className="result-panel__error-title">No clear pose found</p>
        <p className="result-panel__error-body">{result.message}</p>
      </section>
    );
  }

  const deviationEntries = Object.entries(result.deviations || {}).sort((a, b) => b[1] - a[1]);

  return (
    <section className="panel result-panel" aria-labelledby="result-heading">
      <div className="panel__arch" aria-hidden="true" />
      <h2 id="result-heading" className="panel__title">Reading</h2>

      <div className="result-columns">
        <img
          src={`data:image/jpeg;base64,${result.image}`}
          alt={`Highlighted pose analysis for ${result.pose}`}
          className="result-columns__image"
        />

        <div className="result-columns__info">
          <div className="result-top__summary">
            <p className="result-top__pose-label">Detected pose</p>
            <h3 className="result-top__pose-name">{toTitle(result.pose)}</h3>
            <ArchGauge accuracy={result.accuracy} />
            <p className="result-top__joints">
              {result.incorrect_joints} of {result.total_joints} joints need correction
            </p>
          </div>

          <div className="info-card info-card--feedback">
            <p className="info-card__eyebrow">Overall Feedback</p>
            <p className="result-feedback__body">{result.feedback}</p>
          </div>

          {result.worst_body_parts?.length > 0 && (
            <div className="info-card">
              <p className="info-card__eyebrow">Focus Areas</p>
              <ul className="worst-parts__list">
                {result.worst_body_parts.map((part) => (
                  <li key={part} className="worst-parts__tag">{part}</li>
                ))}
              </ul>
            </div>
          )}

          {deviationEntries.length > 0 && (
            <div className="info-card">
              <p className="info-card__eyebrow">Joint-by-Joint Deviation</p>
              <p className="deviations__intro">
                Shows how far each joint's measured angle differs from the expected angle.
              </p>
              <ul className="deviations__list">
                {deviationEntries.map(([joint, degrees]) => (
                  <li key={joint} className="deviations__row">
                    <div className="deviations__row-top">
                      <span className="deviations__joint">{toTitle(joint)}</span>
                      <span className="deviations__degrees">{degrees.toFixed(1)}° deviation</span>
                    </div>
                    <span className="deviations__bar-track">
                      <span
                        className="deviations__bar-fill"
                        style={{ width: `${Math.min(100, degrees * 2)}%` }}
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