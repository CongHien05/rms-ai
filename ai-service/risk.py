import json
from datetime import date
from functools import lru_cache
from math import exp, isfinite
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

HORIZON_DAYS = 7
MODEL_VERSION = "synthetic-logreg-v1"
ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"
FEATURE_NAMES = (
    "eligible_task_count",
    "blocked_task_count",
    "todo_task_count",
    "due_within_two_days_count",
    "mean_days_to_due",
)
Status = Literal["TODO", "IN_PROGRESS", "BLOCKED", "DONE"]


class TaskSnapshot(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: Status
    dueDate: date | None = None


class Assessment(BaseModel):
    """Complete roster of tasks known at end of assessmentDate."""

    model_config = ConfigDict(extra="forbid")

    projectId: str = Field(min_length=1)
    assessmentDate: date
    tasks: list[TaskSnapshot]


class Prediction(BaseModel):
    projectId: str
    status: Literal["scored", "missing_deadlines", "no_tasks_due_in_window"]
    probability: float | None = None
    modelVersion: str | None = None
    eligibleTaskCount: int
    openTasksMissingDeadline: int


def is_eligible(task: TaskSnapshot, assessed_on: date) -> bool:
    return (
        task.status != "DONE"
        and task.dueDate is not None
        and 1 <= (task.dueDate - assessed_on).days <= HORIZON_DAYS
    )


def features_for(assessment: Assessment) -> tuple[list[float] | None, int, int]:
    missing = sum(
        task.status != "DONE" and task.dueDate is None for task in assessment.tasks
    )
    eligible = [
        task for task in assessment.tasks if is_eligible(task, assessment.assessmentDate)
    ]
    if missing or not eligible:
        return None, len(eligible), missing

    days = [
        (task.dueDate - assessment.assessmentDate).days
        for task in eligible
        if task.dueDate is not None
    ]
    return [
        len(eligible),
        sum(task.status == "BLOCKED" for task in eligible),
        sum(task.status == "TODO" for task in eligible),
        sum(day <= 2 for day in days),
        sum(days) / len(days),
    ], len(eligible), missing


@lru_cache(maxsize=1)
def load_model() -> tuple[float, tuple[float, ...]]:
    artifact = json.loads((ARTIFACT_DIR / "model.json").read_text(encoding="utf-8"))
    if (
        artifact["modelVersion"] != MODEL_VERSION
        or tuple(artifact["featureNames"]) != FEATURE_NAMES
    ):
        raise ValueError("Model artifact and inference contract differ.")
    intercept = float(artifact["intercept"])
    weights = tuple(map(float, artifact["coefficients"]))
    if len(weights) != len(FEATURE_NAMES) or not all(map(isfinite, (intercept, *weights))):
        raise ValueError("Invalid model weights.")
    return intercept, weights


def model_probability(features: list[float], intercept: float, weights: tuple[float, ...]) -> float:
    logit = intercept + sum(value * weight for value, weight in zip(features, weights, strict=True))
    if logit >= 0:
        return 1 / (1 + exp(-logit))
    odds = exp(logit)
    return odds / (1 + odds)


def predict(assessment: Assessment) -> Prediction:
    features, eligible, missing = features_for(assessment)
    result = {
        "projectId": assessment.projectId,
        "eligibleTaskCount": eligible,
        "openTasksMissingDeadline": missing,
    }
    if missing:
        return Prediction(status="missing_deadlines", **result)
    if features is None:
        return Prediction(status="no_tasks_due_in_window", **result)
    intercept, weights = load_model()
    return Prediction(
        status="scored",
        probability=model_probability(features, intercept, weights),
        modelVersion=MODEL_VERSION,
        **result,
    )
