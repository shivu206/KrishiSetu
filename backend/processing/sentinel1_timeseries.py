from datetime import date
from pathlib import Path

from processing.sentinel1_processor import (
    process_sentinel1_bands,
    summarize_sentinel1_analysis
)


def find_single_file(
    directory,
    layer_name
):
    layer_pattern = (
        f"_{layer_name}_-_linear_gamma0"
    ).lower()

    matching_files = [
        file_path
        for file_path in directory.glob("*.tiff")
        if layer_pattern in file_path.name.lower()
    ]

    if len(matching_files) != 1:
        raise ValueError(
            f"Expected exactly one {layer_name} "
            f"linear gamma0 file in {directory}. "
            f"Found {len(matching_files)}."
        )

    return matching_files[0]


def parse_folder_date(folder_name):
    try:
        return date.fromisoformat(folder_name)

    except ValueError:
        return None


def process_sentinel1_timeseries(
    sentinel1_directory,
    start_date=None,
    end_date=None
):
    sentinel1_directory = Path(
        sentinel1_directory
    )

    observations = []

    for date_directory in sentinel1_directory.iterdir():
        if not date_directory.is_dir():
            continue

        observation_date = parse_folder_date(
            date_directory.name
        )

        if observation_date is None:
            continue

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

        try:
            vv_band_path = find_single_file(
                date_directory,
                "VV"
            )

            vh_band_path = find_single_file(
                date_directory,
                "VH"
            )

            result = process_sentinel1_bands(
                vv_band_path,
                vh_band_path
            )

            summary = summarize_sentinel1_analysis(
                result
            )

            observations.append({
                "date": observation_date.isoformat(),
                **summary
            })

        except ValueError as error:
            print(
                f"Skipping {date_directory.name}: "
                f"{error}"
            )

    observations.sort(
        key=lambda observation: observation["date"]
    )

    return observations