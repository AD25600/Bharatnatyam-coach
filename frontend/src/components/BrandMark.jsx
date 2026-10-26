// Temple-arch logo mark shared by header and footer.
export default function BrandMark({ size = 40 }) {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" width={size * 0.6} height={size * 0.6}>
        <path d="M12 54V30a20 20 0 0 1 40 0v24" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M8 54h48" stroke="var(--gold)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="32" cy="30" r="5" fill="var(--gold)" />
      </svg>
    </span>
  );
}
