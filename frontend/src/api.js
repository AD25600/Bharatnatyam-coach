// Talks to the existing FastAPI backend. Only the transport layer —
// the ML methodology and response shape are untouched.

import { config } from "./config";

const API_BASE = config.apiBaseUrl;

/**
 * Sends an image (File or Blob) to POST /predict and returns the parsed
 * JSON response exactly as predictor.predict_image() produces it:
 *   { success, pose, accuracy, incorrect_joints, total_joints,
 *     worst_body_parts, feedback, deviations, image (base64 jpg) }
 * or, on a rejected frame: { success: false, message }.
 */
export async function analyzePose(fileOrBlob, { signal } = {}) {
  if (!(fileOrBlob instanceof Blob)) {
    throw new Error("The selected image is not a file. Please choose or capture another image.");
  }

  const formData = new FormData();
  const filename = fileOrBlob.name || "frame.jpg";
  formData.append("file", fileOrBlob, filename);

  // Abort on timeout, or when the caller cancels (e.g. user clears the frame).
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, config.requestTimeoutMs);
  signal?.addEventListener("abort", () => controller.abort(), { once: true });

  let response;
  try {
    response = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
  } catch (networkError) {
    if (timedOut) {
      throw new Error("The pose server took too long to respond. It may be waking up — please try again in a moment.");
    }
    if (networkError.name === "AbortError") throw networkError;
    throw new Error(
      navigator.onLine === false
        ? "You appear to be offline. Check your connection and try again."
        : "Couldn't reach the pose server. It may be starting up or temporarily unavailable — please try again shortly."
    );
  } finally {
    clearTimeout(timer);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    if (response.status === 413) throw new Error("That image is too large for the server. Try a smaller one.");
    if (response.status >= 500) throw new Error(`The pose server hit an error (${response.status}). Please try again.`);
    throw new Error("The pose server sent back something unreadable.");
  }

  // 400 (bad image) and 422 (no pose detected) both come back as JSON
  // with success: false — let the caller show payload.message.
  if (!response.ok && payload && typeof payload.success !== "undefined") {
    return { ...payload, message: payload.message || "The pose couldn't be read from this image." };
  }
  if (!response.ok) {
    throw new Error(`Pose server error (${response.status}).`);
  }
  if (!payload || (payload.success && typeof payload.pose !== "string")) {
    throw new Error("The pose server sent back an incomplete result. Please try again.");
  }

  return payload;
}
