// login.js
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const response = await fetch("../api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, currentPassword: password }),
      });
      console.log(response);
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error || "Login failed");
      }

      const { token, user } = await response.json();

      // Store the token in local storage for future requests
      localStorage.setItem("token", token);

      // Redirect to the dashboard or perform other actions as needed
      console.log("Login successful! User:", user);
      window.location.href = "/dashboard"; // Update with your dashboard URL
    } catch (error) {
      console.error("Login error:", error.message);
      // Handle and display the error to the user
    }
  });
});
