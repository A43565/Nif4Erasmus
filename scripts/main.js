document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav ul li a");
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");

  let lastKnownScrollY = window.scrollY;
  let ticking = false;

  // ✅ Update active nav link based on scroll position
  function updateActiveLink() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 160; // Adjust if header changes
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }

  // ✅ Scroll event handler (optimized)
  function onScroll() {
    lastKnownScrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveLink();
        ticking = false;
      });

      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll);
  updateActiveLink(); // On load

  // ✅ Smooth scroll fallback for older browsers (optional)
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        // Optional: fallback if smooth behavior not supported
        if (!("scrollBehavior" in document.documentElement.style)) {
          e.preventDefault();
          window.scrollTo({
            top: target.offsetTop - 140, // Adjust if needed
            behavior: "smooth",
          });
        }

        // Immediate active class (optional)
        navLinks.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      }
    });
  });

  // ✅ Mobile menu toggle
  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");
  });


  // ✅ Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!hamburger.contains(event.target) && !nav.contains(event.target)) {
      hamburger.classList.remove("active");
      nav.classList.remove("active");
    }
  });
});
