from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from data import fields, satellite_analyses


app = FastAPI(
    title="KrishiSetu API",
    description="Satellite-driven crop monitoring and irrigation advisory backend",
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