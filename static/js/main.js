document.addEventListener("DOMContentLoaded", () => {
  const players = JSON.parse(localStorage.getItem("players")) || [];
  const matches = JSON.parse(localStorage.getItem("matches")) || [];

  document.getElementById("totalPlayers").textContent = players.length;
  document.getElementById("totalMatches").textContent = matches.length;

  const now = new Date();
  const liveCount = matches.filter(m => {
    if (!m.datetime) return m.status === "live";
    const dt = new Date(m.datetime.replace(" ", "T"));
    if (isNaN(dt.getTime())) return m.status === "live";
    return dt <= now && m.status === "live";
  }).length;

  document.getElementById("liveMatches").textContent = liveCount;
});
