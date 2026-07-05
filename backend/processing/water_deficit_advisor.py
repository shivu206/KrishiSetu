STAGE_CROP_COEFFICIENTS = {
    "early_growth": 0.40,
    "vegetative": 0.75,
    "peak_growth": 1.10,
    "decline": 0.65
}


def estimate_water_deficit(
    growth_stage,
    stress_level,
    reference_et_mm_8day,
    rainfall_mm_8day
):
    crop_coefficient = (
        STAGE_CROP_COEFFICIENTS.get(
            growth_stage,
            0.75
        )
    )

    crop_water_demand_mm = (
        reference_et_mm_8day
        * crop_coefficient
    )

    effective_rainfall_mm = max(
        rainfall_mm_8day,
        0.0
    )

    water_deficit_mm = max(
        crop_water_demand_mm
        - effective_rainfall_mm,
        0.0
    )

    if water_deficit_mm >= 30:
        irrigation_status = (
            "irrigation_required"
        )

    elif water_deficit_mm >= 15:
        irrigation_status = (
            "irrigation_recommended"
        )

    elif water_deficit_mm >= 5:
        irrigation_status = "monitor"

    else:
        irrigation_status = (
            "no_irrigation_required"
        )

    if (
        stress_level == "high"
        and water_deficit_mm >= 15
    ):
        irrigation_priority = "urgent"

    elif (
        stress_level == "moderate"
        or water_deficit_mm >= 15
    ):
        irrigation_priority = "high"

    elif water_deficit_mm >= 5:
        irrigation_priority = "moderate"

    else:
        irrigation_priority = "low"

    return {
        "status": "water_deficit_estimated",
        "period_days": 8,
        "growth_stage": growth_stage,
        "stress_level": stress_level,
        "crop_coefficient": float(
            crop_coefficient
        ),
        "reference_et_mm_8day": float(
            reference_et_mm_8day
        ),
        "crop_water_demand_mm": float(
            crop_water_demand_mm
        ),
        "effective_rainfall_mm": float(
            effective_rainfall_mm
        ),
        "water_deficit_mm": float(
            water_deficit_mm
        ),
        "irrigation_status": (
            irrigation_status
        ),
        "irrigation_priority": (
            irrigation_priority
        )
    }