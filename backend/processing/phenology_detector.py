import numpy as np


def detect_growth_stage(
    observations
):
    if len(observations) < 3:
        return {
            "growth_stage": "insufficient_data",
            "status": "insufficient_observations"
        }

    ndvi_values = np.array(
        [
            observation["ndvi_mean"]
            for observation in observations
        ],
        dtype=np.float32
    )

    current_ndvi = float(
        ndvi_values[-1]
    )

    peak_ndvi = float(
        np.max(ndvi_values)
    )

    peak_index = int(
        np.argmax(ndvi_values)
    )

    recent_values = ndvi_values[-3:]

    recent_trend = float(
        recent_values[-1]
        - recent_values[0]
    )

    peak_ratio = (
        current_ndvi / peak_ndvi
        if peak_ndvi > 0
        else 0.0
    )

    if (
        current_ndvi < 0.35
        and recent_trend > 0
    ):
        growth_stage = "early_growth"

    elif (
        recent_trend > 0.05
        and peak_ratio < 0.90
    ):
        growth_stage = "vegetative"

    elif peak_ratio >= 0.90:
        growth_stage = "peak_growth"

    else:
        growth_stage = "decline"

    return {
        "growth_stage": growth_stage,
        "status": "growth_stage_detected",
        "current_ndvi": current_ndvi,
        "peak_ndvi": peak_ndvi,
        "peak_observation_index": peak_index,
        "recent_ndvi_trend": recent_trend,
        "peak_ratio": float(peak_ratio),
        "observation_count": len(
            observations
        )
    }
