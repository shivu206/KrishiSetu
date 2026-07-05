from datetime import date
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from data import fields, satellite_analyses

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

from processing.crop_predictor import (
    predict_crop
)

from processing.phenology_detector import (
    detect_growth_stage
)

from processing.moisture_stress_detector import (
    detect_moisture_stress
)



SATELLITE_DATA_DIR = (
    Path(__file__).resolve().parent
    / "satellite_data"
)

SENTINEL2_DIRECTORY = (
    SATELLITE_DATA_DIR
    / "sentinel2"
)

SENTINEL1_DIRECTORY = (
    SATELLITE_DATA_DIR
    / "sentinel1"
)


app = FastAPI(
    title="KrishiSetu API",
    description=(
        "Satellite-driven crop monitoring "
        "and irrigation advisory backend"
    ),
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "KrishiSetu API"
    }


@app.get("/api/fields")
def get_fields():
    return {
        "fields": fields
    }


@app.get("/api/satellite-analysis")
def get_satellite_analysis():
    return {
        "analyses": satellite_analyses
    }


@app.get("/api/sentinel2/timeseries")
def get_sentinel2_timeseries(
    start_date: date,
    end_date: date | None = None
):
    observations = process_sentinel2_timeseries(
        SENTINEL2_DIRECTORY,
        start_date=start_date,
        end_date=end_date
    )

    return {
        "start_date": start_date.isoformat(),
        "end_date": (
            end_date.isoformat()
            if end_date is not None
            else None
        ),
        "observation_count": len(observations),
        "observations": observations
    }


@app.get("/api/sentinel1/timeseries")
def get_sentinel1_timeseries(
    start_date: date,
    end_date: date | None = None
):
    observations = process_sentinel1_timeseries(
        SENTINEL1_DIRECTORY,
        start_date=start_date,
        end_date=end_date
    )

    return {
        "start_date": start_date.isoformat(),
        "end_date": (
            end_date.isoformat()
            if end_date is not None
            else None
        ),
        "observation_count": len(observations),
        "observations": observations
    }


@app.get("/api/satellite/timeseries")
def get_fused_satellite_timeseries(
    start_date: date,
    end_date: date | None = None
):
    sentinel2_observations = (
        process_sentinel2_timeseries(
            SENTINEL2_DIRECTORY,
            start_date=start_date,
            end_date=end_date
        )
    )

    sentinel1_observations = (
        process_sentinel1_timeseries(
            SENTINEL1_DIRECTORY,
            start_date=start_date,
            end_date=end_date
        )
    )

    fused_observations = fuse_satellite_timeseries(
        sentinel2_observations,
        sentinel1_observations
    )

    return {
        "start_date": start_date.isoformat(),
        "end_date": (
            end_date.isoformat()
            if end_date is not None
            else None
        ),
        "observation_count": len(
            fused_observations
        ),
        "radar_supported_count": sum(
            observation["radar_available"]
            for observation in fused_observations
        ),
        "observations": fused_observations
    }


@app.get("/api/analysis")
def analyze_field(
    start_date: date,
    end_date: date | None = None
):
    sentinel2_observations = (
        process_sentinel2_timeseries(
            SENTINEL2_DIRECTORY,
            start_date=start_date,
            end_date=end_date
        )
    )

    sentinel1_observations = (
        process_sentinel1_timeseries(
            SENTINEL1_DIRECTORY,
            start_date=start_date,
            end_date=end_date
        )
    )

    fused_observations = fuse_satellite_timeseries(
        sentinel2_observations,
        sentinel1_observations
    )

    vegetation_analysis = (
        detect_vegetation_signature(
            fused_observations
        )
    )

    if not vegetation_analysis[
        "vegetation_detected"
    ]:
        return {
            "analysis_status": "stopped",
            "reason": vegetation_analysis["status"],
            "start_date": start_date.isoformat(),
            "end_date": (
                end_date.isoformat()
                if end_date is not None
                else None
            ),
            "vegetation_analysis": (
                vegetation_analysis
            )
        }

    latest_observation = (
        fused_observations[-1]
    )

    crop_prediction = predict_crop(
        ndvi_mean=latest_observation[
            "ndvi_mean"
        ],
        ndmi_mean=latest_observation[
            "ndmi_mean"
        ]
    )

    phenology_analysis = detect_growth_stage(
    fused_observations
    )

    moisture_stress_analysis = (
    detect_moisture_stress(
        fused_observations,
        phenology_analysis
    )
    )

    return {
        "analysis_status": "crop_analyzed",
        "start_date": start_date.isoformat(),
        "end_date": (
            end_date.isoformat()
            if end_date is not None
            else None
        ),
        "vegetation_analysis": (
            vegetation_analysis
        ),
        "crop_prediction": crop_prediction,
        "crop_prediction_status": (
            "baseline_model"
        ),
        "phenology_analysis": (
            phenology_analysis
        ),
        "moisture_stress_analysis": (
            moisture_stress_analysis
        ),
        "observation_count": len(
            fused_observations
        ),
        "radar_supported_count": sum(
            observation["radar_available"]
            for observation in fused_observations
        ),
        "observations": fused_observations
    }