document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".registration-form");

  if (!form) {
      console.error("❌ Registration form not found! Check class name or script position.");
      return;
  }

  form.addEventListener("submit", async function (event) {
      event.preventDefault();

      // ✅ Get form values
      const fname = document.getElementById("fname").value.trim();
      const lname = document.getElementById("lname").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const phoneNumber = document.getElementById("phoneNumber").value.trim();
      const zipcode = document.getElementById("zipcode").value.trim();
      const gender = document.querySelector('input[name="gender"]:checked')?.value;

      // ✅ Validation
      if (!fname || !lname || !email || !password || !phoneNumber || !zipcode || !gender) {
          alert("⚠️ All fields are required!");
          return;
      }

      // ✅ Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          alert("⚠️ Please enter a valid email address!");
          return;
      }

      // ✅ Password validation (at least 6 characters)
      if (password.length < 6) {
          alert("⚠️ Password must be at least 6 characters long!");
          return;
      }

      // ✅ Phone number validation (digits only, 10-15 characters)
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(phoneNumber)) {
          alert("⚠️ Enter a valid phone number (10-15 digits)!");
          return;
      }

      // ✅ Send data to backend
      try {
          const response = await fetch("http://localhost:5000/api/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fname, lname, email, password, phoneNumber, zipcode, gender })
          });

          const data = await response.json();

          if (response.ok) {
              alert("✅ Registration successful!");
              window.location.href = "login.html"; // Redirect to login page
          } else {
              alert(`❌ Error: ${data.error}`);
          }
      } catch (error) {
          console.error("❌ Registration failed:", error);
          alert("⚠️ Something went wrong. Please try again later.");
      }
  });
});
