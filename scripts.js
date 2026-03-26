/* SBMS School Website Scripts */

const qs = (sel, parent = document) => parent.querySelector(sel);
const qsa = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

const pageName = () => window.location.pathname.split('/').pop() || 'index.html';

const setActiveNav = () => {
  const current = pageName();
  qsa('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) link.classList.add('active');
  });
};

const handleNavbar = () => {
  const navbar = qs('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add('shrink');
    else navbar.classList.remove('shrink');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);
};

const handleHamburger = () => {
  const burger = qs('.hamburger');
  const nav = qs('.nav-links');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
};

const handleFadeIn = () => {
  const items = qsa('.fade-in');
  if (!items.length) return;
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  items.forEach(item => observer.observe(item));
};

const animateCounters = () => {
  const counters = qsa('[data-target]');
  if (!counters.length) return;
  const runCounter = counter => {
    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || '';
    let current = 0;
    const increment = Math.max(1, Math.floor(target / 80));
    const tick = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = `${target}${suffix}`;
        return;
      }
      counter.textContent = `${current}${suffix}`;
      requestAnimationFrame(tick);
    };
    tick();
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach(counter => observer.observe(counter));
};

const initSlider = (sliderId, interval = 5000) => {
  const slider = qs(sliderId);
  if (!slider) return;
  const slides = qsa('.slide', slider);
  const dots = qs('.slider-dots', slider.parentElement);
  let index = 0;
  let startX = 0;
  let endX = 0;

  const update = () => {
    const offset = index * -100;
    qs('.slides', slider).style.transform = `translateX(${offset}%)`;
    if (dots) {
      qsa('button', dots).forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
      });
    }
  };

  const next = () => {
    index = (index + 1) % slides.length;
    update();
  };

  let timer = setInterval(next, interval);

  if (dots) {
    qsa('button', dots).forEach((btn, i) => {
      btn.addEventListener('click', () => {
        index = i;
        update();
        clearInterval(timer);
        timer = setInterval(next, interval);
      });
    });
  }

  slider.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener('touchend', e => {
    endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) next();
    if (endX - startX > 50) {
      index = (index - 1 + slides.length) % slides.length;
      update();
    }
  });

  update();
};

const admissionModal = () => {
  const modal = qs('#admissionModal');
  if (!modal) return;
  const closeBtn = qs('.modal-close', modal);
  const dontShow = qs('#dontShowToday', modal);
  const todayKey = `sbms-modal-${new Date().toDateString()}`;
  if (!localStorage.getItem(todayKey)) {
    setTimeout(() => modal.classList.add('active'), 2000);
  }
  const close = () => {
    modal.classList.remove('active');
    if (dontShow && dontShow.checked) {
      localStorage.setItem(todayKey, 'closed');
    }
  };
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => {
    if (e.target === modal) close();
  });
};

const tabs = () => {
  const tabBtns = qsa('.tab-btn');
  if (!tabBtns.length) return;
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      qsa('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === target);
      });
    });
  });
};

const facultyFilter = () => {
  const buttons = qsa('.filter-btns button');
  const cards = qsa('.faculty-card');
  if (!buttons.length || !cards.length) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const dept = btn.dataset.dept;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cards.forEach(card => {
        const match = dept === 'all' || card.dataset.dept === dept;
        card.style.display = match ? 'block' : 'none';
      });
    });
  });
};

const galleryFilter = () => {
  const buttons = qsa('.gallery-filters button');
  const items = qsa('.gallery-item');
  if (!buttons.length || !items.length) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      items.forEach(item => {
        const match = category === 'all' || item.dataset.category === category;
        item.style.display = match ? 'block' : 'none';
      });
    });
  });
};

const lightbox = () => {
  const box = qs('.lightbox');
  if (!box) return;
  const images = qsa('.gallery-item img');
  const imgEl = qs('img', box);
  const prev = qs('.prev', box);
  const next = qs('.next', box);
  const close = qs('.close', box);
  let current = 0;

  const show = index => {
    current = index;
    imgEl.src = images[current].src;
    box.classList.add('active');
  };

  images.forEach((img, index) => {
    img.addEventListener('click', () => show(index));
  });

  const goNext = () => show((current + 1) % images.length);
  const goPrev = () => show((current - 1 + images.length) % images.length);

  next.addEventListener('click', goNext);
  prev.addEventListener('click', goPrev);
  close.addEventListener('click', () => box.classList.remove('active'));
  box.addEventListener('click', e => {
    if (e.target === box) box.classList.remove('active');
  });
};

const accordion = () => {
  const items = qsa('.accordion-item');
  if (!items.length) return;
  items.forEach(item => {
    const header = qs('.accordion-header', item);
    header.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
};

const contactForm = () => {
  const form = qs('#contactForm');
  if (!form) return;
  const success = qs('#contactSuccess');
  const button = qs('button[type="submit"]', form);
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    qsa('input[required], select[required], textarea[required]', form).forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    const email = qs('input[type="email"]', form);
    const phone = qs('input[type="tel"]', form);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    const phoneValid = /^[0-9]{10}$/.test(phone.value.trim());

    if (!emailValid) {
      email.classList.add('error');
      valid = false;
    }
    if (!phoneValid) {
      phone.classList.add('error');
      valid = false;
    }

    if (valid) {
      button.classList.add('loading');
      const originalText = button.textContent;
      button.textContent = 'Sending...';
      setTimeout(() => {
        success.textContent = 'Thanks! Your message has been received. Our team will respond soon.';
        success.classList.add('success-msg');
        button.classList.remove('loading');
        button.textContent = originalText;
        form.reset();
      }, 800);
    }
  });
};

const whatsappFloat = () => {
  const btn = qs('.whatsapp-float');
  if (!btn) return;
  const onScroll = () => {
    if (window.scrollY > 200) btn.classList.remove('hidden');
    else btn.classList.add('hidden');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);
};

const init = () => {
  setActiveNav();
  handleNavbar();
  handleHamburger();
  handleFadeIn();
  animateCounters();
  initSlider('#campusSlider');
  initSlider('#testimonialSlider', 6000);
  admissionModal();
  tabs();
  facultyFilter();
  galleryFilter();
  lightbox();
  accordion();
  contactForm();
  whatsappFloat();
};

document.addEventListener('DOMContentLoaded', init);
