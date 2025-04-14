document.addEventListener("DOMContentLoaded", async () => {
    console.log("Script Loaded!");

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/profile", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error("Failed to fetch profile data");
            window.location.href = "login.html";
            return;
        }

        const data = await response.json();
        if (data.error) {
            console.error("Error fetching user data:", data.error);
            window.location.href = "login.html";
            return;
        }

        // ✅ Display user info in navbar
        const userName = data.fullName;
        let userAvatar = "images/default-avatar.png";

        if (data.avatar) {
            userAvatar = `http://localhost:5000/uploads/${data.avatar}`;
        } else {
            userAvatar = data.gender === "male" ? "images/girl-avatar.png" : "images/boy-avatar.png";
        }

        const userInfoContainer = document.getElementById("user-info");
        userInfoContainer.innerHTML = `
            <div class="nav-user">
                <img id="user-avatar" src="${userAvatar}" alt="User Avatar" class="avatar">
                <a id="user-name" href="profile.html">${userName}</a>
            </div>
        `;

    } catch (error) {
        console.error("Error fetching user data:", error);
        window.location.href = "login.html";
    }
});

// ✅ Logout Function
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});
