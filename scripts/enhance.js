// Synozän Presskit – Signature Layer (Nav + Reveal + Scrollspy + Shortcuts)
// Save as: synozaen-presskit/scripts/enhance.js

(function () {
  // Die Reihenfolge der Sektionen – hier WICHTIG: "presskit" ist dabei!
  const ORDER = [
    "liebe",
    "wissen",
    "gemeinschaft",
    "geschichte",
    "transformation",
    "presskit"
  ];

  // Floating-Navigation dynamisch bauen
  const nav = document.createElement("nav");
  nav.className = "syno-nav";
  nav.innerHTML = `
    <div class="syno-nav__wrap">
      ${ORDER.map(
        (id) =>
          `<button data-target="${id}" id="btn-${id}">
             ${id[0].toUpperCase()}${id.slice(1)}
           </button>`
      ).join("")}
    </div>
  `;
  document.body.appendChild(nav);

  // Back-to-top Button
  const up = document.createElement("button");
  up.className = "syno-up";
  up.setAttribute("aria-label", "Nach oben");
  up.textContent = "↑";
  document.body.appendChild(up);

  // Scroll-Funktion
  function goTo(id) {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // URL-Hash aktualisieren (optional)
    history.replaceState(null, "", `#${id}`);
  }

  // Klick-Handler für Nav
  nav.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-target]");
    if (!b) return;
    goTo(b.getAttribute("data-target"));
  });

  // Klick-Handler für Nach-oben
  up.addEventListener("click", () => goTo("portal"));

  // Hero-Beobachtung: Nav ein-/ausblenden
  const hero = document.querySelector(".hero");
  if (hero) {
    const heroIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            nav.classList.remove("syno-nav--show");
          } else {
            nav.classList.add("syno-nav--show");
          }
        });
      },
      { threshold: 0.6 }
    );
    heroIO.observe(hero);
  }

  // Scrollspy: aktiver Button je nach Panel
  const panels = document.querySelectorAll(".panel");
  const spyIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const btn = document.getElementById(`btn-${id}`);
        if (!btn) return;

        if (entry.isIntersecting) {
          ORDER.forEach((otherId) => {
            const otherBtn = document.getElementById(`btn-${otherId}`);
            if (otherBtn) otherBtn.classList.remove("is-active");
          });
          btn.classList.add("is-active");
        }
      });
    },
    {
      threshold: 0.6,
      rootMargin: "-20% 0px -60% 0px",
    }
  );

  panels.forEach((panel) => spyIO.observe(panel));
})();
