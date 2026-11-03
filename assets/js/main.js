(() => {
  "use strict";
  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-toggle");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");
  document.querySelector("#year").textContent = new Date().getFullYear();

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
    if (persist) { try { localStorage.setItem("instrumental-theme", value); } catch { /* Storage can be disabled. */ } }
  }
  setTheme(theme);
  themeButton.addEventListener("click", () => setTheme(root.dataset.theme === "light" ? "dark" : "light", true));

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
})();
