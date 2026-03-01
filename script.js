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

  const flyer = document.getElementById("admissionFlyer");
  if (flyer) {
    const dismissKey = "admissionFlyerDismissedUntil";
    const dontShowCheckbox = document.getElementById("flyerDontShowToday");
    const closeButtons = flyer.querySelectorAll("[data-flyer-close]");

    const closeFlyer = function (saveForToday) {
      if (saveForToday) {
        try {
          const oneDay = 24 * 60 * 60 * 1000;
          localStorage.setItem(dismissKey, String(Date.now() + oneDay));
        } catch (error) {
          // Ignore storage errors and continue closing the modal.
        }
      }
      flyer.classList.remove("open");
      flyer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    const openFlyer = function () {
      flyer.classList.add("open");
      flyer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    let dismissedUntil = 0;
    try {
      dismissedUntil = Number(localStorage.getItem(dismissKey) || 0);
    } catch (error) {
      dismissedUntil = 0;
    }

    if (Date.now() >= dismissedUntil) {
      window.setTimeout(openFlyer, 350);
    }

    closeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        closeFlyer(Boolean(dontShowCheckbox && dontShowCheckbox.checked));
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && flyer.classList.contains("open")) {
        closeFlyer(false);
      }
    });
  }

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

  const campusSlider = document.getElementById("campusSlider");
  if (campusSlider) {
    const slideTrack = document.getElementById("campusSlideTrack");
    const slideWindow = document.getElementById("campusSlideWindow");
    const slides = slideTrack ? Array.from(slideTrack.querySelectorAll(".campus-slide")) : [];
    const prevBtn = campusSlider.querySelector(".campus-prev");
    const nextBtn = campusSlider.querySelector(".campus-next");
    const dotsWrap = document.getElementById("campusDots");
    const tilesWrap = document.getElementById("campusTiles");
    const toggleBtn = document.getElementById("campusToggle");
    let activeIndex = 0;
    let timer = null;

    const renderTiles = function () {
      if (!tilesWrap || tilesWrap.childElementCount || !slides.length) return;
      slides.forEach(function (slide, index) {
        const image = slide.querySelector("img");
        if (!image) return;
        const tile = document.createElement("article");
        tile.className = "campus-tile";
        const tileImg = document.createElement("img");
        tileImg.src = image.getAttribute("src");
        tileImg.alt = image.getAttribute("alt") || "Campus photo " + (index + 1);
        tile.appendChild(tileImg);
        tilesWrap.appendChild(tile);
      });
    };

    const toggleTiles = function (show) {
      if (!tilesWrap || !toggleBtn) return;
      const isVisible = typeof show === "boolean" ? show : tilesWrap.hasAttribute("hidden");
      if (isVisible) {
        renderTiles();
        tilesWrap.removeAttribute("hidden");
        toggleBtn.textContent = "Hide Campus Photos";
      } else {
        tilesWrap.setAttribute("hidden", "");
        toggleBtn.textContent = "Show All Campus Photos";
      }
    };

    const updateSlide = function () {
      if (!slideTrack || !slides.length) return;
      slideTrack.style.transform = "translateX(-" + activeIndex * 100 + "%)";
      if (dotsWrap) {
        Array.from(dotsWrap.querySelectorAll(".campus-dot")).forEach(function (dot, index) {
          dot.classList.toggle("active", index === activeIndex);
        });
      }
    };

    const goToSlide = function (index) {
      if (!slides.length) return;
      activeIndex = (index + slides.length) % slides.length;
      updateSlide();
    };

    const startAutoPlay = function () {
      if (timer || slides.length < 2) return;
      timer = setInterval(function () {
        goToSlide(activeIndex + 1);
      }, 3200);
    };

    const stopAutoPlay = function () {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    };

    if (dotsWrap && slides.length) {
      slides.forEach(function (_, index) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "campus-dot";
        dot.setAttribute("aria-label", "Go to campus photo " + (index + 1));
        dot.addEventListener("click", function () {
          goToSlide(index);
        });
        dotsWrap.appendChild(dot);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goToSlide(activeIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goToSlide(activeIndex + 1);
      });
    }

    if (slideWindow) {
      slideWindow.addEventListener("click", function () {
        toggleTiles(true);
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        toggleTiles();
      });
    }

    campusSlider.addEventListener("mouseenter", stopAutoPlay);
    campusSlider.addEventListener("mouseleave", startAutoPlay);
    campusSlider.addEventListener("focusin", stopAutoPlay);
    campusSlider.addEventListener("focusout", startAutoPlay);

    updateSlide();
    startAutoPlay();
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

  const counters = document.querySelectorAll(".counter[data-target]");
  if (counters.length) {
    const animateCounter = function (counter) {
      const target = Number(counter.dataset.target);
      if (!Number.isFinite(target) || target < 0) return;

      const duration = 1400;
      const startTime = performance.now();

      const frame = function (currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        counter.textContent = String(value);

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          counter.textContent = String(target);
        }
      };

      requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.45 }
    );

    counters.forEach(function (counter) {
      counter.textContent = "0";
      observer.observe(counter);
    });
  }
})();
