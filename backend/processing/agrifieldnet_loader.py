from pathlib import Path

import numpy as np
import rasterio


SOURCE_PREFIX = (
    "ref_agrifieldnet_competition_v1_source"
)

TRAIN_LABEL_PREFIX = (
    "ref_agrifieldnet_competition_v1_labels_train"
)


def find_source_band(
    source_directory,
    tile_id,
    band_name
):
    source_directory = Path(source_directory)

    tile_directory = (
        source_directory
        / f"{SOURCE_PREFIX}_{tile_id}"
    )

    band_path = (
        tile_directory
        / (
            f"{SOURCE_PREFIX}_{tile_id}_"
            f"{band_name}_10m.tif"
        )
    )

    if not band_path.exists():
        raise FileNotFoundError(
            f"Missing {band_name} band for "
            f"tile {tile_id}: {band_path}"
        )

    return band_path


def find_training_label_files(
    train_labels_directory,
    tile_id
):
    train_labels_directory = Path(
        train_labels_directory
    )

    crop_label_path = (
        train_labels_directory
        / (
            f"{TRAIN_LABEL_PREFIX}_"
            f"{tile_id}.tif"
        )
    )

    field_ids_path = (
        train_labels_directory
        / (
            f"{TRAIN_LABEL_PREFIX}_"
            f"{tile_id}_field_ids.tif"
        )
    )

    if not crop_label_path.exists():
        raise FileNotFoundError(
            f"Missing crop-label raster for "
            f"tile {tile_id}."
        )

    if not field_ids_path.exists():
        raise FileNotFoundError(
            f"Missing field-ID raster for "
            f"tile {tile_id}."
        )

    return crop_label_path, field_ids_path


def read_raster(
    raster_path
):
    with rasterio.open(raster_path) as dataset:
        return dataset.read(1)


def load_training_tile(
    source_directory,
    train_labels_directory,
    tile_id
):
    band_names = [
        "B02",
        "B03",
        "B04",
        "B08",
        "B11",
        "B12"
    ]

    bands = {}

    for band_name in band_names:
        band_path = find_source_band(
            source_directory,
            tile_id,
            band_name
        )

        bands[band_name] = read_raster(
            band_path
        )

    (
        crop_label_path,
        field_ids_path
    ) = find_training_label_files(
        train_labels_directory,
        tile_id
    )

    crop_labels = read_raster(
        crop_label_path
    )

    field_ids = read_raster(
        field_ids_path
    )

    expected_shape = crop_labels.shape

    for band_name, band_data in bands.items():
        if band_data.shape != expected_shape:
            raise ValueError(
                f"{band_name} shape "
                f"{band_data.shape} does not match "
                f"label shape {expected_shape}."
            )

    if field_ids.shape != expected_shape:
        raise ValueError(
            "Field-ID raster shape does not match "
            "crop-label raster shape."
        )

    return {
        "tile_id": tile_id,
        "bands": bands,
        "crop_labels": crop_labels,
        "field_ids": field_ids
    }


def summarize_training_tile(
    tile_data
):
    crop_labels = tile_data["crop_labels"]
    field_ids = tile_data["field_ids"]

    unique_crop_labels = np.unique(
        crop_labels
    )

    unique_field_ids = np.unique(
        field_ids
    )

    nonzero_crop_labels = (
        unique_crop_labels[
            unique_crop_labels != 0
        ]
    )

    nonzero_field_ids = (
        unique_field_ids[
            unique_field_ids != 0
        ]
    )

    return {
        "tile_id": tile_data["tile_id"],
        "shape": crop_labels.shape,
        "crop_labels": (
            nonzero_crop_labels.tolist()
        ),
        "field_count": len(
            nonzero_field_ids
        ),
        "labelled_pixel_count": int(
            np.sum(crop_labels != 0)
        )
    }