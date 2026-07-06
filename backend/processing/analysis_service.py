from datetime import date
from pathlib import Path

from processing.sentinel2_timeseries import (
    process_sentinel2_timeseries
)

from processing.sentinel1_timeseries import (
    process_sentinel1_timeseries
)

from processing.temporal_fusion import (
    fuse_satellite_timeseries
)

from processing.vegetation_detector import (
    detect_vegetation_signature
)

from processing.temporal_feature_extractor import (
    extract_temporal_features
)

from processing.crop_predictor import (
    predict_crop
)

from processing.phenology_detector import (
    detect_growth_stage
)

from processing.moisture_stress_detector import (
    detect_moisture_stress
)

from processing.weather_service import (
    fetch_weather_data
)

from processing.water_deficit_advisor import (
    estimate_water_deficit
)


SATELLITE_DATA_DIRECTORY = (
    Path(__file__).resolve().parent.parent
    / "satellite_data"
)

SENTINEL2_DIRECTORY = (
    SATELLITE_DATA_DIRECTORY
    / "sentinel2"
)

SENTINEL1_DIRECTORY = (
    SATELLITE_DATA_DIRECTORY
    / "sentinel1"
)


def validate_analysis_input(
    latitude,
    longitude,
    sowing_date
):
    if not -90 <= latitude <= 90:
        raise ValueError(
            "Latitude must be between -90 and 90."
        )

    if not -180 <= longitude <= 180:
        raise ValueError(
            "Longitude must be between -180 and 180."
        )

    if sowing_date > date.today():
        raise ValueError(
            "Sowing date cannot be in the future."
        )


def run_field_analysis(
    latitude,
    longitude,
    sowing_date
):
    validate_analysis_input(
        latitude=latitude,
        longitude=longitude,
        sowing_date=sowing_date
    )

    sentinel2_observations = (
        process_sentinel2_timeseries(
            SENTINEL2_DIRECTORY,
            start_date=sowing_date,
            end_date=None
        )
    )

    sentinel1_observations = (
        process_sentinel1_timeseries(
            SENTINEL1_DIRECTORY,
            start_date=sowing_date,
            end_date=None
        )
    )

    fused_observations = (
        fuse_satellite_timeseries(
            sentinel2_observations,
            sentinel1_observations
        )
    )

    if not fused_observations:
        return {
            "analysis_status": "stopped",
            "reason": "no_satellite_observations",
            "sowing_date": sowing_date.isoformat(),
            "latitude": float(latitude),
            "longitude": float(longitude),
            "observation_count": 0,
            "observations": []
        }

    vegetation_analysis = (
        detect_vegetation_signature(
            fused_observations
        )
    )

    temporal_features = (
        extract_temporal_features(
            fused_observations,
            sowing_date=sowing_date
        )
    )

    if (
        temporal_features.get("status")
        != "temporal_features_extracted"
    ):
        return {
            "analysis_status": "stopped",
            "reason": (
                "insufficient_temporal_data"
            ),
            "sowing_date": sowing_date.isoformat(),
            "latitude": float(latitude),
            "longitude": float(longitude),
            "vegetation_analysis": (
                vegetation_analysis
            ),
            "temporal_features": (
                temporal_features
            ),
            "observation_count": len(
                fused_observations
            ),
            "observations": fused_observations
        }

    if not vegetation_analysis[
        "vegetation_detected"
    ]:
        return {
            "analysis_status": "stopped",
            "reason": vegetation_analysis[
                "status"
            ],
            "sowing_date": sowing_date.isoformat(),
            "latitude": float(latitude),
            "longitude": float(longitude),
            "vegetation_analysis": (
                vegetation_analysis
            ),
            "temporal_features": (
                temporal_features
            ),
            "observation_count": len(
                fused_observations
            ),
            "observations": fused_observations
        }

    crop_prediction = predict_crop(
        temporal_features=temporal_features,
        vegetation_analysis=vegetation_analysis
    )

    phenology_analysis = (
        detect_growth_stage(
            temporal_features
        )
    )

    moisture_stress_analysis = (
        detect_moisture_stress(
            temporal_features,
            phenology_analysis
        )
    )

    latest_observation = (
        fused_observations[-1]
    )

    analysis_date = date.fromisoformat(
        latest_observation["date"]
    )

    weather_analysis = fetch_weather_data(
        latitude=latitude,
        longitude=longitude,
        analysis_date=analysis_date
    )

    water_deficit_analysis = (
        estimate_water_deficit(
            growth_stage=phenology_analysis[
                "growth_stage"
            ],
            stress_level=moisture_stress_analysis[
                "stress_level"
            ],
            reference_et_mm_8day=weather_analysis[
                "reference_et_mm_8day"
            ],
            rainfall_mm_8day=weather_analysis[
                "rainfall_mm_8day"
            ]
        )
    )

    return {
        "analysis_status": "analysis_completed",
        "sowing_date": sowing_date.isoformat(),
        "latitude": float(latitude),
        "longitude": float(longitude),
        "analysis_date": analysis_date.isoformat(),
        "vegetation_analysis": (
            vegetation_analysis
        ),
        "temporal_features": (
            temporal_features
        ),
        "crop_prediction": (
            crop_prediction
        ),
        "phenology_analysis": (
            phenology_analysis
        ),
        "moisture_stress_analysis": (
            moisture_stress_analysis
        ),
        "weather_analysis": (
            weather_analysis
        ),
        "water_deficit_analysis": (
            water_deficit_analysis
        ),
        "observation_count": len(
            fused_observations
        ),
        "radar_supported_count": sum(
            bool(
                observation.get(
                    "radar_available",
                    False
                )
            )
            for observation
            in fused_observations
        ),
        "observations": fused_observations
    }