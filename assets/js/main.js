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

    // Restructure DOM: wrap grid → track-wrap + track
    const section = grid.parentElement;
    const wrap = document.createElement("div");
    wrap.className = "projects-track-wrap";
    const track = document.createElement("div");
    track.className = "projects-track";
    track.setAttribute("aria-live", "polite");

    // Move cards into track, replace grid
    cards.forEach(card => track.appendChild(card));
    wrap.appendChild(track);
    grid.replaceWith(wrap);

    // Controls
    const controls = document.createElement("div");
    controls.className = "carousel-controls";

    const dots = document.createElement("div");
    dots.className = "carousel-dots";
    dots.setAttribute("role", "tablist");
    dots.setAttribute("aria-label", "Project navigation");

    const counter = document.createElement("span");
    counter.className = "carousel-counter";

    const arrows = document.createElement("div");
    arrows.className = "carousel-arrows";

    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-btn prev";
    prevBtn.setAttribute("aria-label", "Previous project");
    prevBtn.textContent = "←";

    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-btn next";
    nextBtn.setAttribute("aria-label", "Next project");
    nextBtn.textContent = "→";

    const dotBtns = cards.map((_, i) => {
      const d = document.createElement("button");
      d.className = "carousel-dot" + (i === 0 ? " active" : "");
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", `Project ${i + 1} of ${total}`);
      d.setAttribute("aria-selected", i === 0 ? "true" : "false");
      d.addEventListener("click", () => goTo(i));
      dots.appendChild(d);
      return d;
    });

    arrows.append(prevBtn, nextBtn);
    controls.append(dots, counter, arrows);
    wrap.after(controls);

    function goTo(idx) {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotBtns.forEach((d, i) => {
        d.classList.toggle("active", i === current);
        d.setAttribute("aria-selected", i === current ? "true" : "false");
      });
      counter.textContent = `${current + 1} / ${total}`;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === total - 1;
      // announce for screen readers
      track.setAttribute("aria-label", `Project ${current + 1} of ${total}: ${cards[current].querySelector("h3")?.textContent || ""}`);
    }

    prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn.addEventListener("click", () => goTo(current + 1));

    // Keyboard arrow support on carousel
    wrap.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); goTo(current - 1); }
    });

    // Touch / pointer swipe
    let startX = 0, dragging = false;
    wrap.addEventListener("pointerdown", e => { startX = e.clientX; dragging = true; });
    wrap.addEventListener("pointermove", e => { if (!dragging) return; });
    wrap.addEventListener("pointerup", e => {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 40) dx < 0 ? goTo(current + 1) : goTo(current - 1);
    });
    wrap.addEventListener("pointercancel", () => { dragging = false; });

    goTo(0);
  }
})();
