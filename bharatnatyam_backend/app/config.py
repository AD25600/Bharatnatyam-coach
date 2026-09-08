"""
Central configuration for file paths used by the backend.
Adjust these paths to match wherever you place the trained
artifacts on your server / container.
"""

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# MediaPipe pose landmarker task file (same one you used in Colab)
POSE_LANDMARKER_MODEL_PATH = os.path.join(MODELS_DIR, "pose_landmarker_full.task")

# Trained Random Forest classifier (n_estimators=100, random_state=42,
# same as your current Colab model)
RF_MODEL_PATH = os.path.join(MODELS_DIR, "random_forest_model.joblib")

# Precomputed per-pose mean joint angles + 5th/95th percentile ranges,
# derived from your training dataset (replaces recomputing pose_means /
# pose_ranges from a live CSV on every request)
POSE_STATS_PATH = os.path.join(MODELS_DIR, "pose_stats.joblib")

MIN_POSE_DETECTION_CONFIDENCE = 0.5
MIN_POSE_PRESENCE_CONFIDENCE = 0.5

# Landmark visibility check (from your Colab process_frame()) — a frame
# is rejected if any of these important joints aren't clearly visible.
IMPORTANT_LANDMARK_INDICES = [
    11, 12,  # shoulders
    13, 14,  # elbows
    15, 16,  # wrists
    23, 24,  # hips
    25, 26,  # knees
    27, 28,  # ankles
]
VISIBILITY_THRESHOLD = 0.5
