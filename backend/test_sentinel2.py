from pathlib import Path

import numpy as np
import rasterio

from processing.sentinel2_processor import (
    process_sentinel2_bands,
    summarize_sentinel2_analysis
)


SATELLITE_DATA_DIR = Path("satellite_data")


def find_band_file(band_name):
    matching_files = list(
        SATELLITE_DATA_DIR.glob(f"*_{band_name}_*(Raw).tiff")
    )

    if not matching_files:
        raise FileNotFoundError(
            f"{band_name} TIFF file was not found"
        )

    return matching_files[0]


red_band_path = find_band_file("B04")
nir_band_path = find_band_file("B08")
swir_band_path = find_band_file("B11")


print("B04:", red_band_path)
print("B08:", nir_band_path)
print("B11:", swir_band_path)


result = process_sentinel2_bands(
    red_band_path,
    nir_band_path,
    swir_band_path
)
summary = summarize_sentinel2_analysis(result)

print("\n--- SENTINEL-2 SUMMARY ---")
print(summary)


ndvi = result["ndvi"]
ndmi = result["ndmi"]


print("\n--- SENTINEL-2 ANALYSIS ---")

print("\nNDVI")
print("Mean:", float(np.nanmean(ndvi)))
print("Min:", float(np.nanmin(ndvi)))
print("Max:", float(np.nanmax(ndvi)))

print("\nNDMI")
print("Mean:", float(np.nanmean(ndmi)))
print("Min:", float(np.nanmin(ndmi)))
print("Max:", float(np.nanmax(ndmi)))

print("\nRaster Shape:", ndvi.shape)


print("\n--- RASTER VALIDITY CHECK ---")

for band_name, band_path in [
    ("B04", red_band_path),
    ("B08", nir_band_path),
    ("B11", swir_band_path),
]:
    with rasterio.open(band_path) as dataset:
        band = dataset.read(1)
        mask = dataset.read_masks(1)

        total_pixels = band.size
        valid_pixels = np.count_nonzero(mask)
        invalid_pixels = total_pixels - valid_pixels

        print(f"\n{band_name}")
        print("NoData value:", dataset.nodata)
        print("Total pixels:", total_pixels)
        print("Valid pixels:", valid_pixels)
        print("Invalid pixels:", invalid_pixels)
        print("Band min:", float(np.nanmin(band)))
        print("Band max:", float(np.nanmax(band)))

        print("\n--- ZERO VALUE CHECK ---")

for band_name, band_path in [
    ("B04", red_band_path),
    ("B08", nir_band_path),
    ("B11", swir_band_path),
]:
    with rasterio.open(band_path) as dataset:
        band = dataset.read(1)

        zero_pixels = np.count_nonzero(band == 0)
        total_pixels = band.size

        print(f"\n{band_name}")
        print("Zero pixels:", zero_pixels)
        print(
            "Zero percentage:",
            (zero_pixels / total_pixels) * 100
        )


print("\n--- EXTREME INDEX CHECK ---")

print(
    "NDVI pixels equal to -1:",
    np.count_nonzero(ndvi == -1)
)

print(
    "NDMI pixels equal to -1:",
    np.count_nonzero(ndmi == -1)
)

print(
    "NDVI pixels equal to 0:",
    np.count_nonzero(ndvi == 0)
)

print(
    "NDMI pixels equal to 0:",
    np.count_nonzero(ndmi == 0)
)