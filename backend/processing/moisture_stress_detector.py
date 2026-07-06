def detect_moisture_stress(
    temporal_features,
    phenology_analysis
):
    if (
        temporal_features.get("status")
        != "temporal_features_extracted"
    ):
        return {
            "stress_level": "unknown",
            "status": "insufficient_observations"
        }

    current_ndmi = temporal_features[
        "ndmi_current"
    ]

    mean_ndmi = temporal_features[
        "ndmi_mean"
    ]

    ndmi_trend = temporal_features[
        "ndmi_recent_trend"
    ]

    recent_ndvi_trend = temporal_features[
        "ndvi_recent_trend"
    ]

    growth_stage = phenology_analysis[
        "growth_stage"
    ]

    radar_supported = temporal_features[
        "radar_supported"
    ]

    radar_ratio_mean = temporal_features[
        "radar_ratio_mean"
    ]

    stress_score = 0

    if current_ndmi < 0.05:
        stress_score += 2

    elif current_ndmi < 0.10:
        stress_score += 1

    if ndmi_trend < -0.015:
        stress_score += 2

    elif ndmi_trend < 0:
        stress_score += 1

    if recent_ndvi_trend < -0.025:
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
        "mean_ndmi": mean_ndmi,
        "recent_ndmi_trend": ndmi_trend,
        "recent_ndvi_trend": recent_ndvi_trend,
        "radar_supported": radar_supported,
        "radar_ratio_mean": radar_ratio_mean
    }