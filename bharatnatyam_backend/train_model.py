"""
OFFLINE training script — run this manually whenever you want to
(re)train on a new/updated dataset CSV. This is NOT called by the
backend at request time.

It reproduces your current Colab methodology exactly:
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)

No StandardScaler is used — Random Forest doesn't need feature scaling,
and your Colab code doesn't scale before rf.fit() either.

and precomputes pose_means / pose_ranges once, so the backend doesn't
recompute them from the raw dataset on every prediction.

Usage:
    python train_model.py --dataset path/to/my_data.csv --out-dir models/

Note: all of Colab's model-comparison/evaluation code (KNN, LogReg,
SVM, accuracy bar charts, F1 heatmaps, scatter matrix) has been
intentionally left out — it was experimentation, not the production
path. Add it back here if you want to re-run that comparison, but it
should never run inside the backend.
"""

import argparse
import os

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier


def train(dataset_csv_path: str, out_dir: str):
    dataset = pd.read_csv(dataset_csv_path)

    X = dataset.drop(["image_name", "pose_name"], axis=1)
    y = dataset["pose_name"]

    # Same split as your Colab notebook:
    # X_train, X_test, y_train, y_test = train_test_split(..., test_size=0.3)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

    # Final model choice from your Colab notebook, fit on X_train/y_train
    # exactly as in the original code
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)

    test_accuracy = rf.score(X_test, y_test)
    print(f"Current model's Accuracy: {test_accuracy}")

    # Precompute pose statistics used for deviation checking
    pose_means = dataset.groupby("pose_name")[X.columns].mean()
    pose_ranges = (
        dataset.groupby("pose_name")[pose_means.columns].quantile([0.05, 0.95])
    )

    os.makedirs(out_dir, exist_ok=True)

    joblib.dump(rf, os.path.join(out_dir, "random_forest_model.joblib"))
    joblib.dump(
        {"pose_means": pose_means, "pose_ranges": pose_ranges},
        os.path.join(out_dir, "pose_stats.joblib"),
    )

    print(f"Saved random_forest_model.joblib and pose_stats.joblib to {out_dir}")
    print(f"Trained on {len(X_train)} rows (70%) across {y.nunique()} poses.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", required=True, help="Path to my_data.csv")
    parser.add_argument("--out-dir", default="models", help="Where to save artifacts")
    args = parser.parse_args()

    train(args.dataset, args.out_dir)
