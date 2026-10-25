// Single place for runtime configuration. Everything here is read from
// Vite env vars at build time (see .env.example), so the same code works
// locally and in production without edits.

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const config = {
  // Trailing slashes stripped so `${apiBaseUrl}/predict` never doubles up.
  apiBaseUrl: rawApiUrl.replace(/\/+$/, ""),
  // Free-tier hosts (e.g. Render) can take ~30-60s to wake from sleep.
  requestTimeoutMs: Number(import.meta.env.VITE_REQUEST_TIMEOUT_MS) || 90000,
  maxUploadMb: Number(import.meta.env.VITE_MAX_UPLOAD_MB) || 10,
};
