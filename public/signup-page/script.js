const submitForm = (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const month = document.getElementById("month");
    const monthValue = month.options[month.selectedIndex].value;
    const day = document.getElementById("day").value;
    const year = document.getElementById("year").value;
    const gender = document.getElementById("gender");
    const genderValue = gender.options[gender.selectedIndex].value;
    const agree = document.getElementById("agree").checked

    if(name.length < 2){
        alert("Name must be at least 2 character");
    } else if(password != confirmPassword || password.length < 8){
        alert("Password must be at least 8 character and need to be the same as confirm password")
    } else if(monthValue == "month" || day == "" || year == ""){
        alert("Please fill out your date of birth")
    } else if(genderValue == "gender"){
        alert("Please select a gender")
    } else if(!agree){
        alert("Please agree with our terms and condition by checking the box")
    } else {

        const userData = {
            name: name,
            password: password,
            // Add other user data properties as needed
        };

        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(userData));

        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Registration successful:", data);
            // Redirect to login page or show a success message
            window.location.href = "../login page/login.html";
        })
        .catch((error) => {
            console.error("Error during registration:", error);
            // Handle error (e.g., display error message to user)
        });
        
        window.location.href = "../login-page/login.html"
    }

}