"""
Minimal FastAPI app exposing predict_image() as a REST endpoint.
This is example wiring — swap for Flask/Django if you prefer, the
app.predictor.predict_image() function itself doesn't care.

Run with:
    uvicorn main:app --reload
"""

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

from app.predictor import predict_image

app = FastAPI(title="Bharatnatyam Pose Classifier")


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    npimg = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if image is None:
        return JSONResponse(
            status_code=400, content={"success": False, "message": "Invalid image."}
        )

    result = predict_image(image)

    if not result["success"]:
        return JSONResponse(status_code=422, content=result)

    # Encode the highlighted image as base64 so it can travel over JSON
    import base64

    _, buffer = cv2.imencode(".jpg", result["image"])
    result["image"] = base64.b64encode(buffer).decode("utf-8")

    return JSONResponse(content=result)
