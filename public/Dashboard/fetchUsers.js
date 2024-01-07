const fetchUsers = () => {
  const token = localStorage.getItem("token");

  return fetch("../api/users", {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return;
      }
    })
    .then((users) => {
      if (users) {
        // Display user cards
        const userContainer = document.querySelector(".user-list");
        userContainer.innerHTML = ``;

        users.forEach((user) => {
          const userCard = document.createElement("div");
          userCard.classList.add("user-card");
          userCard.classList.add("profile-card");
          userCard.id = user._id;

          userCard.innerHTML = `
          <h2>${user.name}</h2>
          <p>Email: ${user.email}</p>
          <p>Phone: ${user.phone}</p>
          <p class="modifyButton">Modify</p>
        `;

          userContainer.appendChild(userCard);
        });
      }
    })

    .catch((error) => console.error("Error fetching users:", error));
};
export default fetchUsers;
