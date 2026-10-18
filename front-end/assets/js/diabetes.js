"use strict";
/* Diabetes module. Field names match the FastAPI model `DiabetesInput` exactly. */
HealthPredict.initPredictor({
  key: "diabetes",
  groups: [
    { title: "Personal information", fields: [
      { name: "Pregnancies", label: "Pregnancies", kind: "int", hint: "Number of times pregnant." },
      { name: "Age", label: "Age", kind: "int", unit: "years" }
    ]},
    { title: "Clinical measurements", fields: [
      { name: "Glucose", label: "Glucose", kind: "float", unit: "mg/dL", hint: "Plasma glucose concentration, as defined in the Pima dataset." },
      { name: "BloodPressure", label: "Blood pressure", kind: "float", unit: "mm Hg", hint: "Diastolic blood pressure in the Pima dataset." },
      { name: "SkinThickness", label: "Skin thickness", kind: "float", unit: "mm", hint: "Triceps skin-fold thickness." },
      { name: "Insulin", label: "Insulin", kind: "float", unit: "µU/mL", hint: "2-hour serum insulin in the Pima dataset." },
      { name: "BMI", label: "BMI", kind: "float", unit: "kg/m²" },
      { name: "DiabetesPedigreeFunction", label: "Diabetes pedigree function", kind: "float", hint: "Score estimating hereditary influence." }
    ]}
  ],

  // Exact JSON keys and capitalisation required by the backend.
  buildPayload: (v) => ({
    Pregnancies: v.Pregnancies,
    Glucose: v.Glucose,
    BloodPressure: v.BloodPressure,
    SkinThickness: v.SkinThickness,
    Insulin: v.Insulin,
    BMI: v.BMI,
    DiabetesPedigreeFunction: v.DiabetesPedigreeFunction,
    Age: v.Age
  }),

  // Confirmed response: { prediction: 0|1, result: string, probability: percentage }
  parseResponse(data) {
    if (!data || typeof data.result !== "string" || data.result.trim() === "") {
      throw new Error("the 'result' field is missing.");
    }
    return {
      label: data.result,
      predictionClass: data.prediction === 0 || data.prediction === 1 ? data.prediction : null,
      probability: HealthPredict.toPercent(data.probability) // already a percentage
    };
  }
});
