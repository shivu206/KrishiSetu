MINIMUM_OBSERVATIONS = 3
VEGETATION_NDVI_THRESHOLD = 0.30
STRONG_VEGETATION_NDVI_THRESHOLD = 0.40
MINIMUM_VEGETATED_FRACTION = 0.50


def detect_vegetation_signature(
    observations
):
    observation_count = len(observations)

    if observation_count < MINIMUM_OBSERVATIONS:
        return {
            "vegetation_detected": False,
            "status": "insufficient_observations",
            "observation_count": observation_count,
            "vegetated_observation_count": 0,
            "vegetated_fraction": 0.0,
            "peak_ndvi": None,
            "mean_ndvi": None
        }

    ndvi_values = [
        observation["ndvi_mean"]
        for observation in observations
        if observation.get("ndvi_mean") is not None
    ]

    if len(ndvi_values) < MINIMUM_OBSERVATIONS:
        return {
            "vegetation_detected": False,
            "status": "insufficient_ndvi_observations",
            "observation_count": observation_count,
            "vegetated_observation_count": 0,
            "vegetated_fraction": 0.0,
            "peak_ndvi": None,
            "mean_ndvi": None
        }

    vegetated_observation_count = sum(
        ndvi >= VEGETATION_NDVI_THRESHOLD
        for ndvi in ndvi_values
    )

    vegetated_fraction = (
        vegetated_observation_count
        / len(ndvi_values)
    )

    peak_ndvi = max(ndvi_values)

    mean_ndvi = (
        sum(ndvi_values)
        / len(ndvi_values)
    )

    vegetation_detected = (
        vegetated_fraction
        >= MINIMUM_VEGETATED_FRACTION
        and peak_ndvi
        >= STRONG_VEGETATION_NDVI_THRESHOLD
    )

    return {
        "vegetation_detected": vegetation_detected,
        "status": (
            "vegetation_signature_detected"
            if vegetation_detected
            else "no_meaningful_vegetation_signature"
        ),
        "observation_count": observation_count,
        "vegetated_observation_count": (
            vegetated_observation_count
        ),
        "vegetated_fraction": vegetated_fraction,
        "peak_ndvi": peak_ndvi,
        "mean_ndvi": mean_ndvi
    }