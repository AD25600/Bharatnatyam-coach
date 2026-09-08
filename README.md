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

## One backend change you need: CORS

The backend as cloned has no CORS policy, so the browser will block requests
from the Vite dev server. Add this to `bharatnatyam_backend/main.py` (this is
transport config, not ML logic):

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Add it right after `app = FastAPI(...)` in `main.py`.

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
