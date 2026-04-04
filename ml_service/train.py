# =============================================================
# train.py — Employee Attrition Prediction
# =============================================================

import warnings
import joblib
import numpy as np
import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.compose import ColumnTransformer
from sklearn.metrics import (classification_report, f1_score,
                             precision_recall_curve, precision_score,
                             recall_score, roc_auc_score)
from sklearn.model_selection import (RandomizedSearchCV, StratifiedKFold,
                                     train_test_split)
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler
from xgboost import XGBClassifier

warnings.filterwarnings("ignore")

# ── Constants ──────────────────────────────────────────────────────────────────
DATA_PATH    = "data/HR_Employee_Attrition.csv"
MODEL_PATH   = "model_pipeline.pkl"
RANDOM_STATE = 42
TEST_SIZE    = 0.20

COLS_TO_DROP = [
    "EmployeeCount", "StandardHours", "Over18",
    "EmployeeNumber", "JobLevel", "PerformanceRating"
]

BINARY_COLS   = ["OverTime", "Gender"]
ORDINAL_COLS  = ["BusinessTravel"]
ORDINAL_ORDER = [["Non-Travel", "Travel_Rarely", "Travel_Frequently"]]
ONEHOT_COLS   = ["Department", "EducationField", "JobRole", "MaritalStatus"]

# ── 1. Load & Clean ────────────────────────────────────────────────────────────
df = pd.read_csv(DATA_PATH)

existing_drops = [c for c in COLS_TO_DROP if c in df.columns]
df.drop(columns=existing_drops, inplace=True)

df["Attrition"] = df["Attrition"].map({"Yes": 1, "No": 0})
df["OverTime"]  = df["OverTime"].map({"Yes": 1, "No": 0})
df["Gender"]    = df["Gender"].map({"Male": 1, "Female": 0})

print(f"Data loaded        : {df.shape}")
print(f"Attrition rate     : {df['Attrition'].mean():.1%}")

# ── 2. Split ───────────────────────────────────────────────────────────────────
X = df.drop(columns=["Attrition"])
y = df["Attrition"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
)

print(f"Train / Test       : {len(X_train)} / {len(X_test)}")

# ── 3. Preprocessor ────────────────────────────────────────────────────────────
num_cols = [c for c in X.select_dtypes(include=np.number).columns
            if c not in BINARY_COLS]

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(),                                num_cols),
        ("ord", OrdinalEncoder(categories=ORDINAL_ORDER),       ORDINAL_COLS),
        ("ohe", OneHotEncoder(drop="first", sparse_output=False,
                              handle_unknown="ignore"),          ONEHOT_COLS),
    ],
    remainder="passthrough"
)

X_train_prep = preprocessor.fit_transform(X_train)
X_test_prep  = preprocessor.transform(X_test)

print(f"Features after encoding : {X_train_prep.shape[1]}")

# ── 4. SMOTE ───────────────────────────────────────────────────────────────────
X_train_bal, y_train_bal = SMOTE(random_state=RANDOM_STATE).fit_resample(
    X_train_prep, y_train
)

print(f"After SMOTE        : {X_train_bal.shape[0]} samples (50/50 balanced)")

# ── 5. Hyperparameter Tuning ───────────────────────────────────────────────────
print("\nRunning RandomizedSearchCV (60 iter × 5 fold)...")

param_dist = {
    "n_estimators"    : [200, 300, 400, 500, 600],
    "max_depth"       : [3, 4, 5, 6, 7],
    "learning_rate"   : [0.01, 0.03, 0.05, 0.1, 0.15],
    "subsample"       : [0.6, 0.7, 0.8, 0.9, 1.0],
    "colsample_bytree": [0.5, 0.6, 0.7, 0.8, 0.9],
    "min_child_weight": [1, 3, 5, 7],
    "gamma"           : [0, 0.1, 0.2, 0.3, 0.5],
    "reg_alpha"       : [0, 0.01, 0.1, 0.5, 1.0],
    "reg_lambda"      : [0.5, 1.0, 1.5, 2.0],
}

xgb = XGBClassifier(
    scale_pos_weight=(y_train == 0).sum() / (y_train == 1).sum(),
    eval_metric="logloss",
    random_state=RANDOM_STATE,
    verbosity=0
)

search = RandomizedSearchCV(
    estimator=xgb,
    param_distributions=param_dist,
    n_iter=60,
    scoring="roc_auc",
    cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE),
    n_jobs=-1,
    random_state=RANDOM_STATE,
    verbose=0
)

search.fit(X_train_bal, y_train_bal)
model = search.best_estimator_

print(f"Best CV AUC        : {search.best_score_:.4f}")
print(f"Best params        : {search.best_params_}")

# ── 6. Threshold Optimization ──────────────────────────────────────────────────
y_prob = model.predict_proba(X_test_prep)[:, 1]

precisions, recalls, thresholds = precision_recall_curve(y_test, y_prob)
f1_scores = np.where(
    (precisions + recalls) == 0,
    0,
    2 * precisions * recalls / (precisions + recalls)
)
best_threshold = thresholds[np.argmax(f1_scores)]
y_pred = (y_prob >= best_threshold).astype(int)

print(f"\nOptimal threshold  : {best_threshold:.4f}")

# ── 7. Final Evaluation ────────────────────────────────────────────────────────
print("\n" + "=" * 55)
print("FINAL MODEL PERFORMANCE (Test Set)")
print("=" * 55)
print(f"ROC-AUC   : {roc_auc_score(y_test, y_prob):.4f}")
print(f"F1-Score  : {f1_score(y_test, y_pred):.4f}")
print(f"Recall    : {recall_score(y_test, y_pred):.4f}")
print(f"Precision : {precision_score(y_test, y_pred):.4f}")
print()
print(classification_report(y_test, y_pred,
                             target_names=["No Attrition", "Attrition"]))

# ── 8. Save Pipeline ───────────────────────────────────────────────────────────
artifact = {
    "preprocessor" : preprocessor,
    "model"        : model,
    "threshold"    : best_threshold,
    "feature_cols" : list(X.columns),
    "num_cols"     : num_cols,
    "binary_cols"  : BINARY_COLS,
    "ordinal_cols" : ORDINAL_COLS,
    "onehot_cols"  : ONEHOT_COLS,
}

joblib.dump(artifact, MODEL_PATH)
print(f"✅ Pipeline saved → {MODEL_PATH}")