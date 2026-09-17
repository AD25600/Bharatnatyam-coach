"""
Draws the MediaPipe pose skeleton over the image: GREEN for regions
whose angle is within the expected range, RED for the exact A -> B -> C
body region behind any angle listed in the existing `deviations` dict
(from predictor.py's percentile-deviation check).

No new correctness logic lives here. Each of the 8 evaluated joint
angles is defined by a 3-landmark triple (A -> B -> C); when that
angle deviates, only the two segments of that triple (A-B and B-C)
and its three landmarks are drawn RED. Everything else stays GREEN,
so the red highlighting is localized to the actual deviated angle
instead of spreading across the whole limb or skeleton.
"""

import cv2

from .pose_detector import (
    LEFT_SHOULDER, RIGHT_SHOULDER,
    LEFT_ELBOW, RIGHT_ELBOW,
    LEFT_WRIST, RIGHT_WRIST,
    LEFT_HIP, RIGHT_HIP,
    LEFT_KNEE, RIGHT_KNEE,
    LEFT_ANKLE, RIGHT_ANKLE,
)

GREEN = (0, 200, 0)   # BGR
RED = (0, 0, 255)     # BGR

JOINT_RADIUS = 9
ENDPOINT_RADIUS = 7
LINE_THICKNESS = 5

# The same 8 angles predictor.py evaluates, each defined by the exact
# A -> B -> C landmark triple used in pose_detector.compute_joint_angles().
# This is the single source of truth for which points/segments light up
# when a given joint name appears in `deviations`.
JOINT_ANGLE_TRIPLES = {
    "left elbow": (LEFT_SHOULDER, LEFT_ELBOW, LEFT_WRIST),
    "right elbow": (RIGHT_SHOULDER, RIGHT_ELBOW, RIGHT_WRIST),
    "left knee": (LEFT_HIP, LEFT_KNEE, LEFT_ANKLE),
    "right knee": (RIGHT_HIP, RIGHT_KNEE, RIGHT_ANKLE),
    "left shoulder": (LEFT_ELBOW, LEFT_SHOULDER, LEFT_HIP),
    "right shoulder": (RIGHT_ELBOW, RIGHT_SHOULDER, RIGHT_HIP),
    "left hip": (LEFT_SHOULDER, LEFT_HIP, LEFT_KNEE),
    "right hip": (RIGHT_SHOULDER, RIGHT_HIP, RIGHT_KNEE),
}

# Every segment drawn to form the visible skeleton (includes the two
# cross-body reference lines, which are never part of any evaluated
# angle and therefore always stay green).
SKELETON_CONNECTIONS = [
    (LEFT_SHOULDER, RIGHT_SHOULDER),
    (LEFT_HIP, RIGHT_HIP),
    (LEFT_SHOULDER, LEFT_HIP),
    (RIGHT_SHOULDER, RIGHT_HIP),
    (LEFT_SHOULDER, LEFT_ELBOW),
    (LEFT_ELBOW, LEFT_WRIST),
    (RIGHT_SHOULDER, RIGHT_ELBOW),
    (RIGHT_ELBOW, RIGHT_WRIST),
    (LEFT_HIP, LEFT_KNEE),
    (LEFT_KNEE, LEFT_ANKLE),
    (RIGHT_HIP, RIGHT_KNEE),
    (RIGHT_KNEE, RIGHT_ANKLE),
]

ALL_LANDMARKS = (
    LEFT_SHOULDER, RIGHT_SHOULDER,
    LEFT_ELBOW, RIGHT_ELBOW,
    LEFT_WRIST, RIGHT_WRIST,
    LEFT_HIP, RIGHT_HIP,
    LEFT_KNEE, RIGHT_KNEE,
    LEFT_ANKLE, RIGHT_ANKLE,
)


def _deviated_points_and_segments(deviations):
    """
    Expands the existing `deviations` dict (joint_name -> degrees off)
    into the exact set of landmarks and segments that should be drawn
    RED, using each angle's own A -> B -> C triple. A segment/point
    shared by two triples (e.g. the shoulder-hip segment belongs to
    both the shoulder angle and the hip angle) is red if either of
    those angles deviated.
    """
    red_points = set()
    red_segments = set()

    for joint_name in deviations:
        triple = JOINT_ANGLE_TRIPLES.get(joint_name)
        if triple is None:
            continue
        a, b, c = triple
        red_points.update((a, b, c))
        red_segments.add(frozenset((a, b)))
        red_segments.add(frozenset((b, c)))

    return red_points, red_segments


def _to_pixel(landmark, w, h):
    return int(landmark.x * w), int(landmark.y * h)


def highlight_wrong_joints(image, landmarks, deviations):
    """
    Draws the pose skeleton with RED localized to the exact A -> B -> C
    body region behind each deviated angle in `deviations`, and GREEN
    everywhere else. Reuses `deviations` as-is; no angle math happens
    here.
    """
    highlighted_image = image.copy()
    h, w = highlighted_image.shape[:2]

    red_points, red_segments = _deviated_points_and_segments(deviations)

    # Segments first so joint circles render cleanly on top.
    for a_idx, b_idx in SKELETON_CONNECTIONS:
        a = _to_pixel(landmarks[a_idx], w, h)
        b = _to_pixel(landmarks[b_idx], w, h)
        color = RED if frozenset((a_idx, b_idx)) in red_segments else GREEN
        cv2.line(highlighted_image, a, b, color, LINE_THICKNESS, cv2.LINE_AA)

    for idx in ALL_LANDMARKS:
        point = _to_pixel(landmarks[idx], w, h)
        radius = JOINT_RADIUS if idx not in (LEFT_WRIST, RIGHT_WRIST, LEFT_ANKLE, RIGHT_ANKLE) else ENDPOINT_RADIUS
        color = RED if idx in red_points else GREEN
        cv2.circle(highlighted_image, point, radius, color, -1, cv2.LINE_AA)
        cv2.circle(highlighted_image, point, radius, (255, 255, 255), 2, cv2.LINE_AA)

    return highlighted_image