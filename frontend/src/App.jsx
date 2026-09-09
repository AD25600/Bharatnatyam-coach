import { useState } from "react";
import Header from "./components/Header";
import InputStage from "./components/InputStage";
import ResultStage from "./components/ResultStage";
import { analyzePose } from "./api";
import "./App.css";

export default function App() {
  const [imageBlob, setImageBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function handleImageReady(blob, url) {
    setImageBlob(blob);
    setPreviewUrl(url);
    setResult(null);
    setError(null);
  }

  function handleClear() {
    setImageBlob(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  }

  async function handleAnalyze(blob = imageBlob) {
    if (!blob) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzePose(blob);
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong reaching the pose server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app kolam-field">
      <Header />
      <main className="stage">
        <InputStage
          onImageReady={handleImageReady}
          previewUrl={previewUrl}
          onClear={handleClear}
          onAnalyze={handleAnalyze}
          loading={loading}
          disabled={!imageBlob}
        />
        <ResultStage result={result} error={error} loading={loading} />
      </main>
      <footer className="site-footer">
        <p>Pose classification runs on the existing Random Forest + MediaPipe pipeline — this is only the interface.</p>
      </footer>
    </div>
  );
}
