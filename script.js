(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", function (event) {
      const clickInsideNav = navLinks.contains(event.target) || navToggle.contains(event.target);
      if (!clickInsideNav) {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        filterButtons.forEach(function (b) {
          b.classList.remove("active");
        });
        button.classList.add("active");

        const filter = button.dataset.filter;
        galleryItems.forEach(function (item) {
          const category = item.dataset.category;
          const visible = filter === "all" || category === filter;
          item.style.display = visible ? "block" : "none";
        });
      });
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const success = document.getElementById("formSuccess");

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let valid = true;

      const fields = [
        { id: "name", message: "Please enter your full name." },
        { id: "email", message: "Please enter a valid email address." },
        { id: "phone", message: "Please enter a valid phone number." },
        { id: "message", message: "Please share your question." }
      ];

      fields.forEach(function (field) {
        const input = document.getElementById(field.id);
        const error = document.getElementById(field.id + "Error");
        if (!input || !error) return;

        let fieldValid = input.value.trim().length > 0;

        if (field.id === "email") {
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }

        if (field.id === "phone") {
          fieldValid = /^[0-9+()\s-]{8,15}$/.test(input.value.trim());
        }

        error.textContent = fieldValid ? "" : field.message;
        if (!fieldValid) valid = false;
      });

      if (valid) {
        if (success) {
          success.style.display = "block";
          success.textContent = "Thank you. Our admissions team will contact you shortly.";
        }
        contactForm.reset();
      } else if (success) {
        success.style.display = "none";
      }
    });
  }
})();
