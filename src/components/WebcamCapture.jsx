import { useEffect, useRef, useState } from "react";

export default function WebcamCapture({ onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setReady(true);
      } catch (err) {
        setError(
          "Camera access was blocked or unavailable. Allow camera permissions, or upload an image instead."
        );
      }
    }

    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function capture() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(blob, canvas.toDataURL("image/jpeg", 0.92));
      },
      "image/jpeg",
      0.92
    );
  }

  if (error) {
    return <p className="input-stage__error">{error}</p>;
  }

  return (
    <div className="webcam">
      <video ref={videoRef} className="webcam__video" muted playsInline aria-label="Live camera preview" />
      <button type="button" className="btn btn--primary webcam__shutter" onClick={capture} disabled={!ready}>
        Capture frame
      </button>
    </div>
  );
}
