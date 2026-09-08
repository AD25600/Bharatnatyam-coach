# Bharatnatyam Pose Classifier — Backend

## Folder structure

```
bharatnatyam_backend/
├── app/
│   ├── __init__.py
│   ├── config.py          # file paths, MediaPipe thresholds, visibility check config
│   ├── pose_detector.py   # MediaPipe loading, landmark extraction, visibility check, joint-angle calc
│   ├── model_loader.py    # loads Random Forest model + pose stats ONCE at startup
│   ├── visualization.py   # highlight_wrong_joints()
│   └── predictor.py       # predict_image() — the main entry point
├── models/                # <- put your trained artifacts here (see below)
│   ├── pose_landmarker_full.task
│   ├── random_forest_model.joblib
│   └── pose_stats.joblib
├── train_model.py         # OFFLINE script: run manually to (re)train
├── main.py                # example FastAPI app exposing POST /predict
├── requirements.txt
└── README.md
```

## What you need to save into `models/`

1. **`pose_landmarker_full.task`** — the same MediaPipe model file you
   already used in Colab. Just copy it in.
2. **`random_forest_model.joblib`** and **`pose_stats.joblib`** — generated
   by running `train_model.py` once against your existing `my_data.csv`:

   ```bash
   python train_model.py --dataset my_data.csv --out-dir models/
   ```

   This uses the same methodology as your current Colab notebook — a
   70/30 `train_test_split`, then `RandomForestClassifier(n_estimators=100,
   random_state=42)` fit on the training split (no `StandardScaler`) — and
   precomputes the per-pose mean/percentile statistics that used to be
   recalculated inline in `calculate_metrics()`. Note that because the
   split is random, re-running this script trains on a different 70%
   each time and the saved model will vary slightly, same as it did in
   your original notebook.

## Running the backend

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Then POST an image file to `http://localhost:8000/predict`. The response
is the same dictionary `predict_image()` returns, with the highlighted
image base64-encoded.

## What changed vs. the Colab notebook

- **Removed entirely:** `files.upload()` loops, `google.colab` imports,
  `drive.mount()`, `input()` prompts, CSV dataset building, all
  `plt.show()` experimentation plots, model-comparison code
  (KNN/LogReg/SVM, accuracy bar charts, F1 heatmaps, scatter matrix),
  and the Colab-only webcam capture (`eval_js`, `getUserMedia` JS,
  `IPython.display`). The React frontend will handle webcam capture in
  the browser and send frames to `/predict` — the backend just accepts
  an image, however it was captured.
- **Moved to `train_model.py` (run manually, not per-request):** final
  Random Forest training — same 70/30 `train_test_split` +
  `RandomForestClassifier(n_estimators=100, random_state=42)` fit on
  the training split as your Colab notebook — and the one-time
  computation of `pose_means` / `pose_ranges`.
- **Loaded once at process startup, not per-request:** the MediaPipe
  `PoseLandmarker` (`pose_detector.py`), the trained Random Forest
  model, and the pose statistics (`model_loader.py`) — all as
  module-level singletons created at import time.
- **Added:** the important-landmark visibility check from your updated
  Colab `process_frame()` (shoulders/elbows/wrists/hips/knees/ankles,
  `visibility_threshold = 0.5`) — now applied inside
  `pose_detector.detect_landmarks()` before angles are computed.
- **Kept with identical math/logic:** `calculate_angle`,
  `compute_joint_angles` (same 8 joints), the percentile-deviation
  check, `accuracy = (total - incorrect) / total * 100`, the
  90%/75% feedback thresholds, the Arm/Leg/Torso worst-body-part
  grouping, and `highlight_wrong_joints`.
- **`predict_image(image)`** remains the single function that chains
  all of the above and returns a plain dict instead of printing to
  console or calling `plt.show()`.
