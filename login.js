const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            message.textContent = "Login successful! 🎉";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } else {

            message.textContent = data.message;

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to server.";

    }

});