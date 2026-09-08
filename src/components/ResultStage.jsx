import ArchGauge from "./ArchGauge";

function toTitle(str) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ResultStage({ result, error, loading }) {
  if (loading) {
    return (
      <section className="panel result-panel result-panel--empty" aria-live="polite">
        <div className="panel__arch" aria-hidden="true" />
        <p className="result-panel__waiting">Reading joint angles against the reference pose\u2026</p>
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

      <div className="result-top">
        <img
          src={`data:image/jpeg;base64,${result.image}`}
          alt={`Highlighted pose analysis for ${result.pose}`}
          className="result-top__image"
        />
        <div className="result-top__summary">
          <p className="result-top__pose-label">Detected pose</p>
          <h3 className="result-top__pose-name">{toTitle(result.pose)}</h3>
          <ArchGauge accuracy={result.accuracy} />
          <p className="result-top__joints">
            {result.incorrect_joints} of {result.total_joints} joints need correction
          </p>
        </div>
      </div>

      <p className="result-feedback">{result.feedback}</p>

      {result.worst_body_parts?.length > 0 && (
        <div className="worst-parts">
          <p className="worst-parts__label">Focus areas</p>
          <ul className="worst-parts__list">
            {result.worst_body_parts.map((part) => (
              <li key={part} className="worst-parts__tag">{part}</li>
            ))}
          </ul>
        </div>
      )}

      {deviationEntries.length > 0 && (
        <div className="deviations">
          <p className="deviations__label">Joint-by-joint deviation</p>
          <ul className="deviations__list">
            {deviationEntries.map(([joint, degrees]) => (
              <li key={joint} className="deviations__row">
                <span className="deviations__joint">{toTitle(joint)}</span>
                <span className="deviations__bar-track">
                  <span
                    className="deviations__bar-fill"
                    style={{ width: `${Math.min(100, degrees * 2)}%` }}
                  />
                </span>
                <span className="deviations__degrees">{degrees.toFixed(1)}\u00b0</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
