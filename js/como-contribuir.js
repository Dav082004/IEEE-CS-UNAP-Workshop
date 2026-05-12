// Menú móvil para la página Cómo Contribuir
document.addEventListener("DOMContentLoaded", () => {
  const toggle  = document.getElementById("mobileMenuToggle");
  const nav     = document.getElementById("headerNav");
  const overlay = document.getElementById("mobileOverlay");

  if (!toggle || !nav || !overlay) return;

  const open  = () => { nav.classList.add("active"); overlay.classList.add("active"); toggle.classList.add("active"); document.body.style.overflow = "hidden"; };
  const close = () => { nav.classList.remove("active"); overlay.classList.remove("active"); toggle.classList.remove("active"); document.body.style.overflow = ""; };

  toggle.addEventListener("click", () => nav.classList.contains("active") ? close() : open());
  overlay.addEventListener("click", close);
  nav.querySelectorAll(".nav-link").forEach(l => l.addEventListener("click", close));
  window.addEventListener("resize", () => { if (window.innerWidth > 768) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
});
