// ---------- USER NAME ----------

const userName = localStorage.getItem("userName");

const userGreeting = document.getElementById("userGreeting");

if (userName) {
    userGreeting.textContent = `Welcome, ${userName}`;
} else {
    userGreeting.textContent = "Welcome";
}


// ---------- BACK BUTTON ----------

function goBack() {
    window.location.href = "index.html";
}


// ---------- DIABETES FORM ----------

const diabetesForm = document.getElementById("diabetesForm");

diabetesForm.addEventListener("submit", function (event) {

    // Prevent page refresh
    event.preventDefault();


    // ---------- GET INPUT VALUES ----------

    const pregnancies = Number(
        document.getElementById("pregnancies").value
    );

    const glucose = Number(
        document.getElementById("glucose").value
    );

    const bloodPressure = Number(
        document.getElementById("bloodPressure").value
    );

    const skinThickness = Number(
        document.getElementById("skinThickness").value
    );

    const insulin = Number(
        document.getElementById("insulin").value
    );

    const bmi = Number(
        document.getElementById("bmi").value
    );

    const diabetesPedigree = Number(
        document.getElementById("diabetesPedigree").value
    );

    const age = Number(
        document.getElementById("age").value
    );


    // ---------- STORE PATIENT DATA ----------

    const patientData = {
        pregnancies: pregnancies,
        glucose: glucose,
        bloodPressure: bloodPressure,
        skinThickness: skinThickness,
        insulin: insulin,
        bmi: bmi,
        diabetesPedigree: diabetesPedigree,
        age: age
    };


    // Check data in browser console
    console.log("Patient Data:", patientData);


    /*
        TEMPORARY RESULT

        This is NOT our real ML prediction.

        Later:

        Frontend
            ↓
        FastAPI
            ↓
        Diabetes ML Model
            ↓
        Prediction Probability
            ↓
        Frontend
    */

    const probability = 72;


    // ---------- SHOW RESULT ----------

    const resultCard = document.getElementById("resultCard");

    resultCard.style.display = "block";


    // Probability

    document.getElementById("probabilityValue").textContent =
        probability + "%";


    // ---------- RISK LEVEL ----------

    let riskLevel;

    if (probability < 30) {

        riskLevel = "Low";

    } else if (probability < 70) {

        riskLevel = "Moderate";

    } else {

        riskLevel = "High";

    }


    document.getElementById("riskLevel").textContent =
        riskLevel;


    // ---------- RESULT MESSAGE ----------

    document.getElementById("resultMessage").textContent =
        `Based on the entered information, the predicted risk is ${riskLevel}.`;


    // Scroll to result

    resultCard.scrollIntoView({
        behavior: "smooth"
    });

});