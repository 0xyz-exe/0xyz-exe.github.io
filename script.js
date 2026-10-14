(() => {
  "use strict";
  const username = "0xyz-exe";
  const featured = [
    "Autonomous-Business-Builder",
    "AI-Workforce-Platform",
    "ResearchHub-Campus",
    "CryptoMerchant",
    "Restaurant-Management-System",
    "Vehicle-Detection-in-Night-Images-Using-YOLOv8-Based-Deep-Learning-Method-and-CLAHE-Preprocessing",
  ];
  const projects = document.querySelector("#projects");
  const status = document.querySelector("#repo-status");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");
  const cacheKey = "0xyz-exe-public-repos-v1";
  const cacheTime = 60 * 60 * 1000;

  document.querySelector("#year").textContent = new Date().getFullYear();

  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    menuButton.setAttribute(
      "aria-label",
      expanded ? "Open menu" : "Close menu",
    );
    nav.classList.toggle("open", !expanded);
  });
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
      nav.classList.remove("open");
    }),
  );

  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08 },
        )
      : null;

  function safeExternal(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" ? parsed.href : null;
    } catch {
      return null;
    }
  }

  function makeCard(repo, index) {
    const card = document.createElement("article");
    card.className = "project-card reveal";
    const top = document.createElement("div");
    top.className = "project-top";
    const number = document.createElement("span");
    number.className = "project-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const link = document.createElement("a");
    link.className = "project-open";
    link.href = safeExternal(repo.html_url) || `https://github.com/${username}`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", `View ${repo.name} repository on GitHub`);
    link.textContent = "↗";
    top.append(number, link);

    const body = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "project-name";
    title.textContent = repo.name;
    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = repo.description || "Public repository";
    body.append(title, description);

    const bottom = document.createElement("div");
    bottom.className = "project-bottom";
    const language = document.createElement("span");
    language.className = "project-lang";
    language.textContent = repo.language || "Repository";
    const meta = document.createElement("span");
    meta.className = "project-meta";
    const stars = Number.isFinite(repo.stargazers_count)
      ? repo.stargazers_count
      : 0;
    meta.textContent = `★ ${stars}`;
    bottom.append(language, meta);
    const homepage = safeExternal(repo.homepage);
    if (homepage) {
      const demo = document.createElement("a");
      demo.className = "project-demo";
      demo.href = homepage;
      demo.target = "_blank";
      demo.rel = "noreferrer";
      demo.textContent = "LIVE SITE ↗";
      demo.setAttribute("aria-label", `Open ${repo.name} live website`);
      bottom.append(demo);
    }
    card.append(top, body, bottom);
    return card;
  }

  function showRepos(repos, message) {
    projects.replaceChildren();
    const sorted = [...repos]
      .sort((a, b) => {
        const ai = featured.indexOf(a.name);
        const bi = featured.indexOf(b.name);
        if (ai !== -1 || bi !== -1)
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        return new Date(b.updated_at) - new Date(a.updated_at);
      })
      .slice(0, 6);

    sorted.forEach((repo, index) => {
      const card = makeCard(repo, index);
      projects.append(card);
      if (observer) observer.observe(card);
      else card.classList.add("visible");
    });
    status.classList.remove("loading", "error");
    if (sorted.length) {
      const indicator = document.createElement("span");
      indicator.className = "status-dot";
      status.replaceChildren(
        indicator,
        document.createTextNode(
          " " + (message || `${sorted.length} repositories · LIVE FROM GITHUB`),
        ),
      );
    } else {
      status.classList.add("error");
      status.textContent =
        "No public repositories are available right now. Browse GitHub directly.";
    }
  }

  async function loadRepos() {
    status.classList.add("loading");
    let cached;
    try {
      cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    } catch {
      cached = null;
    }
    if (cached && Array.isArray(cached.items))
      showRepos(cached.items, "CACHED PUBLIC DATA · REFRESHING");

    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        {
          headers: { Accept: "application/vnd.github+json" },
          cache: "no-cache",
        },
      );
      if (!response.ok) {
        const error = new Error(`GitHub returned ${response.status}`);
        error.status = response.status;
        throw error;
      }
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Unexpected GitHub response");
      const ownRepos = data.filter(
        (repo) => !repo.fork && !repo.archived && safeExternal(repo.html_url),
      );
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ savedAt: Date.now(), items: ownRepos }),
        );
      } catch {
        /* Private browsing or storage quota: live data still works. */
      }
      showRepos(ownRepos);
    } catch (error) {
      if (cached && Array.isArray(cached.items)) {
        const age = Date.now() - Number(cached.savedAt || 0);
        const ageLabel =
          age > cacheTime ? "STALE CACHED DATA · " : "CACHED DATA · ";
        showRepos(
          cached.items,
          ageLabel +
            (error.status === 403 || error.status === 429
              ? "GITHUB API RATE LIMITED"
              : "GITHUB TEMPORARILY UNAVAILABLE"),
        );
      } else {
        status.classList.remove("loading");
        status.classList.add("error");
        status.textContent =
          error.status === 403 || error.status === 429
            ? "GitHub API rate limit reached. Try again later or browse the public repositories directly."
            : "Could not load repositories. Check your connection or browse GitHub directly.";
      }
    }
  }

  if (
    window.matchMedia("(pointer:fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const art = document.querySelector(".hero-art");
    art.addEventListener("pointermove", (event) => {
      const bounds = art.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      art.querySelectorAll(".orbit").forEach((orbit, index) => {
        orbit.style.translate = `${x * (index + 1) * 5}px ${y * (index + 1) * 5}px`;
      });
    });
    art.addEventListener("pointerleave", () =>
      art.querySelectorAll(".orbit").forEach((orbit) => {
        orbit.style.translate = "";
      }),
    );
  }

  loadRepos();
})();
