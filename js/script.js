// ✅ Navbar Toggle
document.addEventListener("DOMContentLoaded", () => {
    let menu = document.querySelector("#menu-btn");
    let navbar = document.querySelector(".header .navbar");

    menu.addEventListener("click", () => {
        menu.classList.toggle("fa-times");
        navbar.classList.toggle("active");
    });

    window.addEventListener("scroll", () => {
        menu.classList.remove("fa-times");
        navbar.classList.remove("active");
    });

    // ✅ Initialize Swiper for home section slider
    var swiper = new Swiper(".home-slider", {
        spaceBetween: 20,
        effect: "fade",
        grabCursor: true,
        loop: true,
        centeredSlides: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    // ✅ Fetch and display user details in navbar
    fetchUserData();
});

async function fetchUserData() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await fetch("http://localhost:5000/api/profile", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return;

        const data = await response.json();

        if (data.fullName) {
            const userName = data.fullName;
            const userGender = data.gender;
            let userAvatar = "images/default-avatar.png";

            if (data.avatar) {
                userAvatar = `http://localhost:5000/uploads/${data.avatar}`;
            } else if (userGender === "male") {
                userAvatar = "images/boy-avatar.png";
            } else if (userGender === "female") {
                userAvatar = "images/girl-avatar.png";
            }

            document.getElementById("user-avatar").src = userAvatar;
            document.getElementById("user-name").textContent = userName;
            document.getElementById("user-info").style.display = "flex";
            document.getElementById("login-link").style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}
