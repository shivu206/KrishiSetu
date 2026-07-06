from datetime import date

import numpy as np


MINIMUM_TEMPORAL_OBSERVATIONS = 3


def calculate_trend(values):
    if len(values) < 2:
        return 0.0

    x_values = np.arange(
        len(values),
        dtype=np.float32
    )

    slope = np.polyfit(
        x_values,
        values,
        1
    )[0]

    return float(slope)


def extract_temporal_features(
    observations,
    sowing_date=None
):
    valid_observations = [
        observation
        for observation in observations
        if (
            observation.get("ndvi_mean")
            is not None
            and observation.get("ndmi_mean")
            is not None
        )
    ]

    if (
        len(valid_observations)
        < MINIMUM_TEMPORAL_OBSERVATIONS
    ):
        return {
            "status": "insufficient_temporal_data",
            "observation_count": len(
                valid_observations
            )
        }

    ndvi_values = np.array(
        [
            observation["ndvi_mean"]
            for observation in valid_observations
        ],
        dtype=np.float32
    )

    ndmi_values = np.array(
        [
            observation["ndmi_mean"]
            for observation in valid_observations
        ],
        dtype=np.float32
    )

    recent_window_size = min(
        3,
        len(valid_observations)
    )

    recent_ndvi_values = ndvi_values[
        -recent_window_size:
    ]

    recent_ndmi_values = ndmi_values[
        -recent_window_size:
    ]

    peak_ndvi_index = int(
        np.argmax(ndvi_values)
    )

    peak_ndvi = float(
        ndvi_values[peak_ndvi_index]
    )

    current_ndvi = float(
        ndvi_values[-1]
    )

    current_ndmi = float(
        ndmi_values[-1]
    )

    peak_ratio = (
        current_ndvi / peak_ndvi
        if peak_ndvi > 0
        else 0.0
    )

    vegetation_persistence = float(
        np.mean(
            ndvi_values >= 0.30
        )
    )

    latest_observation_date = (
        date.fromisoformat(
            valid_observations[-1]["date"]
        )
    )

    days_after_sowing = None

    if sowing_date is not None:
        if isinstance(sowing_date, str):
            sowing_date = date.fromisoformat(
                sowing_date
            )

        days_after_sowing = max(
            (
                latest_observation_date
                - sowing_date
            ).days,
            0
        )

    radar_values = [
        observation["vh_vv_ratio_mean"]
        for observation in valid_observations
        if (
            observation.get("radar_available")
            and observation.get(
                "vh_vv_ratio_mean"
            )
            is not None
        )
    ]

    radar_ratio_mean = None

    if radar_values:
        radar_ratio_mean = float(
            np.mean(radar_values)
        )

    return {
        "status": "temporal_features_extracted",
        "observation_count": len(
            valid_observations
        ),
        "ndvi_mean": float(
            np.mean(ndvi_values)
        ),
        "ndvi_min": float(
            np.min(ndvi_values)
        ),
        "ndvi_max": peak_ndvi,
        "ndvi_std": float(
            np.std(ndvi_values)
        ),
        "ndvi_current": current_ndvi,
        "ndvi_full_trend": calculate_trend(
            ndvi_values
        ),
        "ndvi_recent_trend": calculate_trend(
            recent_ndvi_values
        ),
        "ndmi_mean": float(
            np.mean(ndmi_values)
        ),
        "ndmi_min": float(
            np.min(ndmi_values)
        ),
        "ndmi_max": float(
            np.max(ndmi_values)
        ),
        "ndmi_std": float(
            np.std(ndmi_values)
        ),
        "ndmi_current": current_ndmi,
        "ndmi_full_trend": calculate_trend(
            ndmi_values
        ),
        "ndmi_recent_trend": calculate_trend(
            recent_ndmi_values
        ),
        "peak_ndvi_index": peak_ndvi_index,
        "peak_ratio": float(
            peak_ratio
        ),
        "vegetation_persistence": (
            vegetation_persistence
        ),
        "days_after_sowing": days_after_sowing,
        "radar_supported": bool(
            radar_values
        ),
        "radar_ratio_mean": radar_ratio_mean
    }