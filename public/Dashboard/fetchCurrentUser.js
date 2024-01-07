const fetchCurrentUser = () => {
  const token = localStorage.getItem("token");

  fetch(`../api/user`, {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        // Throw an error for 4xx and 5xx HTTP statuses
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.user) {
        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const profile = document.querySelector(".profile-container");
        const profilePictureElement = document.getElementById("profilePicture");
        if (data.user.profilePicture) {
          profilePictureElement.src = `data:image;base64,${data.user.profilePicture}`;
          profilePictureElement.alt = "Profile Picture";
        } else {
          profilePictureElement.style.display = "none";
        }

        name.textContent = data.user.name;
        email.textContent = data.user.email;
        phone.textContent = data.user.phone;
        profile.id = data.user._id;
      }
    })
    .catch((err) => {
      window.location.href = "/";
    });
};

export default fetchCurrentUser;
