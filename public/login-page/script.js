const submitLoginForm = async (event) => {
    event.preventDefault();

    const loginName = document.getElementById("loginName").value;
    const loginPassword = document.getElementById("loginPassword").value;

    const userData = {
        username: loginName,
        password: loginPassword
    };


    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }

        const responseData = await response.json();
        const { token, redirectUrl } = responseData;

        // Store token in localStorage
        localStorage.setItem('userData', JSON.stringify({ name: loginName }));


        // Redirect to the home page
        window.location.href = "../home-page/home.html"

    } catch (error) {
        alert(error.message);
    }
};
