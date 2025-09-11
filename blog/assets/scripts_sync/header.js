document.addEventListener("DOMContentLoaded", function() {
  // Check if we're in a subdirectory (like /blog/ or /blog/post-name/)
  const pathDepth = window.location.pathname.split('/').filter(p => p).length;
  const headerPath = '../'.repeat(pathDepth) + 'header.html';
  
  fetch(headerPath)
  .then(response => response.text())
  .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
      
      // Update navigation links based on path depth
      updateNavLinks(pathDepth);

      // After the header is inserted, find and highlight the active link
      highlightActiveLink();
  });
});

function updateNavLinks(pathDepth) {
  const navLinks = document.querySelectorAll("nav a");
  const prefix = '../'.repeat(pathDepth);
  
  navLinks.forEach(link => {
      const href = link.getAttribute("href");
      // Only update relative links (not starting with http:// or https:// or /)
      if (href && !href.startsWith('http') && !href.startsWith('/')) {
          link.setAttribute("href", prefix + href);
      }
  });
}

function highlightActiveLink() {
  const navLinks = document.querySelectorAll("nav a");
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      
      // Check if we're on the linked page or in its directory
      if (currentPath === linkPath || 
          (linkPath.endsWith('/') && currentPath.startsWith(linkPath)) ||
          (currentPath === '/' && linkPath.endsWith('index.html'))) {
          link.classList.add("active-link");
      }
  });
}