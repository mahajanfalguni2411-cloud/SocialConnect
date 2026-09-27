const API_URL = "http://localhost:5000";

const token = localStorage.getItem("token");


// =====================================
// CHECK LOGIN
// =====================================

if (!token) {

    window.location.href = "login.html";

}


// =====================================
// LOAD PROFILE
// =====================================

async function loadProfile() {

    try {

        const response = await fetch(
            `${API_URL}/api/auth/profile`,
            {
                method: "GET",

                headers: {
                    token: token
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        document.getElementById("profileName").value =
            data.name;

        document.getElementById("profileEmail").value =
            data.email;

        document.getElementById("profileBio").value =
            data.bio || "";

    } catch (error) {

        console.error("Profile error:", error);

        alert("Unable to load profile.");
    }
}


// =====================================
// UPDATE PROFILE
// =====================================

async function updateProfile() {

    const name =
        document.getElementById("profileName").value;

    const bio =
        document.getElementById("profileBio").value;

    const message =
        document.getElementById("profileMessage");

    try {

        const response = await fetch(
            `${API_URL}/api/auth/profile`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    token: token,
                    name: name,
                    bio: bio
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            message.textContent =
                "Profile updated successfully! ✅";

        } else {

            message.textContent =
                data.message || "Update failed.";
        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to server.";
    }
}


// =====================================
// HOME
// =====================================

function goHome() {

    window.location.href = "index.html";

}


// =====================================
// LOGOUT
// =====================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";
}


// =====================================
// LOAD PROFILE
// =====================================

loadProfile();