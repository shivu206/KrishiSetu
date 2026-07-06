from datetime import date, timedelta

import requests

from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


OPEN_METEO_ARCHIVE_URL = (
    "https://archive-api.open-meteo.com/v1/archive"
)


WEATHER_FALLBACK_DATA = {
    "rainfall_mm_8day": 8.4,
    "reference_et_mm_8day": 48.25
}


def create_weather_session():
    retry_strategy = Retry(
        total=2,
        connect=2,
        read=2,
        backoff_factor=1,
        status_forcelist=[
            429,
            500,
            502,
            503,
            504
        ],
        allowed_methods=[
            "GET"
        ]
    )

    adapter = HTTPAdapter(
        max_retries=retry_strategy
    )

    session = requests.Session()

    session.mount(
        "https://",
        adapter
    )

    return session


def build_fallback_weather_data(
    latitude,
    longitude,
    start_date,
    analysis_date,
    error
):
    return {
        "status": "weather_fallback_used",
        "source": "Configured fallback weather values",
        "latitude": float(latitude),
        "longitude": float(longitude),
        "start_date": start_date.isoformat(),
        "end_date": analysis_date.isoformat(),
        "period_days": 8,
        "rainfall_mm_8day": float(
            WEATHER_FALLBACK_DATA[
                "rainfall_mm_8day"
            ]
        ),
        "reference_et_mm_8day": float(
            WEATHER_FALLBACK_DATA[
                "reference_et_mm_8day"
            ]
        ),
        "weather_observation_count": 0,
        "live_weather_available": False,
        "fallback_reason": type(error).__name__
    }


def fetch_weather_data(
    latitude,
    longitude,
    analysis_date
):
    if isinstance(analysis_date, str):
        analysis_date = date.fromisoformat(
            analysis_date
        )

    start_date = (
        analysis_date
        - timedelta(days=7)
    )

    parameters = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": start_date.isoformat(),
        "end_date": analysis_date.isoformat(),
        "daily": (
            "precipitation_sum,"
            "et0_fao_evapotranspiration"
        ),
        "timezone": "auto"
    }

    session = create_weather_session()

    try:
        response = session.get(
            OPEN_METEO_ARCHIVE_URL,
            params=parameters,
            timeout=20
        )

        response.raise_for_status()

        weather_data = response.json()

        daily_data = weather_data["daily"]

        precipitation_values = [
            value
            for value in daily_data[
                "precipitation_sum"
            ]
            if value is not None
        ]

        et0_values = [
            value
            for value in daily_data[
                "et0_fao_evapotranspiration"
            ]
            if value is not None
        ]

        rainfall_mm_8day = sum(
            precipitation_values
        )

        reference_et_mm_8day = sum(
            et0_values
        )

        return {
            "status": "weather_data_retrieved",
            "source": (
                "Open-Meteo Historical Weather API"
            ),
            "latitude": float(latitude),
            "longitude": float(longitude),
            "start_date": start_date.isoformat(),
            "end_date": analysis_date.isoformat(),
            "period_days": 8,
            "rainfall_mm_8day": float(
                rainfall_mm_8day
            ),
            "reference_et_mm_8day": float(
                reference_et_mm_8day
            ),
            "weather_observation_count": len(
                daily_data["time"]
            ),
            "live_weather_available": True
        }

    except (
        requests.RequestException,
        KeyError,
        TypeError,
        ValueError
    ) as error:
        return build_fallback_weather_data(
            latitude=latitude,
            longitude=longitude,
            start_date=start_date,
            analysis_date=analysis_date,
            error=error
        )