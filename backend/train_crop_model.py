from pathlib import Path

import joblib
import numpy as np

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    cohen_kappa_score,
    classification_report
)
from sklearn.model_selection import GroupShuffleSplit

from processing.agrifieldnet_loader import (
    load_training_tile
)


DATASET_DIRECTORY = (
    Path(__file__).resolve().parent
    / "datasets"
    / "agrifieldnet"
)

SOURCE_DIRECTORY = (
    DATASET_DIRECTORY
    / "source"
)

TRAIN_LABELS_DIRECTORY = (
    DATASET_DIRECTORY
    / "train_labels"
)

MODEL_DIRECTORY = (
    Path(__file__).resolve().parent
    / "models"
)

MODEL_PATH = (
    MODEL_DIRECTORY
    / "crop_classifier.joblib"
)


SOURCE_PREFIX = (
    "ref_agrifieldnet_competition_v1_source_"
)


def extract_tile_id(
    tile_directory
):
    return tile_directory.name.replace(
        SOURCE_PREFIX,
        ""
    )


def calculate_index(
    numerator,
    denominator
):
    result = np.zeros(
        numerator.shape,
        dtype=np.float32
    )

    valid_mask = denominator != 0

    result[valid_mask] = (
        numerator[valid_mask]
        / denominator[valid_mask]
    )

    return result


def build_tile_samples(
    tile_data
):
    bands = tile_data["bands"]

    red = bands["B04"].astype(
        np.float32
    )

    nir = bands["B08"].astype(
        np.float32
    )

    swir1 = bands["B11"].astype(
        np.float32
    )

    ndvi = calculate_index(
        nir - red,
        nir + red
    )

    ndmi = calculate_index(
        nir - swir1,
        nir + swir1
    )

    crop_labels = tile_data[
        "crop_labels"
    ]

    labelled_mask = crop_labels != 0

    features = np.column_stack([
        ndvi[labelled_mask],
        ndmi[labelled_mask]
    ])

    labels = crop_labels[
        labelled_mask
    ].astype(
        np.int32
    )

    return features, labels


def load_training_dataset():
    all_features = []
    all_labels = []
    all_groups = []

    tile_directories = sorted(
        directory
        for directory in SOURCE_DIRECTORY.iterdir()
        if directory.is_dir()
    )

    processed_tiles = 0

    for tile_directory in tile_directories:
        tile_id = extract_tile_id(
            tile_directory
        )

        try:
            tile_data = load_training_tile(
                SOURCE_DIRECTORY,
                TRAIN_LABELS_DIRECTORY,
                tile_id
            )

        except FileNotFoundError:
            continue

        features, labels = build_tile_samples(
            tile_data
        )

        if len(labels) == 0:
            continue

        all_features.append(
            features
        )

        all_labels.append(
            labels
        )

        all_groups.append(
            np.full(
                len(labels),
                tile_id,
                dtype=object
            )
        )

        processed_tiles += 1

        if processed_tiles % 100 == 0:
            print(
                "Processed tiles:",
                processed_tiles
            )

    features = np.vstack(
        all_features
    )

    labels = np.concatenate(
        all_labels
    )

    groups = np.concatenate(
        all_groups
    )

    return features, labels, groups


def train_crop_classifier():
    print(
        "Building AgriFieldNet training dataset..."
    )

    features, labels, groups = (
        load_training_dataset()
    )

    print(
        "Total labelled pixels:",
        len(labels)
    )

    print(
        "Feature count:",
        features.shape[1]
    )

    print(
        "Crop classes:",
        np.unique(labels).tolist()
    )

    splitter = GroupShuffleSplit(
        n_splits=1,
        test_size=0.20,
        random_state=42
    )

    train_indices, test_indices = next(
        splitter.split(
            features,
            labels,
            groups=groups
        )
    )

    x_train = features[
        train_indices
    ]

    x_test = features[
        test_indices
    ]

    y_train = labels[
        train_indices
    ]

    y_test = labels[
        test_indices
    ]

    print(
        "Training samples:",
        len(y_train)
    )

    print(
        "Testing samples:",
        len(y_test)
    )

    model = RandomForestClassifier(
        n_estimators=200,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )

    print(
        "Training Random Forest..."
    )

    model.fit(
        x_train,
        y_train
    )

    predictions = model.predict(
        x_test
    )

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    kappa = cohen_kappa_score(
        y_test,
        predictions
    )

    print(
        "Accuracy:",
        accuracy
    )

    print(
        "Cohen Kappa:",
        kappa
    )

    print(
        classification_report(
            y_test,
            predictions,
            zero_division=0
        )
    )

    MODEL_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True
    )

    model_package = {
        "model": model,
        "feature_names": [
            "NDVI",
            "NDMI"
        ]
    }

    joblib.dump(
        model_package,
        MODEL_PATH
    )

    print(
        "Model saved to:",
        MODEL_PATH
    )


if __name__ == "__main__":
    train_crop_classifier()