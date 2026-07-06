from datetime import date

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from processing.analysis_service import (
    run_field_analysis
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
        "service": "KrishiSetu API",
        "version": "1.0.0"
    }


@app.get("/api/analysis")
def analyze_field(
    latitude: float,
    longitude: float,
    sowing_date: date
):
    try:
        return run_field_analysis(
            latitude=latitude,
            longitude=longitude,
            sowing_date=sowing_date
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "A required analysis resource "
                "is unavailable."
            )
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "Field analysis failed: "
                f"{type(error).__name__}"
            )
        ) from error