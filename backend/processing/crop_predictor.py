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


FALLOW_LABEL = 4


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


def run_spectral_baseline_prediction(
    current_ndvi,
    current_ndmi
):
    model_package = load_crop_model()

    model = model_package["model"]

    features = np.array(
        [[
            current_ndvi,
            current_ndmi
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
        "model_type": (
            "Experimental Random Forest "
            "Spectral Baseline"
        ),
        "inference_basis": (
            "latest_observation_ndvi_ndmi"
        ),
        "feature_names": model_package[
            "feature_names"
        ]
    }


def predict_crop(
    temporal_features,
    vegetation_analysis
):
    if (
        temporal_features.get("status")
        != "temporal_features_extracted"
    ):
        return {
            "crop_label": None,
            "crop_name": "Unknown",
            "confidence": None,
            "prediction_status": (
                "insufficient_temporal_data"
            ),
            "inference_summary": (
                "Crop inference requires a valid "
                "satellite temporal feature set."
            ),
            "baseline_prediction": None
        }

    if not vegetation_analysis.get(
        "vegetation_detected",
        False
    ):
        return {
            "crop_label": None,
            "crop_name": "No Active Crop Detected",
            "confidence": None,
            "prediction_status": (
                "no_vegetation_signature"
            ),
            "inference_summary": (
                "Crop classification was not run "
                "because no persistent vegetation "
                "signature was detected."
            ),
            "baseline_prediction": None
        }

    baseline_prediction = (
        run_spectral_baseline_prediction(
            current_ndvi=temporal_features[
                "ndvi_current"
            ],
            current_ndmi=temporal_features[
                "ndmi_current"
            ]
        )
    )

    baseline_label = baseline_prediction[
        "crop_label"
    ]

    vegetation_persistence = (
        temporal_features[
            "vegetation_persistence"
        ]
    )

    peak_ndvi = temporal_features[
        "ndvi_max"
    ]

    temporal_crop_signature = (
        vegetation_persistence >= 0.50
        and peak_ndvi >= 0.40
    )

    if (
        baseline_label == FALLOW_LABEL
        and temporal_crop_signature
    ):
        return {
            "crop_label": None,
            "crop_name": "Crop Type Uncertain",
            "confidence": None,
            "prediction_status": (
                "temporal_baseline_conflict"
            ),
            "inference_summary": (
                "Persistent vegetation was detected "
                "across the satellite time series, "
                "but the experimental latest-"
                "observation spectral baseline "
                "predicted fallow. Crop identity "
                "is therefore not reported."
            ),
            "baseline_prediction": (
                baseline_prediction
            )
        }

    return {
        "crop_label": baseline_prediction[
            "crop_label"
        ],
        "crop_name": baseline_prediction[
            "crop_name"
        ],
        "confidence": baseline_prediction[
            "confidence"
        ],
        "prediction_status": (
            "spectral_baseline_temporally_consistent"
        ),
        "inference_summary": (
            "The experimental latest-observation "
            "spectral baseline is consistent with "
            "the detected temporal vegetation state."
        ),
        "baseline_prediction": (
            baseline_prediction
        )
    }