document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav ul li a");
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  const body = document.body;

  let lastKnownScrollY = window.scrollY;
  let ticking = false;
  let scrollPosition = 0;
  

  // Function to update the active link based on the current URL or hash
  function updateActiveLink() {
    const currentPath = window.location.pathname; // Get the current page path
    const currentHash = window.location.hash; // Get the current hash (e.g., #services)

    navLinks.forEach((link) => {
      const linkPath = link.getAttribute("href");

      // Check if the link matches the current path or hash
      if (
        currentPath.includes(linkPath) || // Match for page links
        (linkPath.startsWith("#") && linkPath === currentHash) // Match for hash links
      ) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
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

  // Update active link on hash change (for in-page navigation)
  window.addEventListener("hashchange", updateActiveLink);

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

/*   function lockScroll() {
    // Store current scroll position
    scrollPosition = window.pageYOffset;
    // Add styles to lock the body
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollPosition}px`;
    body.style.width = '100%';
  }
  
  function unlockScroll() {
    // Remove scroll lock styles
    body.style.removeProperty('overflow');
    body.style.removeProperty('position');
    body.style.removeProperty('top');
    body.style.removeProperty('width');
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
  }
  
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    body.classList.toggle('no-scroll');

    if (nav.classList.contains('active')) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }); */
  
/*   navLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
       document.body.classList.remove("no-scroll");
      unlockScroll();
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!hamburger.contains(event.target) && !nav.contains(event.target) && nav.classList.contains('active')) {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      document.body.classList.remove("no-scroll");
      unlockScroll();
    }
  }); */

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const isOpen = answer.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));

      // Toggle current
      if (!isOpen) {
        answer.classList.add('open');
        button.classList.add('active');
      }
    });
  });
  
});
