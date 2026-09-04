/* ---------- USER GREETING ---------- */

const userName = localStorage.getItem("userName");

const userGreeting = document.getElementById("userGreeting");

if (userName) {
    userGreeting.textContent = `Hello, ${userName}!`;
}


/* ---------- DIABETES FORM ---------- */

const form = document.getElementById("diabetesForm");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const data = {
        Pregnancies: Number(document.getElementById("pregnancies").value),
        Glucose: Number(document.getElementById("glucose").value),
        BloodPressure: Number(document.getElementById("bloodPressure").value),
        SkinThickness: Number(document.getElementById("skinThickness").value),
        Insulin: Number(document.getElementById("insulin").value),
        BMI: Number(document.getElementById("bmi").value),
        DiabetesPedigreeFunction: Number(
            document.getElementById("diabetesPedigree").value
        ),
        Age: Number(document.getElementById("age").value)
    };

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/predict/diabetes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        if (!response.ok) {
            throw new Error("Prediction request failed");
        }

        const result = await response.json();

        console.log(result);

        // Show result card
        document.getElementById("resultCard").style.display = "block";

        // Show prediction message
        document.getElementById("resultMessage").textContent =
            result.result;

        // Show probability
        document.getElementById("probabilityValue").textContent =
            `${result.probability}%`;

        // Determine risk level
        let riskLevel;

        if (result.probability < 30) {
            riskLevel = "Low";
        } else if (result.probability < 60) {
            riskLevel = "Moderate";
        } else {
            riskLevel = "High";
        }

        document.getElementById("riskLevel").textContent = riskLevel;

    } catch (error) {
        console.error("Error:", error);

        document.getElementById("resultCard").style.display = "block";

        document.getElementById("resultMessage").textContent =
            "Unable to get prediction";

        document.getElementById("probabilityValue").textContent =
            "--%";

        document.getElementById("riskLevel").textContent =
            "Please make sure the backend is running.";
    }
});