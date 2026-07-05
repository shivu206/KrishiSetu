import numpy as np


def detect_moisture_stress(
    observations,
    phenology_analysis
):
    if len(observations) < 3:
        return {
            "stress_level": "unknown",
            "status": "insufficient_observations"
        }

    recent_observations = observations[-3:]

    recent_ndmi_values = np.array(
        [
            observation["ndmi_mean"]
            for observation in recent_observations
        ],
        dtype=np.float32
    )

    current_ndmi = float(
        recent_ndmi_values[-1]
    )

    mean_recent_ndmi = float(
        np.mean(recent_ndmi_values)
    )

    ndmi_trend = float(
        recent_ndmi_values[-1]
        - recent_ndmi_values[0]
    )

    recent_ndvi_trend = float(
        phenology_analysis[
            "recent_ndvi_trend"
        ]
    )

    growth_stage = phenology_analysis[
        "growth_stage"
    ]

    radar_observations = [
        observation
        for observation in recent_observations
        if observation["radar_available"]
    ]

    radar_supported = (
        len(radar_observations) > 0
    )

    radar_ratio_mean = None

    if radar_supported:
        radar_ratio_mean = float(
            np.mean([
                observation[
                    "vh_vv_ratio_mean"
                ]
                for observation in radar_observations
            ])
        )

    stress_score = 0

    if current_ndmi < 0.05:
        stress_score += 2

    elif current_ndmi < 0.10:
        stress_score += 1

    if ndmi_trend < -0.03:
        stress_score += 2

    elif ndmi_trend < 0:
        stress_score += 1

    if recent_ndvi_trend < -0.05:
        stress_score += 2

    elif recent_ndvi_trend < 0:
        stress_score += 1

    if (
        growth_stage in [
            "vegetative",
            "peak_growth"
        ]
        and current_ndmi < 0.10
    ):
        stress_score += 1

    if (
        radar_ratio_mean is not None
        and radar_ratio_mean < 0.30
    ):
        stress_score += 1

    if stress_score >= 5:
        stress_level = "high"

    elif stress_score >= 3:
        stress_level = "moderate"

    else:
        stress_level = "low"

    return {
        "stress_level": stress_level,
        "status": "moisture_stress_detected",
        "stress_score": stress_score,
        "growth_stage": growth_stage,
        "current_ndmi": current_ndmi,
        "mean_recent_ndmi": mean_recent_ndmi,
        "recent_ndmi_trend": ndmi_trend,
        "recent_ndvi_trend": recent_ndvi_trend,
        "radar_supported": radar_supported,
        "radar_ratio_mean": radar_ratio_mean
    }