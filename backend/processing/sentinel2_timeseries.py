from datetime import datetime
from pathlib import Path

import numpy as np

from processing.sentinel2_processor import (
    process_sentinel2_bands
)


def find_band_file(
    observation_folder,
    band_name
):
    matching_files = list(
        observation_folder.glob(
            f"*_{band_name}_*.tiff"
        )
    )

    if not matching_files:
        matching_files = list(
            observation_folder.glob(
                f"*{band_name}*.tiff"
            )
        )

    if len(matching_files) != 1:
        raise ValueError(
            f"Expected exactly one {band_name} file in "
            f"{observation_folder}. "
            f"Found {len(matching_files)}."
        )

    return matching_files[0]


def process_observation(
    observation_folder
):
    observation_date = datetime.strptime(
        observation_folder.name,
        "%Y-%m-%d"
    ).date()

    red_band_path = find_band_file(
        observation_folder,
        "B04"
    )

    nir_band_path = find_band_file(
        observation_folder,
        "B08"
    )

    swir_band_path = find_band_file(
        observation_folder,
        "B11"
    )

    scl_band_path = find_band_file(
        observation_folder,
        "custom"
    )

    result = process_sentinel2_bands(
    red_band_path,
    nir_band_path,
    swir_band_path,
    scl_band_path
    )

    ndvi = result["ndvi"]
    ndmi = result["ndmi"]
    valid_mask = result["valid_mask"]

    return {
        "date": observation_date.isoformat(),
        "ndvi_mean": float(
            np.nanmean(ndvi)
        ),
        "ndvi_min": float(
            np.nanmin(ndvi)
        ),
        "ndvi_max": float(
            np.nanmax(ndvi)
        ),
        "ndmi_mean": float(
            np.nanmean(ndmi)
        ),
        "ndmi_min": float(
            np.nanmin(ndmi)
        ),
        "ndmi_max": float(
            np.nanmax(ndmi)
        ),
        "valid_pixels": int(
            np.sum(valid_mask)
        )
    }


def process_sentinel2_timeseries(
    sentinel2_directory,
    start_date=None,
    end_date=None
):
    sentinel2_directory = Path(
        sentinel2_directory
    )

    observations = []

    for observation_folder in sentinel2_directory.iterdir():
        if not observation_folder.is_dir():
            continue

        try:
            observation = process_observation(
                observation_folder
            )

            observation_date = datetime.fromisoformat(
                observation["date"]
            ).date()

            if (
                start_date is not None
                and observation_date < start_date
            ):
                continue

            if (
                end_date is not None
                and observation_date > end_date
            ):
                continue

            observations.append(
                observation
            )

        except ValueError as error:
            print(
                f"Skipping {observation_folder.name}: "
                f"{error}"
            )

    observations.sort(
        key=lambda observation: datetime.fromisoformat(
            observation["date"]
        )
    )

    return observations