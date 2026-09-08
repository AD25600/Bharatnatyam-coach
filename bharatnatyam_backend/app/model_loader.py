"""
Loads the trained Random Forest classifier and precomputed pose
statistics (mean joint angles + 5th/95th percentile ranges per pose)
ONCE when the backend process starts.

These artifacts are produced offline by train_model.py — they are
NOT recomputed or retrained per request.
"""

import joblib
from . import config


def _load_rf_model():
    return joblib.load(config.RF_MODEL_PATH)


def _load_pose_stats():
    """
    pose_stats.joblib contains a dict:
        {
            "pose_means": <DataFrame, index=pose_name, columns=joint angles>,
            "pose_ranges": <DataFrame, MultiIndex (pose_name, quantile),
                             columns=joint angles>
        }
    This mirrors the `pose_means` / `pose_ranges` DataFrames computed
    inline in your Colab `calculate_metrics()` function, just precomputed
    once instead of on every prediction call.
    """
    return joblib.load(config.POSE_STATS_PATH)


# Module-level singletons — loaded once at import (i.e. backend startup).
rf_model = _load_rf_model()
_pose_stats = _load_pose_stats()
pose_means = _pose_stats["pose_means"]
pose_ranges = _pose_stats["pose_ranges"]
