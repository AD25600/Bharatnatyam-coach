"""
Draws translucent red circles over joints that deviated from the
expected range. Identical logic to your Colab highlight_wrong_joints(),
just moved out of the notebook and imported instead.
"""

import cv2
from .pose_detector import JOINT_TO_LANDMARK_INDEX


def highlight_wrong_joints(image, landmarks, deviations):
    highlighted_image = image.copy()
    overlay = highlighted_image.copy()

    h, w = highlighted_image.shape[:2]

    for joint in deviations:
        if joint not in JOINT_TO_LANDMARK_INDEX:
            continue

        landmark = landmarks[JOINT_TO_LANDMARK_INDEX[joint]]

        # Normalized coordinates -> pixel coordinates
        x = int(landmark.x * w)
        y = int(landmark.y * h)

        # Draw red translucent circle
        cv2.circle(overlay, (x, y), 20, (0, 0, 255), -1)

    # Apply transparency
    highlighted_image = cv2.addWeighted(
        overlay, 0.35, highlighted_image, 0.65, 0
    )

    return highlighted_image
