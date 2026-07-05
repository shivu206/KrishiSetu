from pathlib import Path

from processing.sentinel2_timeseries import (
    process_sentinel2_timeseries
)


BASE_DIR = Path(__file__).resolve().parent

SENTINEL2_DIRECTORY = (
    BASE_DIR
    / "satellite_data"
    / "sentinel2"
)


observations = process_sentinel2_timeseries(
    SENTINEL2_DIRECTORY
)


print("\n--- SENTINEL-2 TIME SERIES ---\n")

for observation in observations:
    print(
        observation["date"],
        "| NDVI:",
        round(observation["ndvi_mean"], 4),
        "| NDMI:",
        round(observation["ndmi_mean"], 4),
        "| Valid Pixels:",
        observation["valid_pixels"]
    )


print(
    "\nTotal observations:",
    len(observations)
)