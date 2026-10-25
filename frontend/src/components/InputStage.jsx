import { useRef, useState } from "react";
import WebcamCapture from "./WebcamCapture";
import { config } from "../config";

const MAX_BYTES = config.maxUploadMb * 1024 * 1024;

export default function InputStage({ onImageReady, previewUrl, onClear, onAnalyze, loading, disabled }) {
  const [mode, setMode] = useState("upload");
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  function handleFiles(files) {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFileError("That file isn't an image. Please choose a JPG, PNG, or WebP photo.");
      return;
    }
    if (file.size === 0) {
      setFileError("That image file is empty. Please choose another one.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setFileError(`That image is larger than ${config.maxUploadMb} MB. Please choose a smaller one.`);
      return;
    }
    setFileError(null);
    onImageReady(file, URL.createObjectURL(file));
  }

  return (
    <section className="panel input-panel" aria-labelledby="input-heading">
      <div className="panel__arch" aria-hidden="true" />
      <h2 id="input-heading" className="panel__title">Give it a pose</h2>

      <div className="tabbar" role="tablist" aria-label="Image source">
        <button
          role="tab"
          aria-selected={mode === "upload"}
          className={`tab ${mode === "upload" ? "tab--active" : ""}`}
          onClick={() => { setMode("upload"); setFileError(null); }}
          disabled={loading}
        >
          Upload image
        </button>
        <button
          role="tab"
          aria-selected={mode === "webcam"}
          className={`tab ${mode === "webcam" ? "tab--active" : ""}`}
          onClick={() => { setMode("webcam"); setFileError(null); }}
          disabled={loading}
        >
          Use webcam
        </button>
      </div>

      {mode === "upload" && !previewUrl && (
        <div
          className={`dropzone ${dragOver ? "dropzone--over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <p className="dropzone__title">Drop a photo of the pose here</p>
          <p className="dropzone__hint">or click to browse — full body, clearly lit, facing camera</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="visually-hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              // Reset so picking the same file again still fires onChange.
              e.target.value = "";
            }}
          />
        </div>
      )}

      {mode === "upload" && !previewUrl && fileError && (
        <p className="input-stage__error" role="alert">{fileError}</p>
      )}

      {mode === "webcam" && !previewUrl && (
        <WebcamCapture
          onCapture={(blob, dataUrl) => {
            onImageReady(blob, dataUrl);
            onAnalyze(blob);
          }}
        />
      )}

      {previewUrl && (
        <div className="preview">
          <img
            src={previewUrl}
            alt="Selected pose, ready to analyze"
            className="preview__image"
            onError={() => {
              onClear();
              setFileError("That image couldn't be displayed — it may be corrupted or in an unsupported format.");
            }}
          />
          <div className="preview__actions">
            <button type="button" className="btn btn--ghost" onClick={onClear} disabled={loading}>
              Choose a different frame
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onAnalyze()}
              disabled={disabled || loading}
            >
              {loading ? "Reading the pose\u2026" : "Analyze pose"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
