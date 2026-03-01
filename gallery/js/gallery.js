(function () {
  const page = document.body.dataset.page || "";

  // Update these counts when you add more numbered images in each folder.
  const galleryData = {
    campus_life: makeSequential("images/campus_life/campus_", 46),
    school_trip: makeSequential("images/school_trip/trip_", 26),
    admission: makeSequential("images/admission/admission_", 4)
  };

  const eventsData = {
    christmas: makeSequential("images/events/christmas/christmas_", 22),
    teachers_day: makeSequential("images/events/teachers_day/teachers_day_", 4),
    flower_day: makeSequential("images/events/flower_day/flower_day_", 7)
  };

  // To add a new event folder later:
  // 1) Create folder in images/events/<new_folder>
  // 2) Add numbered files like <new_folder>_1.jpg, <new_folder>_2.jpg
  // 3) Add one key below and one filter button in events.html

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  let activeImages = [];
  let activeIndex = 0;

  function makeSequential(prefix, count) {
    return Array.from({ length: count }, function (_, i) {
      return prefix + (i + 1) + ".jpg";
    });
  }

  function renderGrid(images) {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;

    grid.classList.remove("fading");
    grid.innerHTML = "";

    images.forEach(function (src, index) {
      const card = document.createElement("article");
      card.className = "gallery-card fade-in";
      card.innerHTML = [
        '<div class="media"><img src="' + src + '" alt="Gallery image ' + (index + 1) + '" loading="lazy" /></div>',
        '<div class="meta"><h3>Photo ' + (index + 1) + "</h3></div>"
      ].join("");

      card.addEventListener("click", function () {
        openLightbox(images, index);
      });
      grid.appendChild(card);
    });

    grid.classList.add("fading");
  }

  function openLightbox(images, index) {
    if (!lightbox || !lightboxImage || !images.length) return;
    activeImages = images;
    activeIndex = index;
    updateLightboxImage();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateLightboxImage() {
    if (!lightboxImage || !activeImages.length) return;
    const src = activeImages[activeIndex];
    lightboxImage.src = src;
    lightboxImage.alt = "Preview image " + (activeIndex + 1);
  }

  function goTo(delta) {
    if (!activeImages.length) return;
    activeIndex = (activeIndex + delta + activeImages.length) % activeImages.length;
    updateLightboxImage();
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", function () {
      goTo(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", function () {
      goTo(1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") goTo(1);
    if (event.key === "ArrowLeft") goTo(-1);
  });

  if (page === "campus_life" || page === "school_trip" || page === "admission") {
    renderGrid(galleryData[page] || []);
  }

  if (page === "events") {
    const buttons = Array.from(document.querySelectorAll(".event-btn"));
    let activeCategory = "christmas";
    renderGrid(eventsData[activeCategory]);

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeCategory = button.dataset.event;
        buttons.forEach(function (btn) {
          btn.classList.toggle("active", btn === button);
        });
        renderGrid(eventsData[activeCategory] || []);
      });
    });
  }
})();
