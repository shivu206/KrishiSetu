import numpy as np
import rasterio


def read_sar_band(file_path):
    with rasterio.open(file_path) as dataset:
        band = dataset.read(1).astype(np.float32)
        profile = dataset.profile

    return band, profile


def linear_to_db(linear_band):
    db_band = np.full_like(
        linear_band,
        np.nan,
        dtype=np.float32
    )

    valid_mask = linear_band > 0

    db_band[valid_mask] = (
        10 * np.log10(linear_band[valid_mask])
    )

    return db_band


def process_sentinel1_bands(
    vv_band_path,
    vh_band_path
):
    vv_linear, profile = read_sar_band(
        vv_band_path
    )

    vh_linear, _ = read_sar_band(
        vh_band_path
    )

    valid_mask = (
        np.isfinite(vv_linear)
        & np.isfinite(vh_linear)
        & (vv_linear > 0)
        & (vh_linear > 0)
    )

    vv_db = linear_to_db(vv_linear)
    vh_db = linear_to_db(vh_linear)

    vv_db[~valid_mask] = np.nan
    vh_db[~valid_mask] = np.nan

    vh_vv_ratio = np.full_like(
        vv_linear,
        np.nan,
        dtype=np.float32
    )

    np.divide(
        vh_linear,
        vv_linear,
        out=vh_vv_ratio,
        where=valid_mask
    )

    return {
        "vv_linear": vv_linear,
        "vh_linear": vh_linear,
        "vv_db": vv_db,
        "vh_db": vh_db,
        "vh_vv_ratio": vh_vv_ratio,
        "valid_mask": valid_mask,
        "profile": profile
    }


def summarize_sentinel1_analysis(result):
    valid_mask = result["valid_mask"]

    vv_db = result["vv_db"]
    vh_db = result["vh_db"]
    vh_vv_ratio = result["vh_vv_ratio"]

    return {
        "vv_db_mean": float(
            np.nanmean(vv_db)
        ),
        "vv_db_min": float(
            np.nanmin(vv_db)
        ),
        "vv_db_max": float(
            np.nanmax(vv_db)
        ),
        "vh_db_mean": float(
            np.nanmean(vh_db)
        ),
        "vh_db_min": float(
            np.nanmin(vh_db)
        ),
        "vh_db_max": float(
            np.nanmax(vh_db)
        ),
        "vh_vv_ratio_mean": float(
            np.nanmean(vh_vv_ratio)
        ),
        "valid_pixels": int(
            np.sum(valid_mask)
        )
    }