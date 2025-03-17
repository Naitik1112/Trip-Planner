/*eslint-disable*/
document.addEventListener('DOMContentLoaded', () => {
  const userDropdown = document.getElementById('userDropdown');
  const dropdownMenu = document.getElementById('dropdownMenu');

  userDropdown.addEventListener('click', event => {
    event.stopPropagation(); // Prevents clicking from closing immediately
    dropdownMenu.style.display =
      dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });

  // Hide dropdown if clicking outside
  document.addEventListener('click', event => {
    if (
      !userDropdown.contains(event.target) &&
      !dropdownMenu.contains(event.target)
    ) {
      dropdownMenu.style.display = 'none';
    }
  });
});
