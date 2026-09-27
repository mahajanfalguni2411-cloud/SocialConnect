const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            message.textContent = "Registration successful! 🎉";

            registerForm.reset();

        } else {

            message.textContent = data.message;

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to server.";

    }

});