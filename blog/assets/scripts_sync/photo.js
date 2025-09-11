document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".lab-carousel .lab-image");
  const dots = document.querySelectorAll(".dots .dot");
  let idx = 0;

  function showSlide(i) {
    slides.forEach((img, n) => {
      img.style.opacity = n === i ? 1 : 0;
    });
    dots.forEach((dot, n) => {
      dot.classList.toggle("active", n === i);
    });
  }

  showSlide(idx);
  setInterval(() => {
    idx = (idx + 1) % slides.length;
    showSlide(idx);
  }, 5000);
});