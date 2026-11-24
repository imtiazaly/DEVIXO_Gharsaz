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
      el.textContent = Math.floor(progress * target) + (progress === 1 ? suffix : "");
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target); // sirf aik baar chale
      }
    });
  }, { threshold: 0.5 });

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
      other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      btn.setAttribute("aria-expanded", "true");
    }
  });
});