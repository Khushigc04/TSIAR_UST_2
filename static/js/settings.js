document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ settings.js connected");

  const form = document.getElementById('settingsForm');
  const themeSelect = document.getElementById('themeSelect');
  const notificationsToggle = document.getElementById('notificationsToggle');

  // Load saved settings from localStorage
  const savedTheme = localStorage.getItem('themeColor') || 'primary';
  const savedNotifications = localStorage.getItem('notifications') === 'true';

  themeSelect.value = savedTheme;
  notificationsToggle.checked = savedNotifications;
  applyTheme(savedTheme);

  // When user saves the form
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedTheme = themeSelect.value;
    const notificationsEnabled = notificationsToggle.checked;

    // Save to localStorage
    localStorage.setItem('themeColor', selectedTheme);
    localStorage.setItem('notifications', notificationsEnabled);

    applyTheme(selectedTheme);

    alert("✅ Settings saved successfully!");
  });

  // Apply selected theme by updating navbar/footer color
  function applyTheme(theme) {
    document.querySelectorAll('.navbar, footer').forEach(el => {
      el.className = el.className.replace(/bg-\w+/g, '');
      el.classList.add(`bg-${theme}`);
    });
  }
});
