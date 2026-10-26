import { useEffect, useRef, useState } from "react";
import InputStage from "../components/InputStage";
import ResultStage from "../components/ResultStage";
import Icon from "../components/Icon";
import { analyzePose } from "../api";
import "./DemoPage.css";

const TIPS = ["Whole body in frame, head to ankles", "Bright, even lighting", "Face the camera", "Plain background helps"];

export default function DemoPage() {
  const [imageBlob, setImageBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const requestRef = useRef(null);

  // Free the object URL whenever the preview changes or the page unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Cancel an in-flight request if the user leaves the page.
  useEffect(() => () => requestRef.current?.abort(), []);

  function handleImageReady(blob, url) {
    requestRef.current?.abort();
    setImageBlob(blob);
    setPreviewUrl(url);
    setResult(null);
    setError(null);
    setLoading(false);
  }

  function handleClear() {
    requestRef.current?.abort();
    setImageBlob(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setLoading(false);
  }

  async function handleAnalyze(blob = imageBlob) {
    if (!blob) return;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzePose(blob, { signal: controller.signal });
      if (!controller.signal.aborted) setResult(data);
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err.message || "Something went wrong reaching the pose server.");
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        setLoading(false);
      }
    }
  }

  return (
    <main className="demo">
      <section className="demo-intro">
        <div className="container">
          <p className="eyebrow">Pose studio</p>
          <h1 className="demo-intro__title">Analyse your <span>pose</span></h1>
          <p className="demo-intro__body">
            Upload a photo or use your webcam. You'll get the detected pose, an accuracy score, and joint-by-joint feedback.
          </p>
          <ul className="tips" aria-label="Tips for a good reading">
            {TIPS.map((t) => (
              <li key={t} className="tips__item"><Icon name="sparkle" size={14} />{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container stage">
      <InputStage
        onImageReady={handleImageReady}
        previewUrl={previewUrl}
        onClear={handleClear}
        onAnalyze={handleAnalyze}
        loading={loading}
        disabled={!imageBlob}
      />
      <ResultStage
        result={result}
        error={error}
        loading={loading}
        onRetry={imageBlob ? () => handleAnalyze() : null}
        onReset={handleClear}
      />
      </div>
    </main>
  );
}
