// Talks to the existing FastAPI backend. Only the transport layer —
// the ML methodology and response shape are untouched.

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Sends an image (File or Blob) to POST /predict and returns the parsed
 * JSON response exactly as predictor.predict_image() produces it:
 *   { success, pose, accuracy, incorrect_joints, total_joints,
 *     worst_body_parts, feedback, deviations, image (base64 jpg) }
 * or, on a rejected frame: { success: false, message }.
 */
export async function analyzePose(fileOrBlob) {
  if (!(fileOrBlob instanceof Blob)) {
    throw new Error("The selected image is not a file. Please choose or capture another image.");
  }

  const formData = new FormData();
  const filename = fileOrBlob.name || "frame.jpg";
  formData.append("file", fileOrBlob, filename);

  let response;
  try {
    response = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      body: formData,
    });
  } catch (networkError) {
    throw new Error(
      `Couldn't reach the pose server at ${API_BASE}. Is the FastAPI backend running?`
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The pose server sent back something unreadable.");
  }

  // 400 (bad image) and 422 (no pose detected) both come back as JSON
  // with success: false — let the caller show payload.message.
  if (!response.ok && payload && typeof payload.success !== "undefined") {
    return payload;
  }
  if (!response.ok) {
    throw new Error(`Pose server error (${response.status}).`);
  }

  return payload;
}
