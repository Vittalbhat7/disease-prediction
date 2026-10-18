# HealthPredict AI – Disease Prediction System

A machine learning-based disease prediction system that predicts the likelihood of different diseases using patient health-related inputs.

The project currently includes three disease prediction modules: **Diabetes, Heart Disease (Cardio), and Liver Disease**.

## Current Status

| Disease | Status |
|---|---|
| Diabetes Prediction | Completed |
| Heart Disease (Cardio) Prediction | Completed |
| Liver Disease Prediction | Completed |

## Machine Learning Workflow

For each disease, the following steps are performed:

1. **EDA:** Understand the dataset, feature distributions, correlations, and data quality.
2. **Data Preprocessing:** Handle missing values, duplicates, invalid values, and scaling where required.
3. **Model Training:** Train and compare five classification algorithms.
4. **Hyperparameter Tuning:** Use `GridSearchCV` with cross-validation to find suitable hyperparameter combinations.
5. **Model Evaluation:** Evaluate both baseline and tuned models using multiple performance metrics.
6. **Model Selection:** Compare model performance and select the most suitable model for each disease.
7. **Model Saving:** Save the selected trained models for backend integration.

## Models Evaluated

The following models are trained and compared for each disease:

- Logistic Regression
- Decision Tree and Tuned Decision Tree
- Random Forest and Tuned Random Forest
- Gradient Boosting and Tuned Gradient Boosting
- XGBoost and Tuned XGBoost

GridSearchCV is used to tune the hyperparameters of the four tree-based algorithms.

## Model Evaluation Metrics

Each model is evaluated using:

- **Accuracy:** Overall percentage of correct predictions.
- **Precision:** How many positive predictions are correct.
- **Recall:** How many actual positive cases are identified.
- **F1-Score:** Balance between Precision and Recall.
- **F2-Score:** Gives greater importance to Recall.
- **ROC-AUC:** Measures the model's ability to distinguish between classes.

Recall is given particular attention because false-negative predictions are important in disease prediction.

## Weighted Model Scoring

A weighted scoring approach is used to compare models based on multiple evaluation metrics rather than Accuracy alone.

The metrics are assigned importance weights according to the requirements of the disease prediction task. The weighted score supports model selection alongside individual metrics, confusion matrices, and overall model performance.

## Application Architecture

```text
Frontend (HTML, CSS, JavaScript)
              ↓
        FastAPI Backend
              ↓
     Selected ML Model
              ↓
   Prediction and Probability
              ↓
       Result on Frontend
```

## Technologies Used

**Machine Learning:** Python, Pandas, NumPy, Scikit-learn, XGBoost, Matplotlib, Seaborn

**Model Development:** EDA, Classification, GridSearchCV, Cross-Validation, Hyperparameter Tuning, Weighted Model Scoring

**Backend:** FastAPI, Python

**Frontend:** HTML, CSS, JavaScript

**Deployment:** AWS Lambda and AWS Amplify (planned)

## Future Work

- Complete cloud deployment.
- Improve model evaluation and documentation.
- Enhance frontend usability and backend reliability.

## Disclaimer

This project is developed for educational and demonstration purposes only. Predictions are not medical diagnoses and should not replace professional medical advice.
