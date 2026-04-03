import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import tensorflow as tf
from tensorflow import keras
import joblib
import os

# Define Paths
DATA_PATH = './data/HR_Employee_Attrition.csv'
MODEL_PATH = 'attrition_model.h5'
SCALER_PATH = 'scaler.pkl'
ENCODERS_PATH = 'encoders.pkl'

def train_model():
    print("Loading data...")
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    
    # Target variable
    y = df['Attrition'].map({'Yes': 1, 'No': 0}).values
    
    # We will define the required features specifically based on the prompt requirements:
    # Age, Department, Job Level, Monthly Income, Distance From Home, Years At Company,
    # Years In Current Role, Years With Current Manager, Job Satisfaction, Work Life Balance,
    # Environment Satisfaction, Relationship Satisfaction, Training Times Last Year, OverTime
    features = [
        'Age', 'Department', 'JobLevel', 'MonthlyIncome', 'DistanceFromHome', 
        'YearsAtCompany', 'YearsInCurrentRole', 'YearsWithCurrManager', 
        'JobSatisfaction', 'WorkLifeBalance', 'EnvironmentSatisfaction', 
        'RelationshipSatisfaction', 'TrainingTimesLastYear', 'OverTime'
    ]
    
    X = df[features].copy()
    
    # Categorical encodings
    categorical_cols = ['Department', 'OverTime']
    encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        encoders[col] = le
        
    X_num = X.values
    
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X_num, y, test_size=0.2, random_state=42, stratify=y)
    
    print("Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("Building Neural Network...")
    model = keras.Sequential([
        keras.layers.Dense(64, activation='relu', input_shape=(X_train_scaled.shape[1],)),
        keras.layers.Dropout(0.3),
        keras.layers.Dense(32, activation='relu'),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(16, activation='relu'),
        keras.layers.Dense(1, activation='sigmoid')
    ])
    
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    
    print("Training model...")
    # Using class weights since Attrition 'Yes' is usually minority
    neg, pos = np.bincount(y_train)
    total = neg + pos
    weight_for_0 = (1 / neg) * (total / 2.0)
    weight_for_1 = (1 / pos) * (total / 2.0)
    class_weight = {0: weight_for_0, 1: weight_for_1}

    model.fit(
        X_train_scaled, y_train,
        epochs=100,
        batch_size=32,
        validation_split=0.2,
        class_weight=class_weight,
        verbose=1
    )
    
    print("Evaluating model...")
    y_pred_probs = model.predict(X_test_scaled)
    y_pred = (y_pred_probs > 0.5).astype(int).flatten()
    
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred))
    
    print("Saving artifacts...")
    model.save(MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(encoders, ENCODERS_PATH)
    joblib.dump(features, 'feature_names.pkl')
    
    print("Model training complete and saved.")

if __name__ == "__main__":
    train_model()
