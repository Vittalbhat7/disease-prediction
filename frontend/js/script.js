function openDiabetes() {

    const nameInput = document.getElementById("username");

    const name = nameInput.value.trim();


    // Check if name is entered
    if (name === "") {

        alert("Please enter your name first.");

        nameInput.focus();

        return;
    }


    // Save the name in browser storage
    localStorage.setItem("userName", name);


    // Open Diabetes page
    window.location.href = "diabetes.html";
}