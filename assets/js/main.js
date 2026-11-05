(() => {
  "use strict";
  const root = document.documentElement;

  // ── YEAR ──
  document.querySelector("#year").textContent = new Date().getFullYear();

  // ── THEME ──
  const themeButton = document.querySelector(".theme-toggle");
  let savedTheme;
  try { savedTheme = localStorage.getItem("instrumental-theme"); } catch { savedTheme = null; }
  const theme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  function setTheme(value, persist = false) {
    root.dataset.theme = value;
    const next = value === "light" ? "dark" : "light";
    themeButton.setAttribute("aria-label", `Switch to ${next} theme`);
    themeButton.querySelector(".theme-label").textContent = `${next[0].toUpperCase()}${next.slice(1)}`;
    document.querySelector('meta[name="theme-color"]').content = value === "light" ? "#f0f2ed" : "#101312";
    if (persist) { try { localStorage.setItem("instrumental-theme", value); } catch {} }
  }
  setTheme(theme);
  themeButton.addEventListener("click", () => setTheme(root.dataset.theme === "light" ? "dark" : "light", true));

  // ── MOBILE NAV ──
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("open", open);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  }));
  // Close nav on outside click
  document.addEventListener("click", e => {
    if (nav.classList.contains("open") && !nav.contains(e.target) && !menuButton.contains(e.target)) {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }
  });

  // ── LAZY LOAD (IntersectionObserver) ──
  if ("IntersectionObserver" in window) {
    const lazyImgs = document.querySelectorAll("img[loading=lazy]");
    lazyImgs.forEach(img => img.classList.add("lazy"));
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
          img.addEventListener("error", () => img.classList.add("loaded"), { once: true });
          // If already complete (cached)
          if (img.complete) img.classList.add("loaded");
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: "200px 0px" });
    lazyImgs.forEach(img => imgObserver.observe(img));
  }

  // ── NAV SCROLL-SPY (Field Marker active state) ──
  const navLinks = Array.from(nav.querySelectorAll("a[href^='#']"));
  const sections = navLinks.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          const active = a.getAttribute("href") === "#" + entry.target.id;
          a.classList.toggle("nav-active", active);
          a.setAttribute("aria-current", active ? "true" : "false");
        });
      }
    });
  }, { threshold: 0.15, rootMargin: "-64px 0px -40% 0px" });
  sections.forEach(s => spy.observe(s));

  // ── SCROLL REVEAL ──
  if ("IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      ".section-head, .expertise-list article, .timeline article, .cert-note, .github-band, .contact"
    );
    revealTargets.forEach(el => el.classList.add("reveal"));
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealTargets.forEach(el => revealObserver.observe(el));
  }


  // ── PROJECTS CAROUSEL ──
  const grid = document.querySelector(".projects-grid");
  if (grid) {
    const cards = Array.from(grid.querySelectorAll(".project"));
    const total = cards.length;
    let current = 0;

    // Build DOM: track-wrap > track > cards
    const section = grid.parentElement;
    const wrap = document.createElement("div");
    wrap.className = "projects-track-wrap";
    wrap.setAttribute("tabindex", "0");
    const track = document.createElement("div");
    track.className = "projects-track";
    track.setAttribute("role", "region");
    track.setAttribute("aria-label", "Projects carousel");
    cards.forEach(c => track.appendChild(c));
    wrap.appendChild(track);
    grid.replaceWith(wrap);

    // Controls bar
    const controls = document.createElement("div");
    controls.className = "carousel-controls";

    const left = document.createElement("div");
    left.className = "carousel-left";

    const counter = document.createElement("span");
    counter.className = "carousel-counter";
    counter.setAttribute("aria-live", "polite");

    const dots = document.createElement("div");
    dots.className = "carousel-dots";
    dots.setAttribute("role", "tablist");
    dots.setAttribute("aria-label", "Select project");

    const arrows = document.createElement("div");
    arrows.className = "carousel-arrows";

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "carousel-btn prev";
    prevBtn.setAttribute("aria-label", "Previous project");
    prevBtn.innerHTML = "&#8592;"; // static entity literal — not user input, no XSS risk

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "carousel-btn next";
    nextBtn.setAttribute("aria-label", "Next project");
    nextBtn.innerHTML = "&#8594;"; // static entity literal — not user input, no XSS risk

    const dotBtns = cards.map((card, i) => {
      const d = document.createElement("button");
      d.className = "carousel-dot";
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", `Project ${i + 1} of ${total}`);
      d.addEventListener("click", () => goTo(i));
      dots.appendChild(d);
      return d;
    });

    left.append(counter, dots);
    arrows.append(prevBtn, nextBtn);
    controls.append(left, arrows);
    wrap.after(controls);

    function pad(n) { return String(n).padStart(2, "0"); }

    function goTo(idx, animate = true) {
      current = ((idx % total) + total) % total;
      if (!animate) track.style.transition = "none";
      track.style.transform = `translateX(-${current * 100}%)`;
      if (!animate) { track.offsetHeight; track.style.transition = ""; }
      dotBtns.forEach((d, i) => {
        d.classList.toggle("active", i === current);
        d.setAttribute("aria-selected", i === current ? "true" : "false");
      });
      counter.textContent = `${pad(current + 1)} / ${pad(total)}`;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === total - 1;
      track.setAttribute("aria-label",
        `Project ${current + 1} of ${total}: ${cards[current].querySelector("h3")?.textContent || ""}`);
    }

    prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn.addEventListener("click", () => goTo(current + 1));

    // Keyboard
    wrap.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); goTo(current - 1); }
    });

    // Pointer/touch swipe
    let startX = 0, dragging = false;
    wrap.addEventListener("pointerdown", e => { startX = e.clientX; dragging = true; wrap.setPointerCapture(e.pointerId); });
    wrap.addEventListener("pointerup", e => {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 44) dx < 0 ? goTo(current + 1) : goTo(current - 1);
    });
    wrap.addEventListener("pointercancel", () => { dragging = false; });

    goTo(0, false);
  }


})();
