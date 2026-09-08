"""
Backend-ready inference module.

predict_image() is the single entry point your API route should call.
It reproduces, on one image, exactly what your Colab pipeline did:

    pose detection -> visibility check -> joint angles ->
    Random Forest prediction -> percentile-deviation check ->
    accuracy % -> worst body parts -> feedback text -> highlighted image

All model/scaler/dataset-stat loading happens once at import time via
model_loader.py and pose_detector.py — nothing is retrained or
recomputed from a CSV on each call.
"""

import pandas as pd

from . import model_loader
from .pose_detector import detect_landmarks, compute_joint_angles
from .visualization import highlight_wrong_joints

JOINT_NAMES = [
    "left elbow", "right elbow",
    "left knee", "right knee",
    "left shoulder", "right shoulder",
    "left hip", "right hip",
]


def _compute_deviations(predicted_pose, angle_row):
    """
    Same percentile-based deviation logic as your Colab
    calculate_metrics(): for each joint angle, compare against the
    5th/95th percentile range for the predicted pose.
    """
    deviations = {}

    for joint in JOINT_NAMES:
        lower = model_loader.pose_ranges.loc[(predicted_pose, 0.05), joint]
        upper = model_loader.pose_ranges.loc[(predicted_pose, 0.95), joint]
        value = angle_row[joint]

        if value < lower:
            deviations[joint] = lower - value
        elif value > upper:
            deviations[joint] = value - upper

    return deviations


def _worst_body_parts(deviations, top_n=2):
    """Same grouping logic as Colab: elbow/wrist/shoulder -> Arm, etc."""
    body_part_scores = {}

    for joint, difference in deviations.items():
        if "elbow" in joint or "wrist" in joint or "shoulder" in joint:
            body_part = "Arm"
        elif "knee" in joint or "ankle" in joint or "hip" in joint:
            body_part = "Leg"
        elif "spine" in joint or "torso" in joint:
            body_part = "Torso"
        else:
            body_part = joint

        body_part_scores[body_part] = (
            body_part_scores.get(body_part, 0) + difference
        )

    return sorted(body_part_scores, key=body_part_scores.get, reverse=True)[:top_n]


def _feedback_for_accuracy(accuracy):
    """Same 90 / 75 thresholds as your Colab logic."""
    if accuracy >= 90:
        return "Excellent pose! Very few corrections needed."
    elif accuracy >= 75:
        return "Good pose, but some corrections are needed."
    else:
        return "Pose needs improvement. Focus on the highlighted body parts."


def predict_image(image):
    """
    Main backend entry point.

    Args:
        image: an OpenCV/NumPy BGR image (e.g. from cv2.imread or a
               decoded upload / webcam frame).

    Returns:
        dict with keys:
            success (bool)
            message (str, only present when success is False)
            pose (str)                  -- predicted pose name
            accuracy (float)            -- 0-100
            incorrect_joints (int)
            total_joints (int)
            worst_body_parts (list[str])
            feedback (str)
            deviations (dict[str, float])
            image (np.ndarray)          -- highlighted BGR image
    """
    landmarks = detect_landmarks(image)

    if landmarks is None:
        return {
            "success": False,
            "message": "No valid pose detected, or important joints "
                        "were not clearly visible in the image.",
        }

    # 1. Joint angles (unchanged calculation)
    joint_angles = compute_joint_angles(landmarks)
    angle_row = pd.Series(joint_angles)

    # 2. Random Forest prediction using the pre-trained, pre-loaded model
    feature_vector = angle_row[JOINT_NAMES].values.reshape(1, -1)
    predicted_pose = model_loader.rf_model.predict(feature_vector)[0]

    # 3. Percentile-based deviation check (unchanged logic)
    deviations = _compute_deviations(predicted_pose, angle_row)

    total_joints = len(JOINT_NAMES)
    incorrect_joints = len(deviations)
    accuracy = ((total_joints - incorrect_joints) / total_joints) * 100

    # 4. Worst body parts + feedback (unchanged logic)
    worst_parts = _worst_body_parts(deviations)
    feedback = _feedback_for_accuracy(accuracy)

    # 5. Highlighted image (unchanged logic)
    highlighted_image = highlight_wrong_joints(image, landmarks, deviations)

    return {
        "success": True,
        "pose": predicted_pose,
        "accuracy": accuracy,
        "incorrect_joints": incorrect_joints,
        "total_joints": total_joints,
        "worst_body_parts": worst_parts,
        "feedback": feedback,
        "deviations": deviations,
        "image": highlighted_image,
    }
