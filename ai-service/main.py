from fastapi import FastAPI, HTTPException

from risk import Assessment, Prediction, predict

app = FastAPI(title="RMS-AI AI Service")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/risk/predict", response_model=Prediction)
def predict_risk(assessment: Assessment) -> Prediction:
    try:
        return predict(assessment)
    except (OSError, KeyError, TypeError, ValueError) as error:
        raise HTTPException(
            status_code=503,
            detail="Risk model unavailable. Run python train.py before scoring.",
        ) from error
