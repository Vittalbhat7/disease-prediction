"use strict";
/*
 * Central API configuration. Every page reads its URLs from here only.
 *
 * LOCAL DEVELOPMENT : keep API_BASE_URL as http://127.0.0.1:8000
 * DEPLOYMENT        : replace it with your deployed HTTPS API URL
 *                     (e.g. an API Gateway stage URL). No trailing slash needed.
 * Never put API keys or secrets in this file: it is public to every visitor.
 */
window.APP_CONFIG = {
  API_BASE_URL: "http://127.0.0.1:8000",

  API_ENDPOINTS: {
    // CONFIRMED: existing FastAPI route (DiabetesInput -> prediction/result/probability)
    diabetes: "/predict/diabetes",

    // NOT CONFIRMED: replace null with the real route (e.g. "/predict/cardio")
    // once the FastAPI code exists. While null, no request is ever sent.
    cardiovascular: null,

    // NOT CONFIRMED: replace null with the real route once the backend exists.
    liver: null
  },

  REQUEST_TIMEOUT_MS: 20000
};
