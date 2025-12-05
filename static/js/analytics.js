document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ analytics.js connected");

  // Chart 1: Players by Sport
  const ctx1 = document.getElementById('playersChart').getContext('2d');
  const playersChart = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['Cricket', 'Football', 'Tennis', 'Badminton', 'Hockey'],
      datasets: [{
        label: 'Number of Players',
        data: [10, 8, 6, 4, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Chart 2: Match Results
  const ctx2 = document.getElementById('matchesChart').getContext('2d');
  const matchesChart = new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: ['Wins', 'Losses', 'Draws'],
      datasets: [{
        label: 'Match Outcomes',
        data: [18, 9, 3],
        borderWidth: 1
      }]
    }
  });
});
