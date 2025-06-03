document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav ul li a");
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  const body = document.body;

  // Firebase Configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD4d93ABAaV4dikgtjLmz7k4Vx6-JUChGs",
    authDomain: "nif4erasmus-3fb80.firebaseapp.com",
    projectId: "nif4erasmus-3fb80",
    storageBucket: "nif4erasmus-3fb80.firebasestorage.app",
    messagingSenderId: "53708558332",
    appId: "1:53708558332:web:fbf84088da99ffdfacec79",
    measurementId: "G-5GFPK7SM1T",
  };

  // Initialize Firebase

  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage();

  let lastKnownScrollY = window.scrollY;
  let ticking = false;
  let scrollPosition = 0;

  // Initialize EmailJS
  (function () {
    emailjs.init("B_OgUkgT3w8lysw_g");
  })();

  // Update the uploadFile function to use the storage reference
  async function uploadFile(file, path) {
    try {
      // Add metadata to track uploads
      const metadata = {
        customMetadata: {
          uploadTime: new Date().toISOString(),
          fileType: file.type,
        },
      };

      const storageRef = storage.ref(path);
      const snapshot = await storageRef.put(file, metadata);
      return await snapshot.ref.getDownloadURL();
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

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

  function lockScroll() {
    // Store current scroll position
    scrollPosition = window.pageYOffset;
    // Add styles to lock the body
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollPosition}px`;
    body.style.width = "100%";
  }

  function unlockScroll() {
    // Remove scroll lock styles
    body.style.removeProperty("overflow");
    body.style.removeProperty("position");
    body.style.removeProperty("top");
    body.style.removeProperty("width");
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
  }

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");
    body.classList.toggle("no-scroll");

    if (nav.classList.contains("active")) {
      lockScroll();
    } else {
      unlockScroll();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      nav.classList.remove("active");
      document.body.classList.remove("no-scroll");
      unlockScroll();
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !hamburger.contains(event.target) &&
      !nav.contains(event.target) &&
      nav.classList.contains("active")
    ) {
      hamburger.classList.remove("active");
      nav.classList.remove("active");
      document.body.classList.remove("no-scroll");
      unlockScroll();
    }
  });

  // FAQ Toggle functionality
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;
      const isOpen = answer.classList.contains("open");

      // Close all answers first
      document.querySelectorAll(".faq-answer").forEach((a) => {
        a.classList.remove("open");
      });
      document.querySelectorAll(".faq-question").forEach((q) => {
        q.classList.remove("active");
      });

      // Toggle current answer if it wasn't open
      if (!isOpen) {
        answer.classList.add("open");
        button.classList.add("active");
      }
    });
  });

  // Form submission handler
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Verify reCAPTCHA
      const recaptchaResponse = grecaptcha.getResponse();
      if (!recaptchaResponse) {
        document.getElementById("form-status").textContent =
          "Please verify that you are not a robot.";
        document.getElementById("form-status").className = "form-status error";
        return;
      }

      // Get form data
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
        submitTime: new Date().toLocaleString(),
      };

      // Show loading status
      document.getElementById("form-status").textContent = "Sending...";
      document.getElementById("form-status").className = "form-status sending";

      // Send email using EmailJS
      // Replace with your service ID and template ID
      emailjs.send("service_4ekh8ho", "template_00yzatn", formData).then(
        function (response) {
          document.getElementById("form-status").textContent =
            "Message sent successfully!";
          document.getElementById("form-status").className =
            "form-status success";
          contactForm.reset();
          grecaptcha.reset();
        },
        function (error) {
          document.getElementById("form-status").textContent =
            "Failed to send message. Please try again.";
          document.getElementById("form-status").className =
            "form-status error";
          console.error("EmailJS error:", error);
        }
      );
    });
  }

  // Personal Info form handler
  const personalInfoForm = document.getElementById("personalInfoForm");

  if (personalInfoForm) {
    personalInfoForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector(".submit-btn");
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;

      try {
        const formData = new FormData(this);

        // Upload files first
        const idCard = formData.get("idCard");
        const proofOfAddress = formData.get("proofOfAddress");

        const idCardURL = await uploadFile(
          idCard,
          `documents/${formData.get("email")}/id-card-${Date.now()}`
        );

        const proofOfAddressURL = await uploadFile(
          proofOfAddress,
          `documents/${formData.get("email")}/proof-address-${Date.now()}`
        );

        const formDataObject = {
          personalDetails: {
            fullName: formData.get("fullName"),
            dateOfBirth: formData.get("dateOfBirth"),
            nationality: formData.get("nationality"),
            idCard: idCardURL,
          },
          addressInformation: {
            address: formData.get("address"),
            zipCode: formData.get("zipCode"),
            city: formData.get("city"),
            country: formData.get("country"),
            proofOfAddress: proofOfAddressURL,
          },
          contactInformation: {
            email: formData.get("email"),
            whatsapp: formData.get("whatsapp") || "Not provided",
          },
          submitTime: new Date().toLocaleString(),
        };

        // Send email with download URLs
        await emailjs.send(
          "service_4ekh8ho",
          "template_p42864p",
          formDataObject
        );

        alert("Form submitted successfully! We will contact you soon.");
        personalInfoForm.reset();
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      } finally {
        submitBtn.textContent = "Submit Application";
        submitBtn.disabled = false;
      }
    });
  }

  // Initialize phone input
  // Contact form handling - Only run if elements exist
  const callbackPhone = document.querySelector("#callback-phone");
  const contactBtn = document.querySelector(".contact-btn");

  if (callbackPhone && contactBtn) {
    const phoneInput = window.intlTelInput(
      document.querySelector("#callback-phone"),
      {
        preferredCountries: ["pt", "es", "fr", "de", "it"],
        initialCountry: "pt",
        separateDialCode: true,
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      }
    );

    // Create error message element
    let errorMsg = document.querySelector(".phone-input .phone-error-msg");
    if (!errorMsg) {
      // Only create if it doesn't exist
      errorMsg = document.createElement("div");
      errorMsg.className = "phone-error-msg";
      document.querySelector(".phone-input").appendChild(errorMsg);
    }
    errorMsg.style.display = "none";

    // Replace the error messages with more professional ones
    const errorMap = [
      "Please enter a complete phone number",
      "This country code is not valid",
      "Phone number is too short",
      "Phone number is too long",
      "Please enter a valid phone number for this country",
    ];

    // Validation function
    const validatePhoneNumber = () => {
      const phoneField = document.querySelector("#callback-phone");
      phoneField.classList.remove("error", "valid");
      errorMsg.style.display = "none";

      if (phoneField.value.trim()) {
        if (phoneInput.isValidNumber()) {
          phoneField.classList.add("valid");
          return true;
        } else {
          phoneField.classList.add("error");
          const errorCode = phoneInput.getValidationError();
          errorMsg.textContent =
            errorMap[errorCode] || "Please provide a valid phone number";
          errorMsg.style.display = "block";
        }
      }
      return false;
    };

    // Add validation on input
    document
      .querySelector("#callback-phone")
      .addEventListener("input", validatePhoneNumber);
    document
      .querySelector("#callback-phone")
      .addEventListener("blur", validatePhoneNumber);

    // Validate phone number on form submit
    const contactButton = document.querySelector(".contact-btn");
    if (contactButton) {
      contactButton.addEventListener("click", function () {
        if (validatePhoneNumber()) {
          const fullNumber = phoneInput.getNumber();

          // Show loading state
          this.textContent = "Sending...";
          this.disabled = true;

          // Send email using EmailJS
          emailjs
            .send(
              "service_4ekh8ho", // Your service ID
              "template_00yzatn", // Replace with your template ID from EmailJS
              {
                email: fullNumber,
                name: "Callback Request",
                message: "Please contact me via WhatsApp.",
                submitTime: new Date().toLocaleString(),
              }
            )
            .then(
              (response) => {
                // Success
                alert("Thank you! We'll contact you soon via WhatsApp.");
                document.querySelector("#callback-phone").value = "";
                this.textContent = "Contact me";
                this.disabled = false;
              },
              (error) => {
                // Error
                alert("Sorry, there was an error. Please try again.");
                console.error("EmailJS error:", error);
                this.textContent = "Contact me";
                this.disabled = false;
              }
            );
        }
      });
    }
  }
});
