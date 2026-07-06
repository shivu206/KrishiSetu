def detect_growth_stage(
    temporal_features
):
    if (
        temporal_features.get("status")
        != "temporal_features_extracted"
    ):
        return {
            "growth_stage": "insufficient_data",
            "status": "insufficient_observations"
        }

    current_ndvi = temporal_features[
        "ndvi_current"
    ]

    peak_ndvi = temporal_features[
        "ndvi_max"
    ]

    peak_index = temporal_features[
        "peak_ndvi_index"
    ]

    recent_trend = temporal_features[
        "ndvi_recent_trend"
    ]

    peak_ratio = temporal_features[
        "peak_ratio"
    ]

    days_after_sowing = temporal_features[
        "days_after_sowing"
    ]

    vegetation_persistence = temporal_features[
        "vegetation_persistence"
    ]

    if (
        current_ndvi < 0.35
        and recent_trend > 0
    ):
        growth_stage = "early_growth"

    elif (
        recent_trend > 0.025
        and peak_ratio < 0.90
    ):
        growth_stage = "vegetative"

    elif (
        peak_ratio >= 0.90
        and recent_trend >= -0.025
    ):
        growth_stage = "peak_growth"

    else:
        growth_stage = "decline"

    sowing_date_warning = None

    if (
        days_after_sowing is not None
        and days_after_sowing > 240
        and growth_stage in [
            "early_growth",
            "vegetative",
            "peak_growth"
        ]
        and vegetation_persistence >= 0.50
    ):
        sowing_date_warning = (
            "The supplied sowing date is inconsistent "
            "with the detected active vegetation cycle. "
            "Growth stage is inferred from the satellite "
            "time series."
        )

    return {
        "growth_stage": growth_stage,
        "status": "growth_stage_detected",
        "stage_inference_basis": (
            "satellite_temporal_signature"
        ),
        "current_ndvi": current_ndvi,
        "peak_ndvi": peak_ndvi,
        "peak_observation_index": peak_index,
        "recent_ndvi_trend": recent_trend,
        "peak_ratio": peak_ratio,
        "days_after_sowing": days_after_sowing,
        "sowing_date_warning": sowing_date_warning,
        "observation_count": temporal_features[
            "observation_count"
        ]
    }