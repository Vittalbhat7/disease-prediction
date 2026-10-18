"use strict";
/*
 * Cardiovascular module. Feature names match the dataset columns exactly.
 * `cardio` is the target and is NEVER sent.
 * Category labels are neutral until their meanings are verified.
 */
const catOptions = (n) => Array.from({ length: n }, (_, i) => [String(i + 1), "Category " + (i + 1)]);
const yesNo = [["0", "No"], ["1", "Yes"]];

HealthPredict.initPredictor({
  key: "cardiovascular",
  groups: [
    { title: "Personal information", fields: [
      { name: "age_years", label: "Age", kind: "int", unit: "years" },
      { name: "gender", label: "Gender category", kind: "select", cast: "number", options: catOptions(2), hint: "Dataset code 1 or 2; meaning not yet confirmed." },
      { name: "height", label: "Height", kind: "float", unit: "cm" },
      { name: "weight", label: "Weight", kind: "float", unit: "kg" }
    ]},
    { title: "Blood pressure", fields: [
      { name: "ap_hi", label: "Systolic blood pressure", kind: "float", unit: "mm Hg" },
      { name: "ap_lo", label: "Diastolic blood pressure", kind: "float", unit: "mm Hg" }
    ]},
    { title: "Health and lifestyle", fields: [
      { name: "cholesterol", label: "Cholesterol category", kind: "select", cast: "number", options: catOptions(3), hint: "Dataset codes 1 to 3; meanings not yet confirmed." },
      { name: "gluc", label: "Glucose category", kind: "select", cast: "number", options: catOptions(3), hint: "Dataset codes 1 to 3; meanings not yet confirmed." },
      { name: "smoke", label: "Smoker", kind: "select", cast: "number", options: yesNo },
      { name: "alco", label: "Alcohol consumption", kind: "select", cast: "number", options: yesNo },
      { name: "active", label: "Physically active", kind: "select", cast: "number", options: yesNo }
    ]}
  ],

  // Exactly the 11 model features, in dataset order. No `cardio`.
  buildPayload: (v) => ({
    age_years: v.age_years,
    gender: v.gender,
    height: v.height,
    weight: v.weight,
    ap_hi: v.ap_hi,
    ap_lo: v.ap_lo,
    cholesterol: v.cholesterol,
    gluc: v.gluc,
    smoke: v.smoke,
    alco: v.alco,
    active: v.active
  }),

  /*
   * CONFIRM: the response schema is not final, so nothing is guessed here.
   * Once the FastAPI code exists, return { label, predictionClass, probability }.
   * Example (diabetes-style, only if your API matches):
   *   return { label: data.result, predictionClass: data.prediction,
   *            probability: HealthPredict.toPercent(data.probability) };
   */
  parseResponse() {
    throw new Error("the cardiovascular response adapter has not been configured yet (see cardiovascular.js).");
  }
});
