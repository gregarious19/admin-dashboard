import fetchUsers from "./fetchUsers.js";
import fetchCurrentUser from "./fetchCurrentUser.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  console.log(token);

  if (token) {
    // fetch current user
    fetchCurrentUser();
    // Update Profile Picture
    const openProfilePictureFormButton = document.getElementById(
      "openProfilePictureForm"
    );
    openProfilePictureFormButton.addEventListener("click", function () {
      // Toggle the display of the profile picture update form
      const uploadModal = document.getElementById("uploadProfilePictureModal");
      uploadModal.style.display = "block";
    });
    const closeProfilePictureModalButton = document.getElementById(
      "closeProfilePictureModal"
    );

    closeProfilePictureModalButton.addEventListener("click", () => {
      const uploadModal = document.getElementById("uploadProfilePictureModal");
      uploadModal.style.display = "none";
    });

    document
      .getElementById("uploadProfilePictureForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();

        const profilePicture =
          document.getElementById("newProfilePicture").files[0];

        const formData = new FormData();
        formData.append("profilePicture", profilePicture);

        fetch(`../api/profile-picture`, {
          headers: {
            Authorization: token,
          },
          method: "PUT",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Response from server:", data);
            // Refresh the page or update the UI as needed
          })
          .catch((error) => console.error("Error:", error));
        const uploadModal = document.getElementById(
          "uploadProfilePictureModal"
        );
        uploadModal.style.display = "none";
        fetchCurrentUser();
      });

    // fetch current user

    const changeNameModal = document.getElementById("changeNameModal");
    const changeNameForm = document.getElementById("changeNameForm");

    // Open modal function
    const openModal = () => {
      changeNameModal.style.display = "block";
    };

    // Close modal function
    const closeModal = () => {
      changeNameModal.style.display = "none";
    };

    // Event listener for opening the modal
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("edit-button")) {
        openModal();
      }
    });

    // Event listener for closing the modal
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("close")) {
        closeModal();
      }
    });

    // Event listener for submitting the form
    changeNameForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("name");

      // Get the new name from the form
      const newName = document.getElementById("newName").value;
      name.textContent = newName;

      // Rename User
      fetch(`../api/user/${name.id}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ name: newName }),
      })
        .then((response) => {
          if (!response.ok) {
            // Throw an error for 4xx and 5xx HTTP statuses
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
        });

      // Close the modal
      closeModal();
    });

    function logout() {
      // Clear the authentication token from localStorage
      localStorage.removeItem("token");

      // Redirect to the login or signup page
      window.location.href = "/login"; // Update with your login/signup page URL
    }
    document.getElementById("logoutButton").addEventListener("click", logout);

    const changePasswordButton = document.querySelector(
      ".change-password-button"
    );
    const changePasswordModal = document.getElementById("changePasswordModal");

    changePasswordButton.addEventListener("click", () => {
      changePasswordModal.style.display = "block";
    });

    const closeButton = document.getElementById("closeModal");
    closeButton.addEventListener("click", () => {
      changePasswordModal.style.display = "none";
    });

    // -------Change Password-------------LOGIC-------->>>>>>>>>>>>>>
    const changePasswordForm = document.getElementById("changePasswordForm");

    changePasswordForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Get form values
      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmNewPassword =
        document.getElementById("confirmNewPassword").value;

      // Perform client-side validation
      if (newPassword !== confirmNewPassword) {
        alert("New password and confirm password must match.");
        return;
      }

      // Add logic to send a request to the server to change the password
      try {
        const token = localStorage.getItem("token");

        const response = fetch("../api/change-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            return data;
          })
          .catch((err) => {
            throw new Error(`Error: ${response.status} - ${errorMessage}`);
          });

        // Password changed successfully
        alert("Password changed successfully.");
        changePasswordModal.style.display = "none";
        console.log(response);
      } catch (error) {
        console.error("Error changing password:", error.message);
        alert("Error changing password. Please try again.");
      }
    });

    fetchUsers();

    // Event listener for "Modify" button
    const modifyUserModal = document.getElementById("modifyUserModal");
    const updateUserForm = document.getElementById("updateUserForm");
    const deleteUserForm = document.getElementById("deleteUserForm");
    const userContainer = document.querySelector(".user-list");
    const closeModifyUserModalButton = document.getElementById(
      "closeModifyUserModal"
    );
    let userId;

    closeModifyUserModalButton.addEventListener("click", () => {
      modifyUserModal.style.display = "none";
    });

    updateUserForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("newUserName").value;
      const password = document.getElementById("newUserPassword").value;
      console.log({ name, password });
      fetch(`../api/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        method: "PUT",
        body: JSON.stringify({ name, password }),
      })
        .then((response) => {
          if (!response.ok) {
            // Throw an error for 4xx and 5xx HTTP statuses
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message);
        })
        .catch((err) => {
          alert(err);
        });
      fetchUsers();
      closeModifyUserModal();
    });
    userContainer.addEventListener("click", (event) => {
      const modifyButton = event.target.closest(".modifyButton");
      if (modifyButton) {
        const userCard = modifyButton.closest(".user-card");
        userId = userCard.id;
      }

      openModifyUserModal();
    });

    // Event listener for updating a user

    // Event listener for deleting a user
    deleteUserForm.addEventListener("submit", (event) => {
      event.preventDefault();
      fetch(`../api/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            // Throw an error for 4xx and 5xx HTTP statuses
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message);
        })
        .catch((err) => {
          alert(err);
        });
      fetchUsers();
      closeModifyUserModal();

      closeModifyUserModal();
    });

    // Function to open the "Modify User" modal

    function openModifyUserModal() {
      modifyUserModal.style.display = "block";
    }
    function closeModifyUserModal() {
      // Reset the form fields
      updateUserForm.reset();
      // Hide the modal
      modifyUserModal.style.display = "none";
    }
  } else {
    window.location.href = "/";
  }
});
