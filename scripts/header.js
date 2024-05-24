document.addEventListener("DOMContentLoaded", function() {
  fetch('header.html')
  .then(response => response.text())
  .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;

      // After the header is inserted, find and highlight the active link
      highlightActiveLink();
  });
});

function highlightActiveLink() {
  const navLinks = document.querySelectorAll("nav a");
  const currentPath = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
      const linkPath = link.getAttribute("href").split("/").pop();

      if (linkPath === currentPath) {
          link.classList.add("active-link");
      }
  });
}