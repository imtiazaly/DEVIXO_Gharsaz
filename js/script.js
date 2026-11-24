// ---------- Dark mode ----------
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {}
  if (themeBtn) themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}

if (themeBtn) {
  themeBtn.textContent =
    root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
  themeBtn.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
}

// ---------- Responsive nav menu ----------
const menuBtn = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- Scroll to top ----------
const topBtn = document.getElementById("scroll-top");

if (topBtn) {
  window.addEventListener("scroll", () => {
    topBtn.classList.toggle("show", window.scrollY > 300);
  });
  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ---------- Typing animation ----------
const typingEl = document.getElementById("typing");

if (typingEl) {
  const words = JSON.parse(typingEl.dataset.words);
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const word = words[wordIndex];
    charIndex += deleting ? -1 : 1;
    typingEl.textContent = word.slice(0, charIndex);

    let delay = deleting ? 60 : 120;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 1200; // poora word likh kar thora ruko
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 300;
    }
    setTimeout(type, delay);
  }
  type();
}

// ---------- Animated counters ----------
const counters = document.querySelectorAll(".stat-number");

if (counters.length) {
  const animate = (el) => {
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent =
        Math.floor(progress * target) + (progress === 1 ? suffix : "");
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target); // sirf aik baar chale
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => observer.observe(c));
}

// ---------- FAQ accordion ----------
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const btn = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    // pehle sab band karo, taake ek waqt me sirf ek khula rahe
    faqItems.forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".faq-answer").style.maxHeight = null;
      other
        .querySelector(".faq-question")
        .setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

// ---------- Image / Project Slider ----------
const slider = document.getElementById("portfolio-slider");

if (slider) {
  const slides = slider.querySelectorAll(".slide");
  const prevBtn = document.getElementById("slider-prev");
  const nextBtn = document.getElementById("slider-next");
  const dotsContainer = document.getElementById("slider-dots");
  let currentIndex = 0;
  let autoSlideTimer = null;

  // Dots create karein
  slides.forEach((_, idx) => {
    const dot = document.createElement("button");
    dot.classList.add("dot");
    if (idx === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Slide ${idx + 1}`);
    dot.addEventListener("click", () => {
      goToSlide(idx);
      resetAutoSlide();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".dot");

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    slider.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  // 5 seconds baad auto change ho
  function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  // Mouse hover karne par auto-slide pause ho jaye
  const sliderWrapper = slider.closest(".slider-wrapper");
  if (sliderWrapper) {
    sliderWrapper.addEventListener("mouseenter", () =>
      clearInterval(autoSlideTimer),
    );
    sliderWrapper.addEventListener("mouseleave", startAutoSlide);
  }

  startAutoSlide();
}

// ---------- Contact Form Validation ----------
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const serviceInput = document.getElementById("service");
  const messageInput = document.getElementById("message");
  const successBox = document.getElementById("form-success");

  function showError(input, errorElId, message) {
    input.classList.add("invalid");
    const errorEl = document.getElementById(errorElId);
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(input, errorElId) {
    input.classList.remove("invalid");
    const errorEl = document.getElementById(errorElId);
    if (errorEl) errorEl.textContent = "";
  }

  // Live validation jab user type kare
  nameInput.addEventListener("input", () =>
    clearError(nameInput, "name-error"),
  );
  phoneInput.addEventListener("input", () =>
    clearError(phoneInput, "phone-error"),
  );
  serviceInput.addEventListener("change", () =>
    clearError(serviceInput, "service-error"),
  );
  messageInput.addEventListener("input", () =>
    clearError(messageInput, "message-error"),
  );

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    // 1. Name Check
    const nameVal = nameInput.value.trim();
    if (nameVal.length < 3) {
      showError(
        nameInput,
        "name-error",
        "Baraye meharbani mukammal naam darj karein (kam az kam 3 huroof).",
      );
      isValid = false;
    } else {
      clearError(nameInput, "name-error");
    }

    // 2. Phone Check (Pakistani format: 03001234567)
    const phoneVal = phoneInput.value.trim().replace(/[\s-]/g, "");
    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(phoneVal)) {
      showError(
        phoneInput,
        "phone-error",
        "Sahih 11-hanso ka phone number darj karein (maslan: 03001234567).",
      );
      isValid = false;
    } else {
      clearError(phoneInput, "phone-error");
    }

    // 3. Service Check
    if (!serviceInput.value) {
      showError(
        serviceInput,
        "service-error",
        "Baraye meharbani kisi aik service ka intikhab karein.",
      );
      isValid = false;
    } else {
      clearError(serviceInput, "service-error");
    }

    // 4. Message Check
    const msgVal = messageInput.value.trim();
    if (msgVal.length < 10) {
      showError(
        messageInput,
        "message-error",
        "Apne masle ya patay ki thori tafseel darj karein (kam az kam 10 huroof).",
      );
      isValid = false;
    } else {
      clearError(messageInput, "message-error");
    }

    // Agar form valid ho
    if (isValid) {
      successBox.style.display = "block";
      contactForm.reset();

      // 6 seconds baad success alert gayab ho jaye
      setTimeout(() => {
        successBox.style.display = "none";
      }, 6000);
    }
  });
}
