import json

from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, precision_recall_fscore_support
from sklearn.model_selection import GroupShuffleSplit
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from risk import (
    ARTIFACT_DIR, FEATURE_NAMES, HORIZON_DAYS, MODEL_VERSION, Assessment,
    model_probability,
)
from synthetic import ASSESSMENTS_PER_PROJECT, PROJECT_COUNT, SEED, Sample, generate_samples


def split_samples(samples: list[Sample]) -> tuple[list[Sample], list[Sample]]:
    groups = [sample.project_id for sample in samples]
    splitter = GroupShuffleSplit(n_splits=1, test_size=0.25, random_state=SEED)
    train_indices, test_indices = next(splitter.split(samples, groups=groups))
    return [samples[index] for index in train_indices], [
        samples[index] for index in test_indices
    ]


def describe(samples: list[Sample]) -> dict:
    return {
        "projects": len({sample.project_id for sample in samples}),
        "samples": len(samples),
        "positiveRate": sum(sample.label for sample in samples) / len(samples),
    }


def metrics(labels: list[int], predictions) -> dict:
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, predictions, labels=[1], average="binary", zero_division=0,
    )
    return {
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1),
        "confusionMatrix": confusion_matrix(labels, predictions, labels=[0, 1]).tolist(),
    }


def write_json(name: str, payload: dict) -> None:
    (ARTIFACT_DIR / name).write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def train() -> dict:
    samples, skipped = generate_samples()
    train_samples, test_samples = split_samples(samples)
    x_train = [sample.features for sample in train_samples]
    y_train = [sample.label for sample in train_samples]
    x_test = [sample.features for sample in test_samples]
    y_test = [sample.label for sample in test_samples]
    model = make_pipeline(StandardScaler(), LogisticRegression(random_state=SEED))
    model.fit(x_train, y_train)
    baseline = DummyClassifier(strategy="most_frequent").fit(x_train, y_train)

    # Fold scaling into weights so FastAPI reads a plain JSON logistic model.
    scaler = model.named_steps["standardscaler"]
    classifier = model.named_steps["logisticregression"]
    coefficients = tuple((classifier.coef_[0] / scaler.scale_).tolist())
    intercept = float(classifier.intercept_[0] - scaler.mean_ @ coefficients)
    expected = model.predict_proba(x_test)[:, 1]
    if any(
        abs(model_probability(row, intercept, coefficients) - probability) > 1e-12
        for row, probability in zip(x_test, expected, strict=True)
    ):
        raise RuntimeError("Exported model probabilities differ from the trained pipeline.")

    report = {
        "syntheticOnly": True,
        "seed": SEED,
        "projectsGenerated": PROJECT_COUNT,
        "snapshotsGenerated": PROJECT_COUNT * ASSESSMENTS_PER_PROJECT,
        "snapshotsWithoutScorableTasks": skipped,
        "scorable": describe(samples),
        "train": describe(train_samples),
        "test": describe(test_samples),
        "confusionMatrixOrder": [["TN", "FP"], ["FN", "TP"]],
        "logisticRegression": metrics(y_test, model.predict(x_test)),
        "mostFrequentBaseline": {
            "predictedClass": int(baseline.classes_[baseline.class_prior_.argmax()]),
            **metrics(y_test, baseline.predict(x_test)),
        },
    }
    ARTIFACT_DIR.mkdir(exist_ok=True)
    write_json("model.json", {
        "modelVersion": MODEL_VERSION,
        "featureNames": FEATURE_NAMES,
        "intercept": intercept,
        "coefficients": coefficients,
    })
    write_json("input-schema.json", {
        "modelVersion": MODEL_VERSION,
        "horizonDays": HORIZON_DAYS,
        "featureNames": FEATURE_NAMES,
        "requestSchema": Assessment.model_json_schema(),
    })
    write_json("metrics.json", report)
    return report


if __name__ == "__main__":
    print(json.dumps(train(), indent=2))
