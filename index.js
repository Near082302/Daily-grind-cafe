/* ===========================================================================
   DAILY GRIND CAFE - MAIN JAVASCRIPT FILE (index.js)
   =========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initOpenClosedBadge();
  initMenuFiltersAndSearch();
  initHeroSlider();
  initAboutCarousel();
  initScrollHighlighting();
  initCounters();
  initSwipeGestures();
});


/* ---------------------------------------------------------------------------
   FEATURE 1: MOBILE HAMBURGER MENU TOGGLE & AUTO-CLOSE
   --------------------------------------------------------------------------- */
function initHamburgerMenu() {
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-item");

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (navLinks && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
      }
    });
  });
}


/* ---------------------------------------------------------------------------
   FEATURE 2: STORE OPERATING HOURS BADGE
   --------------------------------------------------------------------------- */
function initOpenClosedBadge() {
  const statusBadge = document.getElementById("store-status");
  if (!statusBadge) return;

  const currentHour = new Date().getHours(); 
  const isOpen = currentHour >= 9 || currentHour < 2;

  if (isOpen) {
    statusBadge.textContent = "We're Open!";
    statusBadge.style.backgroundColor = "var(--accent-green)";
  } else {
    statusBadge.textContent = "Closed • Opens 9 AM";
    statusBadge.style.backgroundColor = "#D32F2F";
  }
}


/* ---------------------------------------------------------------------------
   FEATURE 3: UNIFIED LIVE SEARCH & CATEGORY FILTERS WITH "NO RESULTS" FEEDBACK
   --------------------------------------------------------------------------- */
function initMenuFiltersAndSearch() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("menu-search");
  const menuGrid = document.getElementById("menu-grid");

  function updateMenu() {
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const activeBtn = document.querySelector(".filter-btn.active");
    const activeCategory = activeBtn ? activeBtn.getAttribute("data-category") : "all";
    const cards = document.querySelectorAll("#menu-grid .card");
    
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      const title = card.querySelector("h4") ? card.querySelector("h4").textContent.toLowerCase() : "";

      const matchesCategory = (activeCategory === "all" || cardCategory === activeCategory);
      const matchesSearch = title.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.classList.remove("hide");
        visibleCount++;
      } else {
        card.classList.add("hide");
      }
    });

    // Check if a "no results" element already exists inside the menu grid
    let noResultsEl = document.getElementById("no-results-msg");

    if (visibleCount === 0) {
      // If no cards match, create and append the empty state card if it doesn't exist yet
      if (!noResultsEl && menuGrid) {
        noResultsEl = document.createElement("div");
        noResultsEl.id = "no-results-msg";
        noResultsEl.className = "no-results-message";
        noResultsEl.innerHTML = `
          <i class="fa-solid fa-mug-saucer"></i>
          <h4>No items match your search</h4>
          <p>We couldn't find what you were looking for. Try checking your spelling or switching categories.</p>
        `;
        menuGrid.appendChild(noResultsEl);
      }
    } else {
      // If matches are found, remove the empty state element
      if (noResultsEl) {
        noResultsEl.remove();
      }
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      updateMenu();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", updateMenu);
  }
}


/* ---------------------------------------------------------------------------
   FEATURE 4: HERO ANNOUNCEMENT CAROUSEL SLIDER (SLIDING ANIMATION)
   --------------------------------------------------------------------------- */
let currentSlide = 0;
let heroInterval;
const totalHeroSlides = 4;

function initHeroSlider() {
  startHeroAutoSlide();
}

function startHeroAutoSlide() {
  clearInterval(heroInterval);
  heroInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalHeroSlides;
    updateHeroSlide(currentSlide);
  }, 5000);
}

window.setSlide = function(index) {
  currentSlide = index;
  updateHeroSlide(currentSlide);
  startHeroAutoSlide();
};

