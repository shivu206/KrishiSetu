import numpy as np
import rasterio

from rasterio.enums import Resampling
from rasterio.warp import reproject


def read_raster_band(file_path):
    with rasterio.open(file_path) as raster:
        band = raster.read(1).astype(np.float32)
        profile = raster.profile

    return band, profile


def calculate_ndvi(red_band, nir_band):
    denominator = nir_band + red_band

    ndvi = np.divide(
        nir_band - red_band,
        denominator,
        out=np.full_like(
            nir_band,
            np.nan,
            dtype=np.float32
        ),
        where=denominator != 0
    )

    return np.clip(ndvi, -1, 1)


def calculate_ndmi(nir_band, swir_band):
    denominator = nir_band + swir_band

    ndmi = np.divide(
        nir_band - swir_band,
        denominator,
        out=np.full_like(
            nir_band,
            np.nan,
            dtype=np.float32
        ),
        where=denominator != 0
    )

    return np.clip(ndmi, -1, 1)


def resample_band_to_reference(
    source_band_path,
    reference_band_path
):
    with rasterio.open(reference_band_path) as reference:
        reference_shape = (
            reference.height,
            reference.width
        )

        reference_transform = reference.transform
        reference_crs = reference.crs

    with rasterio.open(source_band_path) as source:
        resampled_band = np.empty(
            reference_shape,
            dtype=np.float32
        )

        reproject(
            source=rasterio.band(source, 1),
            destination=resampled_band,
            src_transform=source.transform,
            src_crs=source.crs,
            dst_transform=reference_transform,
            dst_crs=reference_crs,
            resampling=Resampling.bilinear
        )

    return resampled_band

def resample_classification_to_reference(
    source_band_path,
    reference_band_path
):
    with rasterio.open(reference_band_path) as reference:
        reference_shape = (
            reference.height,
            reference.width
        )

        reference_transform = reference.transform
        reference_crs = reference.crs

    with rasterio.open(source_band_path) as source:
        resampled_band = np.empty(
            reference_shape,
            dtype=np.float32
        )

        reproject(
            source=rasterio.band(source, 1),
            destination=resampled_band,
            src_transform=source.transform,
            src_crs=source.crs,
            dst_transform=reference_transform,
            dst_crs=reference_crs,
            resampling=Resampling.nearest
        )

    return resampled_band


def process_sentinel2_bands(
    red_band_path,
    nir_band_path,
    swir_band_path,
    scl_band_path
):
    red_band, profile = read_raster_band(
        red_band_path
    )

    nir_band, _ = read_raster_band(
        nir_band_path
    )

    swir_band = resample_band_to_reference(
        swir_band_path,
        nir_band_path
    )

    scl_band = resample_classification_to_reference(
    scl_band_path,
    nir_band_path
    )

    invalid_scl_classes = [
    0,   # No data
    1,   # Saturated / defective
    3,   # Cloud shadow
    8,   # Medium probability cloud
    9,   # High probability cloud
    10   # Thin cirrus
]

    spectral_valid_mask = (
    (red_band > 0)
    & (nir_band > 0)
    & (swir_band > 0)
    )

    scl_valid_mask = ~np.isin(
    scl_band,
    invalid_scl_classes
    )

    valid_mask = (
    spectral_valid_mask
    & scl_valid_mask
    )

    ndvi = calculate_ndvi(
        red_band,
        nir_band
    )

    ndmi = calculate_ndmi(
        nir_band,
        swir_band
    )

    ndvi[~valid_mask] = np.nan
    ndmi[~valid_mask] = np.nan

    return {
    "ndvi": ndvi,
    "ndmi": ndmi,
    "scl": scl_band,
    "valid_mask": valid_mask,
    "profile": profile
    }

def summarize_sentinel2_analysis(result):
    ndvi = result["ndvi"]
    ndmi = result["ndmi"]
    valid_mask = result["valid_mask"]

    return {
        "ndvi_mean": float(np.nanmean(ndvi)),
        "ndvi_min": float(np.nanmin(ndvi)),
        "ndvi_max": float(np.nanmax(ndvi)),
        "ndmi_mean": float(np.nanmean(ndmi)),
        "ndmi_min": float(np.nanmin(ndmi)),
        "ndmi_max": float(np.nanmax(ndmi)),
        "valid_pixels": int(np.count_nonzero(valid_mask))
    }