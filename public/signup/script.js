// Add user
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("signupForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;
      const userData = {
        name: name,
        email: email,
        phone: phone,
        password: password,
      };

      // Send user data to the backend using fetch
      fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.token) {
            // Store the token (e.g., in localStorage or cookies)
            localStorage.setItem("token", data.token);
            // Redirect to the dashboard or load user profile
            // For simplicity, just show a success message here

            window.location.href = "/dashboard";
          } else {
            // Handle signup failure
            alert("Signup failed. Please try again.");
          }
        })
        .catch((error) => console.error("Error:", error));
    });
});
