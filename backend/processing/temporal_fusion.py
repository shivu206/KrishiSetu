from datetime import date


DEFAULT_MAX_RADAR_AGE_DAYS = 12


def parse_observation_date(
    observation
):
    return date.fromisoformat(
        observation["date"]
    )


def find_latest_radar_observation(
    sentinel1_observations,
    optical_date,
    max_radar_age_days
):
    latest_observation = None
    latest_observation_date = None

    for observation in sentinel1_observations:
        observation_date = parse_observation_date(
            observation
        )

        if observation_date > optical_date:
            break

        radar_age_days = (
            optical_date - observation_date
        ).days

        if radar_age_days <= max_radar_age_days:
            latest_observation = observation
            latest_observation_date = observation_date

    return (
        latest_observation,
        latest_observation_date
    )


def create_fused_observation(
    sentinel2_observation,
    sentinel1_observation,
    sentinel1_date
):
    optical_date = parse_observation_date(
        sentinel2_observation
    )

    fused_observation = {
        "date": sentinel2_observation["date"],
        "ndvi_mean": sentinel2_observation["ndvi_mean"],
        "ndvi_min": sentinel2_observation["ndvi_min"],
        "ndvi_max": sentinel2_observation["ndvi_max"],
        "ndmi_mean": sentinel2_observation["ndmi_mean"],
        "ndmi_min": sentinel2_observation["ndmi_min"],
        "ndmi_max": sentinel2_observation["ndmi_max"],
        "sentinel2_valid_pixels": (
            sentinel2_observation["valid_pixels"]
        )
    }

    if sentinel1_observation is None:
        fused_observation.update({
            "sentinel1_date": None,
            "radar_age_days": None,
            "vv_db_mean": None,
            "vv_db_min": None,
            "vv_db_max": None,
            "vh_db_mean": None,
            "vh_db_min": None,
            "vh_db_max": None,
            "vh_vv_ratio_mean": None,
            "sentinel1_valid_pixels": None,
            "radar_available": False
        })

        return fused_observation

    radar_age_days = (
        optical_date - sentinel1_date
    ).days

    fused_observation.update({
        "sentinel1_date": sentinel1_observation["date"],
        "radar_age_days": radar_age_days,
        "vv_db_mean": sentinel1_observation["vv_db_mean"],
        "vv_db_min": sentinel1_observation["vv_db_min"],
        "vv_db_max": sentinel1_observation["vv_db_max"],
        "vh_db_mean": sentinel1_observation["vh_db_mean"],
        "vh_db_min": sentinel1_observation["vh_db_min"],
        "vh_db_max": sentinel1_observation["vh_db_max"],
        "vh_vv_ratio_mean": (
            sentinel1_observation["vh_vv_ratio_mean"]
        ),
        "sentinel1_valid_pixels": (
            sentinel1_observation["valid_pixels"]
        ),
        "radar_available": True
    })

    return fused_observation


def fuse_satellite_timeseries(
    sentinel2_observations,
    sentinel1_observations,
    max_radar_age_days=DEFAULT_MAX_RADAR_AGE_DAYS
):
    sentinel1_observations = sorted(
        sentinel1_observations,
        key=parse_observation_date
    )

    fused_observations = []

    for sentinel2_observation in sentinel2_observations:
        optical_date = parse_observation_date(
            sentinel2_observation
        )

        (
            sentinel1_observation,
            sentinel1_date
        ) = find_latest_radar_observation(
            sentinel1_observations,
            optical_date,
            max_radar_age_days
        )

        fused_observation = create_fused_observation(
            sentinel2_observation,
            sentinel1_observation,
            sentinel1_date
        )

        fused_observations.append(
            fused_observation
        )

    return fused_observations