import json
import unittest
from datetime import date, timedelta
from unittest.mock import patch

from fastapi import HTTPException
from pydantic import ValidationError

from main import predict_risk
from risk import (
    ARTIFACT_DIR, FEATURE_NAMES, MODEL_VERSION, Assessment, TaskSnapshot,
    features_for, predict,
)
from synthetic import TaskHistory, generate_samples, make_sample
from train import split_samples

D = date(2026, 11, 18)


def assessment(*tasks: TaskSnapshot) -> Assessment:
    return Assessment(projectId="demo", assessmentDate=D, tasks=list(tasks))


class RiskTest(unittest.TestCase):
    def test_only_open_tasks_due_between_d_plus_1_and_d_plus_7_inclusive(self):
        tasks = [
            TaskSnapshot(status="TODO", dueDate=D + timedelta(days=offset))
            for offset in (-1, 0, 1, 7, 8)
        ]
        tasks.append(TaskSnapshot(status="DONE", dueDate=D + timedelta(days=1)))
        features, eligible, missing = features_for(assessment(*tasks))
        self.assertEqual((features, eligible, missing), ([2, 0, 2, 1, 4], 2, 0))

    def test_missing_deadline_is_distinct_from_empty_window(self):
        missing = predict(assessment(TaskSnapshot(status="BLOCKED")))
        no_window = predict(assessment(
            TaskSnapshot(status="DONE"),
            TaskSnapshot(status="TODO", dueDate=D + timedelta(days=8)),
        ))
        self.assertEqual(missing.status, "missing_deadlines")
        self.assertEqual(missing.openTasksMissingDeadline, 1)
        self.assertEqual(no_window.status, "no_tasks_due_in_window")
        self.assertIsNone(missing.probability)
        self.assertIsNone(no_window.probability)

    def test_missing_open_deadline_prevents_scoring_even_with_eligible_task(self):
        result = predict(assessment(
            TaskSnapshot(status="BLOCKED"),
            TaskSnapshot(status="TODO", dueDate=D + timedelta(days=7)),
        ))
        self.assertEqual(result.status, "missing_deadlines")
        self.assertEqual(result.eligibleTaskCount, 1)

    def test_success_uses_saved_model_and_schema(self):
        result = predict(assessment(TaskSnapshot(status="BLOCKED", dueDate=D + timedelta(days=7))))
        self.assertEqual(result.status, "scored")
        self.assertEqual(result.modelVersion, MODEL_VERSION)
        self.assertTrue(0 < result.probability < 1)
        schema = json.loads((ARTIFACT_DIR / "input-schema.json").read_text(encoding="utf-8"))
        self.assertEqual(schema["featureNames"], list(FEATURE_NAMES))
        self.assertEqual(schema["requestSchema"], Assessment.model_json_schema())

    def test_artifact_unavailable_returns_service_error(self):
        with patch("risk.load_model", side_effect=FileNotFoundError):
            with self.assertRaises(HTTPException) as error:
                predict_risk(assessment(TaskSnapshot(status="TODO", dueDate=D + timedelta(days=1))))
        self.assertEqual(error.exception.status_code, 503)

    def test_snapshot_rejects_future_outcome_fields(self):
        with self.assertRaises(ValidationError):
            Assessment.model_validate({
                "projectId": "demo", "assessmentDate": D,
                "tasks": [{"status": "TODO", "statusAtDeadline": "DONE"}],
            })

    def test_label_reads_end_of_deadline_without_changing_features(self):
        due = D + timedelta(days=7)
        on_time = TaskHistory(due, ((D, "BLOCKED"), (due, "DONE")))
        late = TaskHistory(due, ((D, "BLOCKED"), (due + timedelta(days=1), "DONE")))
        a = make_sample("demo", D, [on_time])
        b = make_sample("demo", D, [late])
        self.assertEqual(a.features, b.features)
        self.assertEqual((a.label, b.label), (0, 1))

    def test_old_deadlines_and_tasks_created_after_d_do_not_affect_label(self):
        cases = [
            TaskHistory(D - timedelta(days=1), ((D - timedelta(days=2), "TODO"),)),
            TaskHistory(D, ((D, "BLOCKED"),)),
            TaskHistory(D + timedelta(days=8), ((D, "TODO"),)),
            TaskHistory(D + timedelta(days=6), ((D + timedelta(days=1), "BLOCKED"),)),
        ]
        self.assertIsNone(make_sample("demo", D, cases))
        due = D + timedelta(days=1)
        on_time = TaskHistory(due, ((D, "IN_PROGRESS"), (due, "DONE")))
        self.assertEqual(make_sample("demo", D, [*cases, on_time]).label, 0)

    def test_generation_and_group_split_are_repeatable_and_disjoint(self):
        samples, skipped = generate_samples()
        self.assertEqual((samples, skipped), generate_samples())
        train, test = split_samples(samples)
        self.assertEqual((train, test), split_samples(samples))
        self.assertEqual(len(train) + len(test), len(samples))
        self.assertTrue({row.project_id for row in train}.isdisjoint(
            row.project_id for row in test
        ))


if __name__ == "__main__":
    unittest.main()
