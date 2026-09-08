"""
MediaPipe pose landmark extraction and joint-angle calculation.

This is a direct refactor of the Colab MEDIAPIPE SETUP,
LANDMARK INDICES, and ANGLE CALCULATION HELPER sections.
The math is unchanged — only the loading pattern changed
(loaded once at import time instead of once per Colab session).
"""

import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

from . import config

# ==========================================
# LANDMARK INDICES (MediaPipe Pose) — unchanged
# ==========================================
LEFT_SHOULDER, RIGHT_SHOULDER = 11, 12
LEFT_ELBOW, RIGHT_ELBOW = 13, 14
LEFT_WRIST, RIGHT_WRIST = 15, 16
LEFT_HIP, RIGHT_HIP = 23, 24
LEFT_KNEE, RIGHT_KNEE = 25, 26
LEFT_ANKLE, RIGHT_ANKLE = 27, 28

JOINT_TO_LANDMARK_INDEX = {
    "left elbow": LEFT_ELBOW,
    "right elbow": RIGHT_ELBOW,
    "left knee": LEFT_KNEE,
    "right knee": RIGHT_KNEE,
    "left shoulder": LEFT_SHOULDER,
    "right shoulder": RIGHT_SHOULDER,
    "left hip": LEFT_HIP,
    "right hip": RIGHT_HIP,
}


def _load_pose_landmarker():
    """
    Loads the MediaPipe PoseLandmarker ONCE. Called at module import
    time (see the singleton instance below), not per-request.
    """
    base_options = python.BaseOptions(
        model_asset_path=config.POSE_LANDMARKER_MODEL_PATH
    )
    options = vision.PoseLandmarkerOptions(
        base_options=base_options,
        running_mode=vision.RunningMode.IMAGE,
        min_pose_detection_confidence=config.MIN_POSE_DETECTION_CONFIDENCE,
        min_pose_presence_confidence=config.MIN_POSE_PRESENCE_CONFIDENCE,
    )
    return vision.PoseLandmarker.create_from_options(options)


# Module-level singleton — loaded once when the backend process starts.
_pose_landmarker = _load_pose_landmarker()


def calculate_angle(a, b, c):
    """
    Calculates the angle (in degrees) at point b,
    formed by points a-b-c. Identical to your Colab implementation.
    a, b, c are landmark objects with .x and .y
    """
    a = np.array([a.x, a.y])
    b = np.array([b.x, b.y])
    c = np.array([c.x, c.y])

    ba = a - b
    bc = c - b

    cosine_angle = np.dot(ba, bc) / (
        np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-8
    )

    # Clip to avoid numerical issues with arccos
    cosine_angle = np.clip(cosine_angle, -1.0, 1.0)
    angle = np.degrees(np.arccos(cosine_angle))
    return angle


def compute_joint_angles(landmarks):
    """
    Given 33 pose landmarks, returns a dict of the 8 standard
    joint angles. Identical logic to your Colab implementation.
    """
    angles = {}
    angles["left elbow"] = calculate_angle(
        landmarks[LEFT_SHOULDER], landmarks[LEFT_ELBOW], landmarks[LEFT_WRIST]
    )
    angles["right elbow"] = calculate_angle(
        landmarks[RIGHT_SHOULDER], landmarks[RIGHT_ELBOW], landmarks[RIGHT_WRIST]
    )
    angles["left knee"] = calculate_angle(
        landmarks[LEFT_HIP], landmarks[LEFT_KNEE], landmarks[LEFT_ANKLE]
    )
    angles["right knee"] = calculate_angle(
        landmarks[RIGHT_HIP], landmarks[RIGHT_KNEE], landmarks[RIGHT_ANKLE]
    )
    angles["left shoulder"] = calculate_angle(
        landmarks[LEFT_ELBOW], landmarks[LEFT_SHOULDER], landmarks[LEFT_HIP]
    )
    angles["right shoulder"] = calculate_angle(
        landmarks[RIGHT_ELBOW], landmarks[RIGHT_SHOULDER], landmarks[RIGHT_HIP]
    )
    angles["left hip"] = calculate_angle(
        landmarks[LEFT_SHOULDER], landmarks[LEFT_HIP], landmarks[LEFT_KNEE]
    )
    angles["right hip"] = calculate_angle(
        landmarks[RIGHT_SHOULDER], landmarks[RIGHT_HIP], landmarks[RIGHT_KNEE]
    )
    return angles


def _important_landmarks_visible(landmarks):
    """
    Same visibility check as your Colab process_frame(): rejects the
    frame if any important joint's visibility is below the threshold.
    """
    for idx in config.IMPORTANT_LANDMARK_INDICES:
        if landmarks[idx].visibility < config.VISIBILITY_THRESHOLD:
            return False
    return True


def detect_landmarks(image_bgr):
    """
    Runs MediaPipe pose detection on a single OpenCV (BGR) image.

    Replaces the per-image portion of process_batch(): image read +
    BGR->RGB conversion + mp.Image wrap + pose.detect() + the 33-landmark
    check. Upload-loop / batching / CSV logic has been removed since a
    backend receives one image per request. Also applies the important-
    landmark visibility check from your updated Colab process_frame().

    Returns:
        landmarks (list) or None if no valid, sufficiently visible
        33-point pose was detected.
    """
    import cv2

    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)

    result = _pose_landmarker.detect(mp_image)

    if not result.pose_landmarks:
        return None

    landmarks = result.pose_landmarks[0]
    if len(landmarks) != 33:
        return None

    if not _important_landmarks_visible(landmarks):
        return None

    return landmarks
