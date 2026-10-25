import { useEffect, useRef, useState } from "react";
import InputStage from "../components/InputStage";
import ResultStage from "../components/ResultStage";
import { analyzePose } from "../api";

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
    <main className="stage">
      <h1 className="visually-hidden">Pose coach demo</h1>
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
    </main>
  );
}
