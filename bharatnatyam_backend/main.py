"""
Minimal FastAPI app exposing predict_image() as a REST endpoint.

Run with:
    uvicorn main:app --reload
"""

import base64

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.predictor import predict_image


app = FastAPI(title="Bharatnatyam Pose Classifier")


# Allow the React/Vite frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()

    npimg = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if image is None:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Invalid image."
            },
        )

    result = predict_image(image)

    if not result["success"]:
        return JSONResponse(
            status_code=422,
            content=result
        )

    # Encode highlighted image as base64 for JSON response
    _, buffer = cv2.imencode(".jpg", result["image"])
    result["image"] = base64.b64encode(buffer).decode("utf-8")

    return JSONResponse(content=result)