from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
import joblib
import os

app = FastAPI()

MODEL_PATH = 'attrition_model.h5'
SCALER_PATH = 'scaler.pkl'
ENCODERS_PATH = 'encoders.pkl'

# Lazy load artifacts
model = None
scaler = None
encoders = None

def load_artifacts():
    global model, scaler, encoders
    if model is None and os.path.exists(MODEL_PATH):
        model = keras.models.load_model(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        encoders = joblib.load(ENCODERS_PATH)

class EmployeeData(BaseModel):
    Age: int
    Department: str
    JobLevel: int
    MonthlyIncome: int
    DistanceFromHome: int
    YearsAtCompany: int
    YearsInCurrentRole: int
    YearsWithCurrManager: int
    JobSatisfaction: int
    WorkLifeBalance: int
    EnvironmentSatisfaction: int
    RelationshipSatisfaction: int
    TrainingTimesLastYear: int
    OverTime: str

    def to_dict(self):
        return self.dict()

@app.on_event("startup")
def startup_event():
    load_artifacts()

# Write a simple health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict")
def predict_attrition(data: EmployeeData):
    load_artifacts()
    if model is None:
        raise HTTPException(status_code=500, detail="Model artifacts not found. Please train the model first.")
        
    df_dict = data.to_dict()
    df = pd.DataFrame([df_dict])
    
    # Encode categoricals
    try:
        df['Department'] = encoders['Department'].transform(df['Department'])
        df['OverTime'] = encoders['OverTime'].transform(df['OverTime'])
    except Exception as e:
        # Fallback if unknown category
        df['Department'] = 0
        df['OverTime'] = 0

    # Scale numeric features
    X_scaled = scaler.transform(df.values)
    
    # Predict
    prob = model.predict(X_scaled)[0][0]
    prediction = "Leave" if prob > 0.5 else "Stay"
    
    # Basic logic for reasons & solutions based on thresholds
    reasons = []
    solutions = []
    
    if data.OverTime == 'Yes':
        reasons.append("High overtime workload")
        solutions.append("Reduce overtime workload and ensure adequate staffing.")
    if data.JobSatisfaction <= 2:
        reasons.append("Low job satisfaction")
        solutions.append("Conduct 1-on-1s to address job satisfaction and blockers.")
    if data.MonthlyIncome < 4000:
        reasons.append("Low salary")
        solutions.append("Review compensation against market standards.")
    if data.DistanceFromHome > 15:
        reasons.append("Long commute distance")
        solutions.append("Offer remote or hybrid work options.")
    if data.YearsAtCompany > 3 and data.JobLevel <= 1:
        reasons.append("No promotion for a long time")
        solutions.append("Provide career development and promotion opportunities.")
    if data.WorkLifeBalance <= 2:
        reasons.append("Poor work-life balance")
        solutions.append("Improve work flexibility and review workload allocation.")
        
    # Provide fallback if empty
    if not reasons and prediction == 'Leave':
        reasons.append("General dissatisfaction inferred by model")
        solutions.append("Conduct a stay-interview to uncover hidden issues.")

    return {
        "prediction": prediction,
        "probability": float(prob),
        "reasons": reasons,
        "solutions": solutions
    }
