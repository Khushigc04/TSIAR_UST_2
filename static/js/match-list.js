document.addEventListener("DOMContentLoaded", () => {
  console.log("📋 match-list.js loaded");

  const upcomingContainer = document.getElementById("upcomingMatches");
  const liveContainer = document.getElementById("liveMatchesList");
  const finishedContainer = document.getElementById("finishedMatches");

  const matches = JSON.parse(localStorage.getItem("matches")) || [];
  const now = new Date();

  function formatDateTime(datetimeStr) {
    if (!datetimeStr) return { datePretty: "Not set", time24: "--:--", time12: "--:-- --" };

    const normalized = datetimeStr.replace("T", " "); // support older stored format
    const [datePart, timePart] = normalized.split(" ");
    if (!datePart || !timePart) {
      return { datePretty: normalized, time24: "--:--", time12: "--:-- --" };
    }

    const [year, month, day] = datePart.split("-");
    const [hStr, mStr] = timePart.split(":");
    const yearNum = Number(year);
    const monthNum = Number(month);
    const dayNum = Number(day);
    const hour24 = Number(hStr);
    const minute = Number(mStr);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const datePretty = `${months[monthNum - 1]} ${dayNum}, ${yearNum}`;

    const time24 = `${hStr.padStart(2, "0")}:${mStr.padStart(2, "0")}`;

    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    const time12 = `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm}`;

    return { datePretty, time24, time12 };
  }

  function determineCategory(match) {
    if (!match.datetime) return "upcoming";

    const normalized = match.datetime.replace(" ", "T");
    const dt = new Date(normalized);
    if (isNaN(dt.getTime())) return "upcoming";

    if (dt > now) {
      return "upcoming";
    } else if (match.status === "live") {
      return "live";
    } else {
      return "finished";
    }
  }

  function createCard(match, index, category) {
    const { datePretty, time24, time12 } = formatDateTime(match.datetime || "");
    const statusBadge =
      category === "live"
        ? `<span class="badge bg-danger ms-2">LIVE</span>`
        : category === "upcoming"
        ? `<span class="badge bg-warning text-dark ms-2">UPCOMING</span>`
        : `<span class="badge bg-success ms-2">FINISHED</span>`;

    return `
      <div class="match-card p-3 border border-warning rounded">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="mb-0">
            ${match.sport || "Match"} — ${match.team1 || "Team 1"} vs ${match.team2 || "Team 2"}
            ${statusBadge}
          </h5>
          <small class="text-muted">#${index + 1}</small>
        </div>
        <p class="mb-1"><strong>Venue:</strong> ${match.venue || "Not set"}</p>
        <p class="mb-1">
          <strong>Date:</strong> ${datePretty}
        </p>
        <p class="mb-0">
          <strong>Time:</strong> ${time24} <span class="text-muted">(${time12})</span>
        </p>
      </div>
    `;
  }

  function render() {
    upcomingContainer.innerHTML = "";
    liveContainer.innerHTML = "";
    finishedContainer.innerHTML = "";

    if (!matches.length) {
      upcomingContainer.innerHTML =
        `<p class="text-muted fst-italic">No matches found. Go to Match Center to add matches.</p>`;
      liveContainer.innerHTML =
        `<p class="text-muted fst-italic">No live matches at the moment.</p>`;
      finishedContainer.innerHTML =
        `<p class="text-muted fst-italic">No finished matches yet.</p>`;
      return;
    }

    let hasUpcoming = false;
    let hasLive = false;
    let hasFinished = false;

    matches.forEach((m, i) => {
      const cat = determineCategory(m);

      if (cat === "upcoming") {
        upcomingContainer.insertAdjacentHTML("beforeend", createCard(m, i, cat));
        hasUpcoming = true;
      } else if (cat === "live") {
        liveContainer.insertAdjacentHTML("beforeend", createCard(m, i, cat));
        hasLive = true;
      } else {
        finishedContainer.insertAdjacentHTML("beforeend", createCard(m, i, cat));
        hasFinished = true;
      }
    });

    if (!hasUpcoming) {
      upcomingContainer.innerHTML =
        `<p class="text-muted fst-italic">No upcoming matches scheduled.</p>`;
    }
    if (!hasLive) {
      liveContainer.innerHTML =
        `<p class="text-muted fst-italic">No live matches right now.</p>`;
    }
    if (!hasFinished) {
      finishedContainer.innerHTML =
        `<p class="text-muted fst-italic">No finished matches recorded yet.</p>`;
    }
  }

  render();
});
