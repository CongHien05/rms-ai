from fastapi import FastAPI

app = FastAPI(title="RMS-AI AI Service")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
