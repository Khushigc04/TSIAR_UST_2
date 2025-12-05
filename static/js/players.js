document.addEventListener("DOMContentLoaded", () => {
  console.log("🎯 players.js loaded");

  // Load players from localStorage OR default 4 players
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
  const players = storedPlayers.length
    ? storedPlayers
    : [
        { name: "Rahul Sharma", sport: "Cricket", position: "Batsman", country: "India" },
        { name: "Elena Smith", sport: "Tennis", position: "Singles", country: "USA" },
        { name: "Carlos Mendes", sport: "Football", position: "Midfielder", country: "Brazil" },
        { name: "Yuki Tanaka", sport: "Badminton", position: "Doubles", country: "Japan" }
      ];

  let editIndex = null;

  const tableBody = document.getElementById("playersTableBody");
  const addPlayerBtn = document.getElementById("addPlayerBtn");
  const addPlayerModalElement = document.getElementById("addPlayerModal");
  const addPlayerForm = document.getElementById("addPlayerForm");
  const addPlayerModal = bootstrap.Modal.getOrCreateInstance(addPlayerModalElement);

  function saveToStorage() {
    localStorage.setItem("players", JSON.stringify(players));
  }

  function renderPlayers() {
    tableBody.innerHTML = "";
    players.forEach((player, index) => {
      tableBody.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
          <td>${index + 1}</td>
          <td>${player.name}</td>
          <td>${player.sport}</td>
          <td>${player.position}</td>
          <td>${player.country}</td>
          <td>
            <button class="btn btn-warning btn-sm edit-btn" data-index="${index}">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
          </td>
        </tr>
      `
      );
    });

    attachEditEvents();
    attachDeleteEvents();
  }

  renderPlayers();

  addPlayerBtn.addEventListener("click", () => {
    editIndex = null;
    addPlayerForm.reset();
    addPlayerModal.show();
  });

  addPlayerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newPlayer = {
      name: document.getElementById("name").value.trim(),
      sport: document.getElementById("sport").value.trim(),
      position: document.getElementById("position").value.trim(),
      country: document.getElementById("country").value.trim(),
    };

    if (editIndex === null) {
      players.push(newPlayer);
    } else {
      players[editIndex] = newPlayer;
    }

    saveToStorage();
    renderPlayers();
    addPlayerModal.hide();
  });

  function attachEditEvents() {
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        editIndex = btn.getAttribute("data-index");
        const player = players[editIndex];

        document.getElementById("name").value = player.name;
        document.getElementById("sport").value = player.sport;
        document.getElementById("position").value = player.position;
        document.getElementById("country").value = player.country;

        addPlayerModal.show();
      });
    });
  }

  function attachDeleteEvents() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        const confirmation = confirm(`Delete ${players[index].name}?`);
        if (!confirmation) return;
        players.splice(index, 1);
        saveToStorage();
        renderPlayers();
      });
    });
  }
});
