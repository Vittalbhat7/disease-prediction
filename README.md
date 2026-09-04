# Disease Prediction System

A machine learning-based disease prediction system that predicts the likelihood of different diseases using patient health-related inputs.

The project is being developed step by step, starting with **Diabetes Prediction**. Three additional disease prediction modules will be added in future versions.

## Current Status

| Disease   | Status      |
| --------- | ----------- |
| Diabetes  | Completed   |
| Disease 2 | Coming Soon |
| Disease 3 | Coming Soon |
| Disease 4 | Coming Soon |

---

# Diabetes Prediction

The first completed module focuses on predicting whether a person is likely to have diabetes using the **Pima Indians Diabetes Dataset**.

The system takes medical and demographic information as input and provides:

* Diabetes / No Diabetes prediction
* Diabetes probability
* Risk level

---

# Machine Learning Workflow

## 1. Dataset

The **Pima Indians Diabetes Dataset** was used for the Diabetes prediction model.

The dataset contains features such as:

* Pregnancies
* Glucose
* Blood Pressure
* Skin Thickness
* Insulin
* BMI
* Diabetes Pedigree Function
* Age

The target variable is:

* `0` → No Diabetes
* `1` → Diabetes

---

## 2. Exploratory Data Analysis

Exploratory Data Analysis (EDA) was performed before training the models to understand the dataset and identify possible data issues.

The analysis included:

* Dataset structure
* Data types
* Statistical summary
* Target distribution
* Feature distributions
* Correlation analysis
* Identification of invalid/unrealistic values

This helped us understand the data before applying machine learning algorithms.

---

## 3. Data Preprocessing

The identified data issues were handled and the dataset was prepared for model training.

The features and target variable were separated, and the dataset was divided into training and testing data.

Appropriate preprocessing and scaling were applied where required by the models.

---

# 4. Testing Five Machine Learning Models

Instead of selecting one algorithm directly, five different classification models were trained and compared:

1. Logistic Regression
2. Decision Tree
3. Random Forest
4. Gradient Boosting
5. XGBoost

This allowed us to compare different approaches and determine which model was most suitable for the Diabetes prediction problem.

---

# 5. Model Evaluation

The models were evaluated using five metrics:

* Accuracy
* Precision
* Recall
* F1-Score
* ROC-AUC

Because this is a disease prediction problem, the model was not selected using Accuracy alone.

Recall was given the highest importance because missing an actual Diabetes case is an important error.

---

# 6. Hyperparameter Tuning

After evaluating the models, **GridSearchCV** was used for hyperparameter tuning.

GridSearchCV tested different combinations of hyperparameters using cross-validation to find better-performing configurations.

The tuned models were then evaluated again using the same evaluation metrics.

---

# 7. Final Model Selection

A dedicated model-selection process was created to compare the five models.

Each model was evaluated using:

* Accuracy
* Precision
* Recall
* F1-Score
* ROC-AUC

Different importance weights were assigned to these metrics based on the requirements of the Diabetes prediction problem.

### Metric Weights

| Metric    | Weight | Reason                                                                |
| --------- | -----: | --------------------------------------------------------------------- |
| Accuracy  |    25% | Measures overall correctness                                          |
| Precision |    15% | Helps reduce false Diabetes predictions                               |
| Recall    |    30% | Highest importance because missing actual Diabetes cases is important |
| F1-Score  |    20% | Balances Precision and Recall                                         |
| ROC-AUC   |    10% | Measures the model's ability to distinguish the two classes           |

### Weighted Overall Model Score

The final comparison uses the following formula:

**Overall Score = (Accuracy × 0.25) + (Precision × 0.15) + (Recall × 0.30) + (F1 × 0.20) + (ROC-AUC × 0.10)**

The model with the strongest overall performance and highest weighted score was considered for final selection.

The weighted score was used as an additional decision-making tool. Individual metrics, especially Recall, were also considered before selecting the final model.

---

# 8. Final Model

After comparing the five models, tuning their hyperparameters, and evaluating their performance, the best-performing model was selected for the Diabetes prediction system.

The final trained model was saved as:

```text
diabetes_model.pkl
```

This saved model can be loaded by the backend without retraining it every time a prediction is requested.

---

# 9. Backend API

A **FastAPI backend** was created to connect the machine learning model with the frontend.

The backend receives the patient's input data, passes it to the trained model, and returns the prediction result.

The basic flow is:

```text
Frontend
   ↓
FastAPI Backend
   ↓
Diabetes Model
   ↓
Prediction + Probability
   ↓
Risk Level
   ↓
Frontend
```

The API allows the trained model to be used by the actual application rather than only through the Jupyter notebook.

---

# 10. Prediction Output

The classification model provides a prediction along with its probability.

For example:

```text
Prediction: No Diabetes
Diabetes Probability: 6.78%
Risk Level: Low
```

The probability is generated from the model's prediction probability and is displayed separately from the final classification.

---

# 11. Application Testing

The complete prediction system was tested after connecting the frontend, backend, and machine learning model.

Testing included:

* Valid input values
* Minimum allowed values
* Boundary values
* Different combinations of patient inputs
* Diabetes prediction cases
* No Diabetes prediction cases
* Prediction probability
* Risk-level output
* Frontend-to-backend communication
* Backend-to-model communication
* Invalid input handling

Input validation was also improved to prevent inappropriate values for fields where zero is not a meaningful medical input.

---

# Project Structure

```text
disease-prediction/
│
├── diabetes/
│   │
│   ├── Testing_models/
│   │   ├── EDA
│   │   ├── Logistic Regression
│   │   ├── Decision Tree
│   │   ├── Random Forest
│   │   ├── Gradient Boosting
│   │   └── XGBoost
│   │
│   ├── Final_Model_Selection.ipynb
│   ├── diabetes_model.pkl
│   └── diabetes.xlsx
│
├── backend/
│   ├── ...
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── diabetes.html
│   ├── css/
│   └── js/
│
└── README.md
```

---

# Technologies Used

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* XGBoost
* Matplotlib
* Seaborn

### Backend

* FastAPI
* Python

### Frontend

* HTML
* CSS
* JavaScript

### Model Development

* Exploratory Data Analysis
* Data Preprocessing
* Classification
* Cross-Validation
* GridSearchCV
* Model Comparison
* ROC-AUC Analysis
* Probability Prediction

### Deployment

The planned deployment architecture uses Docker and AWS Lambda.

```text
Frontend
   ↓
API Gateway
   ↓
AWS Lambda
   ↓
Docker Container
   ↓
FastAPI
   ↓
Diabetes ML Model
```

---

# Future Work

The project will be expanded with three additional disease prediction modules.

### Coming Soon

* Disease 2 Prediction
* Disease 3 Prediction
* Disease 4 Prediction

The long-term goal is to provide multiple disease prediction capabilities through a single application.

---

# Disclaimer

This project is developed for **educational and demonstration purposes**.

The predictions generated by this system should not be considered a medical diagnosis or a replacement for professional medical advice.
