from pathlib import Path

from processing.sentinel1_timeseries import (
    process_sentinel1_timeseries
)


SENTINEL1_DIRECTORY = (
    Path(__file__).resolve().parent
    / "satellite_data"
    / "sentinel1"
)


observations = process_sentinel1_timeseries(
    SENTINEL1_DIRECTORY
)


print("\n--- SENTINEL-1 TIME SERIES ---\n")

for observation in observations:
    print(
        f"{observation['date']} | "
        f"VV dB: {observation['vv_db_mean']:.4f} | "
        f"VH dB: {observation['vh_db_mean']:.4f} | "
        f"VH/VV: "
        f"{observation['vh_vv_ratio_mean']:.4f} | "
        f"Valid Pixels: "
        f"{observation['valid_pixels']}"
    )


print(
    f"\nTotal observations: "
    f"{len(observations)}"
)