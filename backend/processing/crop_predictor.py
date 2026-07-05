from pathlib import Path

import joblib
import numpy as np


MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "crop_classifier.joblib"
)


CROP_LABELS = {
    1: "Wheat",
    2: "Mustard",
    3: "Lentil",
    4: "No Crop/Fallow",
    5: "Green Pea",
    6: "Sugarcane",
    8: "Garlic",
    9: "Maize",
    13: "Gram",
    14: "Coriander",
    15: "Potato",
    16: "Bersem",
    36: "Rice"
}


_model_package = None


def load_crop_model():
    global _model_package

    if _model_package is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Crop classifier not found: "
                f"{MODEL_PATH}"
            )

        _model_package = joblib.load(
            MODEL_PATH
        )

    return _model_package


def predict_crop(
    ndvi_mean,
    ndmi_mean
):
    model_package = load_crop_model()

    model = model_package["model"]

    features = np.array(
        [[
            ndvi_mean,
            ndmi_mean
        ]],
        dtype=np.float32
    )

    predicted_label = int(
        model.predict(features)[0]
    )

    probabilities = model.predict_proba(
        features
    )[0]

    confidence = float(
        np.max(probabilities)
    )

    return {
        "crop_label": predicted_label,
        "crop_name": CROP_LABELS.get(
            predicted_label,
            "Unknown"
        ),
        "confidence": confidence,
        "model_type": "Random Forest",
        "feature_names": model_package[
            "feature_names"
        ]
    }