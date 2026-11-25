from base64 import urlsafe_b64decode, urlsafe_b64encode
from hmac import compare_digest
from os import environ
from re import fullmatch
from typing import Annotated

from fastapi import Depends, FastAPI, Header, HTTPException

from risk import Assessment, Prediction, predict

app = FastAPI(title="RMS-AI AI Service")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def valid_service_token(token: str) -> bool:
    if fullmatch(r"[A-Za-z0-9_-]{43}", token) is None:
        return False
    return urlsafe_b64encode(urlsafe_b64decode(token + "=")).decode("ascii").rstrip("=") == token


def verify_risk_service(
    supplied: Annotated[list[str] | None, Header(alias="X-Risk-Service-Token")] = None,
) -> None:
    expected = environ.get("RISK_SERVICE_TOKEN", "")
    if not valid_service_token(expected):
        raise HTTPException(status_code=503, detail="Risk service authentication unavailable.")
    if not supplied or len(supplied) != 1 or not valid_service_token(supplied[0]) or not compare_digest(supplied[0], expected):
        raise HTTPException(status_code=401, detail="Risk service authentication required.")


@app.post("/risk/predict", response_model=Prediction, dependencies=[Depends(verify_risk_service)])
def predict_risk(assessment: Assessment) -> Prediction:
    try:
        return predict(assessment)
    except (OSError, KeyError, TypeError, ValueError) as error:
        raise HTTPException(
            status_code=503,
            detail="Risk model unavailable. Run python train.py before scoring.",
        ) from error
