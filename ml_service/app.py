from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os

app = FastAPI(
    title="Employee Attrition Prediction API",
    description="Predicts employee attrition risk using XGBoost",
    version="2.0.0"
)

MODEL_PATH = "model_pipeline.pkl"
artifact   = None


def load_artifact():
    global artifact
    if artifact is None and os.path.exists(MODEL_PATH):
        artifact = joblib.load(MODEL_PATH)


def to_python(val):
    """Convert any numpy scalar to a native Python type for JSON serialization."""
    return val.item() if hasattr(val, "item") else val


@app.on_event("startup")
def startup_event():
    load_artifact()


# ── Request Schema ─────────────────────────────────────────────────────────────
class EmployeeData(BaseModel):
    Age:                      int
    BusinessTravel:           str     # Non-Travel | Travel_Rarely | Travel_Frequently
    Department:               str     # Sales | Research & Development | Human Resources
    DistanceFromHome:         int
    Education:                int     # 1–5
    EducationField:           str     # Science | Medical | Marketing | Technical Degree | Human Resources | Other
    EnvironmentSatisfaction:  int     # 1–4
    Gender:                   str     # Male | Female
    JobInvolvement:           int     # 1–4
    JobRole:                  str     # Sales Executive | Research Scientist | Laboratory Technician | Manufacturing Director | Healthcare Representative | Manager | Sales Representative | Research Director | Human Resources
    JobSatisfaction:          int     # 1–4
    MaritalStatus:            str     # Single | Married | Divorced
    MonthlyIncome:            int
    NumCompaniesWorked:       int
    OverTime:                 str     # Yes | No
    PercentSalaryHike:        int
    RelationshipSatisfaction: int     # 1–4
    StockOptionLevel:         int     # 0–3
    TotalWorkingYears:        int
    TrainingTimesLastYear:    int
    WorkLifeBalance:          int     # 1–4
    YearsAtCompany:           int
    YearsInCurrentRole:       int
    YearsSinceLastPromotion:  int
    YearsWithCurrManager:     int


# ── Health Check ───────────────────────────────────────────────────────────────
@app.get("/health")
def health_check():
    load_artifact()
    return {
        "status"      : "ok",
        "model_loaded": artifact is not None,
        "threshold"   : round(to_python(artifact["threshold"]), 4) if artifact else None
    }


# ── Predict ────────────────────────────────────────────────────────────────────
@app.post("/predict")
def predict_attrition(data: EmployeeData):
    load_artifact()

    if artifact is None:
        raise HTTPException(
            status_code=500,
            detail="Model artifact not found. Run train.py first."
        )

    # 1. Build raw DataFrame in the exact column order the pipeline expects
    raw = pd.DataFrame([data.dict()])[artifact["feature_cols"]]

    # 2. Apply binary encoding (must match train.py exactly)
    raw["OverTime"] = raw["OverTime"].map({"Yes": 1, "No": 0})
    raw["Gender"]   = raw["Gender"].map({"Male": 1, "Female": 0})

    # 3. Validate no NaN introduced by bad input values
    if raw.isnull().any().any():
        bad_cols = raw.columns[raw.isnull().any()].tolist()
        raise HTTPException(
            status_code=422,
            detail=f"Invalid values in fields: {bad_cols}. "
                   f"Check OverTime (Yes/No) and Gender (Male/Female)."
        )

    # 4. Preprocess + predict
    X_prep = artifact["preprocessor"].transform(raw)
    prob   = to_python(artifact["model"].predict_proba(X_prep)[0][1])

    # 5. Apply optimal threshold from training
    threshold  = to_python(artifact["threshold"])
    prediction = "Leave" if prob >= threshold else "Stay"

    # 6. Rule-based reasons & solutions
    reasons   = []
    solutions = []

    if data.OverTime == "Yes":
        reasons.append("High overtime workload")
        solutions.append("Reduce overtime and review team capacity.")

    if data.JobSatisfaction <= 2:
        reasons.append("Low job satisfaction")
        solutions.append("Conduct 1-on-1s to address satisfaction blockers.")

    if data.EnvironmentSatisfaction <= 2:
        reasons.append("Poor work environment satisfaction")
        solutions.append("Assess office/team environment and address concerns.")

    if data.WorkLifeBalance <= 2:
        reasons.append("Poor work-life balance")
        solutions.append("Offer flexible hours or remote work options.")

    if data.MonthlyIncome < 30000:
        reasons.append("Below-average compensation")
        solutions.append("Benchmark salary against market and review pay.")

    if data.DistanceFromHome > 15:
        reasons.append("Long commute distance")
        solutions.append("Consider hybrid or remote work arrangements.")

    if data.YearsSinceLastPromotion > 3:
        reasons.append("No promotion in over 3 years")
        solutions.append("Discuss career path and growth opportunities.")

    if data.StockOptionLevel == 0:
        reasons.append("No stock options")
        solutions.append("Review eligibility for stock option grants.")

    if data.RelationshipSatisfaction <= 2:
        reasons.append("Low relationship satisfaction with colleagues")
        solutions.append("Facilitate team-building and peer connection.")

    if data.NumCompaniesWorked >= 5:
        reasons.append("High job-hopping history")
        solutions.append("Engage early with retention plan and growth roadmap.")

    if not reasons and prediction == "Leave":
        reasons.append("General dissatisfaction inferred by model")
        solutions.append("Conduct a stay-interview to uncover hidden concerns.")

    return {
        "prediction" : prediction,
        "probability": round(prob, 4),
        "threshold"  : round(threshold, 4),
        "reasons"    : reasons,
        "solutions"  : solutions
    }