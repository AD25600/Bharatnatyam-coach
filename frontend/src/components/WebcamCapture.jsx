import { useEffect, useRef, useState } from "react";

export default function WebcamCapture({ onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const captureStartedRef = useRef(false);
  const countdownRef = useRef(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(null);

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
      if (timerRef.current) clearTimeout(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function capture() {
    if (captureStartedRef.current) return;
    captureStartedRef.current = true;
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      captureStartedRef.current = false;
      setCountdown(null);
      setError("The camera is not ready yet. Please try again.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      captureStartedRef.current = false;
      setCountdown(null);
      setError("The camera frame could not be captured. Please try again.");
      return;
    }
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        setCountdown(null);
        if (blob) {
          const frame = new File([blob], "frame.jpg", { type: "image/jpeg" });
          onCapture(frame, URL.createObjectURL(frame));
        } else {
          captureStartedRef.current = false;
          setError("The camera frame could not be captured. Please try again.");
        }
      },
      "image/jpeg",
      0.92
    );
  }

  function startCapture() {
    if (!ready || timerRef.current || captureStartedRef.current) return;
    setError(null);
    countdownRef.current = 3;
    setCountdown(3);
    timerRef.current = setInterval(() => {
      countdownRef.current -= 1;
      if (countdownRef.current <= 0) {
        clearInterval(timerRef.current);
        setCountdown(0);
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          capture();
        }, 0);
        return;
      }
      setCountdown(countdownRef.current);
    }, 1000);
  }

  if (error) {
    return <p className="input-stage__error">{error}</p>;
  }

  return (
    <div className="webcam">
      <div className="webcam__preview">
        <video ref={videoRef} className="webcam__video" muted playsInline aria-label="Live camera preview" />
        {countdown !== null && countdown > 0 && (
          <div className="webcam__countdown" aria-live="assertive" aria-label={`Capture in ${countdown} seconds`}>
            {countdown}
          </div>
        )}
      </div>
      <button type="button" className="btn btn--primary webcam__shutter" onClick={startCapture} disabled={!ready || countdown !== null}>
        Start Capture
      </button>
    </div>
  );
}
