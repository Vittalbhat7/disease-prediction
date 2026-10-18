
from pathlib import Path

import joblib
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from mangum import Mangum


# =========================================================
# 1. CREATE FASTAPI APP
# =========================================================

app = FastAPI(
    title="HealthPredict AI",
    description="Disease prediction API using trained ML models",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# 2. LOAD ALL THREE TRAINED MODELS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

diabetes_model = joblib.load(
    BASE_DIR / "diabetes_model.pkl"
)

cardiovascular_model = joblib.load(
    BASE_DIR / "cardiovascular_final_pipeline.pkl"
)

liver_model = joblib.load(
    BASE_DIR / "liver_disease_gb_tuned.pkl"
)


# =========================================================
# 3. HELPER FUNCTION FOR PREDICTION PROBABILITY
# =========================================================

def get_probability(model, input_data, positive_class=1):
    """
    Return the probability associated with the specified
    positive class, as a percentage.
    """

    if not hasattr(model, "predict_proba"):
        return None

    probabilities = model.predict_proba(input_data)[0]
    classes = list(model.classes_)

    if positive_class not in classes:
        return None

    class_index = classes.index(positive_class)

    return round(float(probabilities[class_index]) * 100, 2)


# =========================================================
# 4. HOME / HEALTH CHECK
# =========================================================

@app.get("/")
def home():
    return {
        "message": "HealthPredict AI API is running",
        "available_models": [
            "diabetes",
            "cardiovascular",
            "liver"
        ]
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "models_loaded": {
            "diabetes": diabetes_model is not None,
            "cardiovascular": cardiovascular_model is not None,
            "liver": liver_model is not None
        }
    }


# =========================================================
# 5. DIABETES PREDICTION
# =========================================================

class DiabetesInput(BaseModel):
    Pregnancies: int = Field(ge=0)
    Glucose: float = Field(ge=0)
    BloodPressure: float = Field(ge=0)
    SkinThickness: float = Field(ge=0)
    Insulin: float = Field(ge=0)
    BMI: float = Field(ge=0)
    DiabetesPedigreeFunction: float = Field(ge=0)
    Age: int = Field(ge=1)


@app.post("/predict/diabetes")
def predict_diabetes(data: DiabetesInput):

    input_data = pd.DataFrame([{
        "Pregnancies": data.Pregnancies,
        "Glucose": data.Glucose,
        "BloodPressure": data.BloodPressure,
        "SkinThickness": data.SkinThickness,
        "Insulin": data.Insulin,
        "BMI": data.BMI,
        "DiabetesPedigreeFunction":
            data.DiabetesPedigreeFunction,
        "Age": data.Age
    }])

    prediction = int(diabetes_model.predict(input_data)[0])

    probability = get_probability(
        diabetes_model,
        input_data,
        positive_class=1
    )

    result = (
        "Diabetes" if prediction == 1
        else "No Diabetes"
    )

    return {
        "disease": "Diabetes",
        "prediction": prediction,
        "result": result,
        "probability": probability
    }


# =========================================================
# 6. CARDIOVASCULAR DISEASE PREDICTION
# =========================================================

class CardiovascularInput(BaseModel):
    age_years: float = Field(gt=0)
    gender: int = Field(ge=1, le=2)
    height: float = Field(gt=0)
    weight: float = Field(gt=0)
    ap_hi: float
    ap_lo: float
    cholesterol: int = Field(ge=1, le=3)
    gluc: int = Field(ge=1, le=3)
    smoke: int = Field(ge=0, le=1)
    alco: int = Field(ge=0, le=1)
    active: int = Field(ge=0, le=1)


@app.post("/predict/cardiovascular")
def predict_cardiovascular(data: CardiovascularInput):

    # Names must match the cardiovascular training pipeline.
    input_data = pd.DataFrame([{
        "age_years": data.age_years,
        "height": data.height,
        "weight": data.weight,
        "ap_hi": data.ap_hi,
        "ap_lo": data.ap_lo,
        "gender": data.gender,
        "cholesterol": data.cholesterol,
        "gluc": data.gluc,
        "smoke": data.smoke,
        "alco": data.alco,
        "active": data.active
    }])

    prediction = int(
        cardiovascular_model.predict(input_data)[0]
    )

    probability = get_probability(
        cardiovascular_model,
        input_data,
        positive_class=1
    )

    result = (
        "Cardiovascular Disease"
        if prediction == 1
        else "No Cardiovascular Disease"
    )

    return {
        "disease": "Cardiovascular Disease",
        "prediction": prediction,
        "result": result,
        "probability": probability
    }


# =========================================================
# 7. LIVER DISEASE PREDICTION
# =========================================================

class LiverInput(BaseModel):
    Age: float = Field(gt=0)
    Gender: str
    Total_Bilirubin: float = Field(ge=0)
    Direct_Bilirubin: float = Field(ge=0)
    Alkaline_Phosphotase: float = Field(ge=0)
    Alamine_Aminotransferase: float = Field(ge=0)
    Aspartate_Aminotransferase: float = Field(ge=0)
    Total_Protiens: float = Field(gt=0)
    Albumin: float = Field(gt=0)
    Albumin_and_Globulin_Ratio: float = Field(ge=0)


@app.post("/predict/liver")
def predict_liver(data: LiverInput):

    # Original feature names from the liver dataset.
    input_data = pd.DataFrame([{
        "Age": data.Age,
        "Gender": data.Gender,
        "Total_Bilirubin": data.Total_Bilirubin,
        "Direct_Bilirubin": data.Direct_Bilirubin,
        "Alkaline_Phosphotase":
            data.Alkaline_Phosphotase,
        "Alamine_Aminotransferase":
            data.Alamine_Aminotransferase,
        "Aspartate_Aminotransferase":
            data.Aspartate_Aminotransferase,
        "Total_Protiens": data.Total_Protiens,
        "Albumin": data.Albumin,
        "Albumin_and_Globulin_Ratio":
            data.Albumin_and_Globulin_Ratio
    }])

    prediction = int(liver_model.predict(input_data)[0])

    # Common Indian Liver Patient Dataset encoding:
    # 1 = liver disease, 2 = no liver disease.
    # Verify this matches your training target.
    disease_class = 1

    probability = get_probability(
        liver_model,
        input_data,
        positive_class=disease_class
    )

    result = (
        "Liver Disease"
        if prediction == disease_class
        else "No Liver Disease"
    )

    return {
        "disease": "Liver Disease",
        "prediction": prediction,
        "result": result,
        "probability": probability
    }


# =========================================================
# 8. AWS LAMBDA HANDLER
# =========================================================

handler = Mangum(app, api_gateway_base_path="/default")
