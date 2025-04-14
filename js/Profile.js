document.addEventListener("DOMContentLoaded", async () => {
    console.log("Profile Script Loaded!");

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html"; // Redirect if not logged in
        return;
    }

    try {
        // Fetch user profile data
        const response = await fetch("http://localhost:5000/api/profile", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error("Failed to fetch profile data");
            window.location.href = "login.html"; // Redirect if unauthorized
            return;
        }

        const data = await response.json();

        if (data.fullName) {
            const firstName = data.fullName.split(" ")[0];
            document.getElementById("user-name").textContent =
            firstName.charAt(0).toUpperCase() + firstName.slice(1).toUpperCase();

            document.getElementById("full-name").textContent = data.fullName;
            document.getElementById("email").textContent = data.email;
            document.getElementById("phone").textContent = data.phone;
            document.getElementById("membership-type").textContent = data.membershipType;
            document.getElementById("membership-status").textContent = data.membershipStatus;
            document.getElementById("attendance").textContent = `${data.attendance} days`;

            let userAvatar = "images/default-avatar.png";

            if (data.avatar) {
                userAvatar = `http://localhost:5000/uploads/${data.avatar}`;
            } else {
                userAvatar = data.gender === "male" ? "images/girl-avatar.png" : "images/boy-avatar.png";
            }

            document.getElementById("user-avatar").src = userAvatar;
        } else {
            console.error("Error: Missing user data");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        window.location.href = "login.html"; // Redirect on failure
    }
});
