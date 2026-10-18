"use strict";
/*
 * Liver module. Feature names keep the dataset's exact spelling
 * (e.g. Alamine_Aminotransferase, Total_Protiens). `Dataset` is the target and is NEVER sent.
 * Units follow the Indian Liver Patient Dataset description; verify against your notebook.
 */
HealthPredict.initPredictor({
  key: "liver",
  groups: [
    { title: "Personal information", fields: [
      { name: "Age", label: "Age", kind: "int", unit: "years" },
      // String categories are preserved; the pipeline's OneHotEncoder expects them.
      { name: "Gender", label: "Gender", kind: "select", cast: "string", options: [["Female", "Female"], ["Male", "Male"]] }
    ]},
    { title: "Bilirubin measurements", fields: [
      { name: "Total_Bilirubin", label: "Total bilirubin", kind: "float", unit: "mg/dL" },
      { name: "Direct_Bilirubin", label: "Direct bilirubin", kind: "float", unit: "mg/dL" }
    ]},
    { title: "Enzyme measurements", fields: [
      { name: "Alkaline_Phosphotase", label: "Alkaline phosphotase", kind: "float", unit: "IU/L" },
      { name: "Alamine_Aminotransferase", label: "Alanine aminotransferase", kind: "float", unit: "IU/L" },
      { name: "Aspartate_Aminotransferase", label: "Aspartate aminotransferase", kind: "float", unit: "IU/L" }
    ]},
    { title: "Protein measurements", fields: [
      { name: "Total_Protiens", label: "Total proteins", kind: "float", unit: "g/dL" },
      { name: "Albumin", label: "Albumin", kind: "float", unit: "g/dL" },
      { name: "Albumin_and_Globulin_Ratio", label: "Albumin/globulin ratio", kind: "float", hint: "Required. Empty values are never replaced with zero." }
    ]}
  ],

  // Exactly the 10 model features with exact spelling. No `Dataset`.
  buildPayload: (v) => ({
    Age: v.Age,
    Gender: v.Gender,
    Total_Bilirubin: v.Total_Bilirubin,
    Direct_Bilirubin: v.Direct_Bilirubin,
    Alkaline_Phosphotase: v.Alkaline_Phosphotase,
    Alamine_Aminotransferase: v.Alamine_Aminotransferase,
    Aspartate_Aminotransferase: v.Aspartate_Aminotransferase,
    Total_Protiens: v.Total_Protiens,
    Albumin: v.Albumin,
    Albumin_and_Globulin_Ratio: v.Albumin_and_Globulin_Ratio
  }),

  /*
   * CONFIRM: the response schema is not final, so nothing is guessed here.
   * Once the FastAPI code exists, return { label, predictionClass, probability }.
   * Note: in your notebook, encoded target 1 = liver disease, 0 = no liver disease.
   */
  parseResponse(data) {
    return {
      label: data.result,
      predictionClass: data.prediction,
      probability: HealthPredict.toPercent(data.probability)
    };
  }
});