function updateHeroSlide(index) {
  const heroTrack = document.getElementById("hero-slider-track");
  const dots = document.querySelectorAll(".slider-dots .dot");

  if (heroTrack) {
    /* Translate the horizontal container smooth left to right */
    heroTrack.style.transform = `translateX(-${index * 25}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
    });
  }
}


/* ---------------------------------------------------------------------------
   FEATURE 5: ABOUT SECTION CAROUSEL CONTROLLER
   --------------------------------------------------------------------------- */
let currentAboutSlide = 0;

function initAboutCarousel() {
  const prevBtn = document.getElementById("about-prev");
  const nextBtn = document.getElementById("about-next");
  const slides = document.querySelectorAll(".about-slide");

  if (!slides.length) return;

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentAboutSlide = (currentAboutSlide - 1 + slides.length) % slides.length;
      updateAboutSlide(currentAboutSlide);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentAboutSlide = (currentAboutSlide + 1) % slides.length;
      updateAboutSlide(currentAboutSlide);
    });
  }
}

window.setAboutSlide = function(index) {
  currentAboutSlide = index;
  updateAboutSlide(currentAboutSlide);
};

function updateAboutSlide(index) {
  const slides = document.querySelectorAll(".about-slide");
  const dots = document.querySelectorAll(".about-dot");

  slides.forEach((slide, idx) => {
    slide.classList.toggle("active", idx === index);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === index);
  });
}


/* ---------------------------------------------------------------------------
   FEATURE 6: MOBILE TOUCH SWIPE SUPPORT FOR HERO & ABOUT
   --------------------------------------------------------------------------- */
function initSwipeGestures() {
  // Mobile touch swipe logic for Hero Section
  const heroElem = document.querySelector(".hero-section");
  if (heroElem) {
    let touchStartX = 0;
    let touchEndX = 0;

    heroElem.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroElem.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      if (touchStartX - touchEndX > 40) {
        // Swipe left -> Next slide
        currentSlide = (currentSlide + 1) % totalHeroSlides;
        updateHeroSlide(currentSlide);
      } else if (touchEndX - touchStartX > 40) {
        // Swipe right -> Prev slide
        currentSlide = (currentSlide - 1 + totalHeroSlides) % totalHeroSlides;
        updateHeroSlide(currentSlide);
      }
    }
  }

  // Mobile touch swipe logic for About Section Carousel
  const aboutElem = document.getElementById("about-carousel");
  if (aboutElem) {
    let aboutStartX = 0;
    let aboutEndX = 0;

    aboutElem.addEventListener("touchstart", (e) => {
      aboutStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    aboutElem.addEventListener("touchend", (e) => {
      aboutEndX = e.changedTouches[0].screenX;
      handleAboutSwipe();
    }, { passive: true });

    function handleAboutSwipe() {
      const aboutSlidesCount = document.querySelectorAll(".about-slide").length;
      if (aboutStartX - aboutEndX > 40) {
        // Swipe left -> Next slide
        currentAboutSlide = (currentAboutSlide + 1) % aboutSlidesCount;
        updateAboutSlide(currentAboutSlide);
      } else if (aboutEndX - aboutStartX > 40) {
        // Swipe right -> Prev slide
        currentAboutSlide = (currentAboutSlide - 1 + aboutSlidesCount) % aboutSlidesCount;
        updateAboutSlide(currentAboutSlide);
      }
    }
  }
}


/* ---------------------------------------------------------------------------
   FEATURE 7: ACTIVE NAVBAR HIGHLIGHTING ON SCROLL
   --------------------------------------------------------------------------- */
function initScrollHighlighting() {
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-item");

  window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${currentSection}`) {
        item.classList.add("active");
      }
    });
  });
}


/* ---------------------------------------------------------------------------
   FEATURE 8: SCROLL-TRIGGERED ANIMATED NUMERIC COUNTERS
   --------------------------------------------------------------------------- */
function initCounters() {
  const statNumbers = document.querySelectorAll(".stat-number");
  if (!statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        
        statNumbers.forEach((counter) => {
          const target = +counter.getAttribute("data-target");
          const duration = 1500;
          const increment = target / (duration / 16);

          let current = 0;
          const updateCount = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.ceil(current);
              requestAnimationFrame(updateCount);
            } else {
              counter.textContent = target;
            }
          };

          updateCount();
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector(".stats-grid");
  if (statsSection) observer.observe(statsSection);
}