(function () {
  /*
    Add/edit sections only here.
    Each section should have:
    - key: used in URL query ?section=<key>
    - title: display title
    - folder: folder name under /images
    - prefix: image file prefix
    - count: number of images
    - cover: cover image filename
  */
  const sections = [
    { key: "campus_life", title: "Campus Life", folder: "campus_life", prefix: "campus_", count: 37, cover: "campus_1.jpg" },
    { key: "school_trip", title: "School Trip", folder: "school_trip", prefix: "trip_", count: 25, cover: "trip_1.jpg" },
    { key: "admission", title: "Admission", folder: "admission", prefix: "admission_", count: 1, cover: "admission_1.jpg" },
    { key: "christmas", title: "Christmas", folder: "christmas", prefix: "christmas_", count: 22, cover: "christmas_1.jpg" },
    { key: "teachers_day", title: "Teachers Day", folder: "teachers_day", prefix: "teachers_day_", count: 4, cover: "teachers_day_1.jpg" },
    { key: "flower_day", title: "Flower Day", folder: "flower_day", prefix: "flower_day_", count: 7, cover: "flower_day_1.jpg" }
  ];

  const page = document.body.dataset.page || "home";

  const tileGrid = document.getElementById("tileGrid");
  const photoGrid = document.getElementById("photoGrid");
  const sectionTitle = document.getElementById("sectionTitle");
  const sectionDescription = document.getElementById("sectionDescription");

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let activePhotos = [];
  let activeIndex = 0;

  function createPhotos(section) {
    return Array.from({ length: section.count }, function (_, i) {
      return "images/" + section.folder + "/" + section.prefix + (i + 1) + ".jpg";
    });
  }

  function renderTiles() {
    if (!tileGrid) return;

    tileGrid.innerHTML = "";
    sections.forEach(function (section) {
      const tile = document.createElement("article");
      tile.className = "gallery-tile";
      tile.style.setProperty("--tile-bg", "url('images/" + section.folder + "/" + section.cover + "')");
      tile.innerHTML = [
        '<div class="tile-content">',
        '  <h2 class="tile-title">' + section.title + "</h2>",
        '  <button class="tile-btn" data-section-key="' + section.key + '">More Photos</button>',
        "</div>"
      ].join("");
      tileGrid.appendChild(tile);
    });

    tileGrid.addEventListener("click", function (event) {
      const button = event.target.closest("[data-section-key]");
      if (!button) return;
      const key = button.dataset.sectionKey;
      window.location.href = "gallery.html?section=" + encodeURIComponent(key);
    });
  }

  function renderPhotos(section) {
    if (!photoGrid || !section) return;

    const photos = createPhotos(section);
    activePhotos = photos;
    photoGrid.innerHTML = "";

    photos.forEach(function (src, index) {
      const card = document.createElement("article");
      card.className = "photo-card";
      card.innerHTML = '<img src="' + src + '" alt="' + section.title + " photo " + (index + 1) + '" loading="lazy" />';
      card.addEventListener("click", function () {
        openSlideshow(index);
      });
      photoGrid.appendChild(card);
    });

    if (sectionTitle) {
      sectionTitle.textContent = section.title;
    }
    if (sectionDescription) {
      sectionDescription.textContent = photos.length + " photos in this section.";
    }
  }

  function openSlideshow(index) {
    if (!lightbox || !lightboxImage || !activePhotos.length) return;
    activeIndex = index;
    updateSlideshowImage();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeSlideshow() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateSlideshowImage() {
    if (!lightboxImage || !activePhotos.length) return;
    lightboxImage.src = activePhotos[activeIndex];
    lightboxImage.alt = "Slideshow photo " + (activeIndex + 1);
  }

  function moveSlide(step) {
    if (!activePhotos.length) return;
    activeIndex = (activeIndex + step + activePhotos.length) % activePhotos.length;
    updateSlideshowImage();
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeSlideshow);
  }
  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", function () {
      moveSlide(-1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener("click", function () {
      moveSlide(1);
    });
  }
  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeSlideshow();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closeSlideshow();
    if (event.key === "ArrowLeft") moveSlide(-1);
    if (event.key === "ArrowRight") moveSlide(1);
  });

  if (page === "home") {
    renderTiles();
  }

  if (page === "gallery") {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("section") || "campus_life";
    const selected = sections.find(function (section) {
      return section.key === key;
    }) || sections[0];
    renderPhotos(selected);
  }
})();
