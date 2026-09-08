import { useEffect, useState } from "react";

// A half-arch (180deg) gauge shaped like a temple-gate curve rather than a
// generic circular progress ring. Stroke color shifts with the feedback
// tier so the shape itself carries the verdict.
export default function ArchGauge({ accuracy }) {
  const [drawn, setDrawn] = useState(0);
  const radius = 84;
  const circumference = Math.PI * radius; // half circle
  const clamped = Math.max(0, Math.min(100, accuracy));

  useEffect(() => {
    const raf = requestAnimationFrame(() => setDrawn(clamped));
    return () => cancelAnimationFrame(raf);
  }, [clamped]);

  const tone =
    clamped >= 90 ? "var(--teal)" : clamped >= 75 ? "var(--gold)" : "var(--maroon-bright)";

  const offset = circumference - (drawn / 100) * circumference;

  return (
    <div className="arch-gauge" role="img" aria-label={`Pose accuracy ${Math.round(clamped)} percent`}>
      <svg viewBox="0 0 200 116" width="220" height="128">
        <path
          d="M 16 108 A 84 84 0 0 1 184 108"
          fill="none"
          stroke="var(--sand-line)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 16 108 A 84 84 0 0 1 184 108"
          fill="none"
          stroke={tone}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms ease, stroke 400ms ease" }}
        />
      </svg>
      <div className="arch-gauge__reading">
        <span className="arch-gauge__number">{Math.round(clamped)}</span>
        <span className="arch-gauge__percent">%</span>
      </div>
    </div>
  );
}
