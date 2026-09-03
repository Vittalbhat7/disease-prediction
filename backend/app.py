from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
from pathlib import Path


# Create FastAPI app
app = FastAPI()


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Find the diabetes model
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR.parent / "diabetes" / "diabetes_model.pkl"


# Load the trained model
model = joblib.load(MODEL_PATH)


# Input data format
class DiabetesInput(BaseModel):
    Pregnancies: int
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int


# Home / health-check endpoint
@app.get("/")
def home():
    return {"message": "Disease Prediction API is running"}


# Diabetes prediction endpoint
@app.post("/predict/diabetes")
def predict_diabetes(data: DiabetesInput):

    # Keep the exact same feature order used during training
    input_data = [[
        data.Pregnancies,
        data.Glucose,
        data.BloodPressure,
        data.SkinThickness,
        data.Insulin,
        data.BMI,
        data.DiabetesPedigreeFunction,
        data.Age
    ]]

    # Make prediction
    prediction = model.predict(input_data)[0]

    # Get probability of Diabetes (class 1)
    probability = model.predict_proba(input_data)[0][1]

    # Convert probability to percentage
    probability_percentage = round(probability * 100, 2)

    # Return result
    if prediction == 1:
        result = "Diabetes"
    else:
        result = "No Diabetes"

    return {
        "prediction": int(prediction),
        "result": result,
        "probability": probability_percentage
    }