from dataclasses import dataclass
from datetime import date, timedelta
from random import Random

from risk import Assessment, Status, TaskSnapshot, features_for, is_eligible

SEED = 42
PROJECT_COUNT = 600
ASSESSMENTS_PER_PROJECT = 4
FIRST_ASSESSMENT = date(2026, 1, 5)


@dataclass(frozen=True)
class TaskHistory:
    due_date: date
    status_changes: tuple[tuple[date, Status], ...]

    def at_end_of(self, day: date) -> TaskSnapshot | None:
        for changed_on, status in reversed(self.status_changes):
            if changed_on <= day:
                return TaskSnapshot(status=status, dueDate=self.due_date)
        return None


@dataclass(frozen=True)
class Sample:
    project_id: str
    features: list[float]
    label: int


def make_sample(project_id: str, assessed_on: date, tasks: list[TaskHistory]) -> Sample | None:
    visible = [
        (task, snapshot)
        for task in tasks
        if (snapshot := task.at_end_of(assessed_on)) is not None
    ]
    assessment = Assessment(
        projectId=project_id, assessmentDate=assessed_on,
        tasks=[snapshot for _, snapshot in visible],
    )
    features, _, _ = features_for(assessment)
    if features is None:
        return None

    label = 0
    for task, snapshot in visible:
        if is_eligible(snapshot, assessed_on):
            at_due = task.at_end_of(task.due_date)
            if at_due is not None and at_due.status != "DONE":
                label = 1
                break
    return Sample(project_id, features, label)


def simulate_task(rng: Random, week_start: date, friction: float) -> TaskHistory:
    due = week_start + timedelta(days=rng.randint(1, 7))
    created = due - timedelta(days=rng.randint(2, 19))
    difficulty = rng.uniform(0.65, 1.4) * friction
    status: Status = "TODO"
    history: list[tuple[date, Status]] = [(created, status)]

    for offset in range(1, (due - created).days + 15):
        change = rng.random()
        previous = status
        if status == "TODO" and change < 0.48 / difficulty:
            status = "IN_PROGRESS"
        elif status == "IN_PROGRESS":
            if change < 0.58 / difficulty:
                status = "DONE"
            elif change < 0.58 / difficulty + 0.12 * difficulty:
                status = "BLOCKED"
        elif status == "BLOCKED" and change < 0.50 / difficulty:
            status = "IN_PROGRESS"
        if status != previous:
            history.append((created + timedelta(days=offset), status))
        if status == "DONE":
            break

    return TaskHistory(due, tuple(history))


def generate_samples(seed: int = SEED) -> tuple[list[Sample], int]:
    rng = Random(seed)
    samples: list[Sample] = []
    skipped = 0
    for index in range(PROJECT_COUNT):
        project_id = f"demo-{index:04d}"
        friction = rng.uniform(0.65, 1.8)
        week_count = rng.randint(2, 8)
        dates = [
            FIRST_ASSESSMENT + timedelta(weeks=week)
            for week in range(ASSESSMENTS_PER_PROJECT)
        ]
        tasks = [
            simulate_task(rng, week, friction)
            for week in [FIRST_ASSESSMENT - timedelta(weeks=1), *dates]
            for _ in range(max(1, week_count + rng.randint(-2, 2)))
        ]
        for assessed_on in dates:
            sample = make_sample(project_id, assessed_on, tasks)
            if sample is None:
                skipped += 1
            else:
                samples.append(sample)
    return samples, skipped
