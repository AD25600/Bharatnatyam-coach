# Natya Drishti — Bharatanatyam Pose Coach UI

React frontend for the existing FastAPI + MediaPipe + Random Forest backend
in `bharatnatyam_backend`. This app only talks to `POST /predict` — no ML
logic lives here.

## Run it

```bash
npm install
cp .env.example .env   # adjust VITE_API_URL if your backend isn't on :8000
npm run dev
```

Then make sure the backend is running separately:

```bash
cd bharatnatyam_backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## CORS

Allowed origins come from the `ALLOWED_ORIGINS` env var on the backend
(comma-separated). It defaults to `http://localhost:5173,http://127.0.0.1:5173`
for local dev, so nothing needs setting locally.

## Deploying (Vercel/Netlify + Render)

**1. Backend → Render**

- New → Blueprint → pick this repo (uses `render.yaml`), or create a Python
  web service with root `bharatnatyam_backend`, build
  `pip install -r requirements.txt`, start
  `uvicorn main:app --host 0.0.0.0 --port $PORT`. Python 3.11 is pinned
  (mediapipe doesn't support the newest Python versions).
- Set `ALLOWED_ORIGINS` to your frontend URL, e.g. `https://your-app.vercel.app`.
- **Model files:** `random_forest_model.joblib` and `pose_stats.joblib` are
  git-ignored, but the server needs them in `bharatnatyam_backend/models/`.
  Either force-add them on the branch you deploy
  (`git add -f bharatnatyam_backend/models/*.joblib`), or host them somewhere
  (e.g. a GitHub release) and download them in the build command:
  `pip install -r requirements.txt && curl -L -o models/random_forest_model.joblib <url> && curl -L -o models/pose_stats.joblib <url>`.
- Free Render instances sleep when idle; the first request can take ~1 min.
  The UI shows a "server may be waking up" note and times out after 90s.

**2. Frontend → Vercel or Netlify**

- Vercel: import the repo, set Root Directory to `frontend` (framework: Vite).
  `frontend/vercel.json` handles SPA routing so `/demo` works on refresh.
- Netlify: import the repo; `netlify.toml` at the root already sets the base
  directory, build command, and SPA redirect.
- Set `VITE_API_URL` to your Render URL (e.g. `https://natya-drishti-api.onrender.com`)
  in the host's environment variables. It's baked in at build time, so
  redeploy after changing it.

## What the UI does

- **Upload or webcam** — drag-and-drop an image, or capture a frame live
  from the browser camera (`getUserMedia`, no extra library).
- Sends the frame to `POST /predict` as `multipart/form-data` under the
  `file` field, matching the existing endpoint exactly.
- Renders the full response: predicted pose, an accuracy gauge, the
  incorrect/total joint count, worst body parts, the feedback line, a
  per-joint deviation breakdown, and the highlighted output image the
  backend returns (base64 JPEG).
- Handles the backend's two failure paths: `success: false` with a
  `message` (e.g. "No valid pose detected") and a network/server error.

## Structure

```
src/
  config.js                 env-driven settings (API URL, timeout, upload limit)
  content/site.js           all landing-page copy — edit text here
  pages/                    LandingPage, DemoPage, NotFoundPage
  layout/SiteLayout.jsx     shared header/footer shell

  api.js                    fetch wrapper for POST /predict
  App.jsx / App.css         page layout + design system
  index.css                 color/type tokens
  components/
    Header.jsx
    InputStage.jsx           upload / webcam tab switch
    WebcamCapture.jsx
    ResultStage.jsx          renders the prediction
    ArchGauge.jsx             accuracy gauge (gopuram-arch shape)
```
