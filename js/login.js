document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelector(".forms"),
      pwShowHide = document.querySelectorAll(".eye-icon"),
      links = document.querySelectorAll(".link"),
      loginForm = document.getElementById("login-form"),
      errorMessage = document.getElementById("error-message");

  // ✅ **Show/Hide Password**
  pwShowHide.forEach(eyeIcon => {
      eyeIcon.addEventListener("click", () => {
          let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
          pwFields.forEach(password => {
              if (password.type === "password") {
                  password.type = "text";
                  eyeIcon.classList.replace("bx-hide", "bx-show");
              } else {
                  password.type = "password";
                  eyeIcon.classList.replace("bx-show", "bx-hide");
              }
          });
      });
  });

  // ✅ **Toggle Signup/Login Forms**
  links.forEach(link => {
      link.addEventListener("click", e => {
          e.preventDefault();
          forms.classList.toggle("show-signup");
      });
  });

  // ✅ **Handle Login Form Submission**
  if (loginForm) {
      loginForm.addEventListener("submit", async function (event) {
          event.preventDefault();

          const email = document.getElementById("email").value.trim();
          const password = document.getElementById("password").value.trim();

          // **Validation**
          if (!email || !password) {
              errorMessage.textContent = "All fields are required!";
              errorMessage.style.color = "red";
              return;
          }

          // **Email Format Validation**
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
              errorMessage.textContent = "Please enter a valid email address!";
              errorMessage.style.color = "red";
              return;
          }

          try {
              // ✅ **Send Login Request to Backend**
              const response = await fetch("http://localhost:5000/api/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, password })
              });

              const data = await response.json();

              if (response.ok) {
                  console.log("✅ Login Successful:", data);

                  // ✅ **Store token and user details in localStorage**
                  localStorage.setItem("token", data.token);
                  localStorage.setItem("user", JSON.stringify(data.user));

                  alert("Login successful!");
                  window.location.href = "index.html"; // Redirect to the main gym website
              } else {
                  errorMessage.textContent = data.error;
                  errorMessage.style.color = "red";
              }
          } catch (error) {
              console.error("❌ Error:", error);
              errorMessage.textContent = "Something went wrong. Please try again later.";
              errorMessage.style.color = "red";
          }
      });
  } else {
      console.error("❌ Login form not found!");
  }
});
