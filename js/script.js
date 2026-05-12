document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupCardEffects();
  setupSmoothNavigation();
  setupTypingEffect();
  setupBackgroundParticles();
});

// Efecto 3D en tarjetas al mover el mouse
function setupCardEffects() {
  document.addEventListener("mousemove", (e) => {
    const cards = document.querySelectorAll(".contributor-card");

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateY(-10px) 
                    scale(1.02)
                `;
      }
    });
  });

  document.querySelectorAll(".contributor-card").forEach((card) => {
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// Scroll suave con offset de header
function setupSmoothNavigation() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });

        targetElement.style.transition = "all 0.3s ease";
        targetElement.style.transform = "scale(1.02)";
        setTimeout(() => { targetElement.style.transform = ""; }, 300);
      }
    });
  });
}

// Efecto typewriter en el título
function setupTypingEffect() {
  const titleElement = document.querySelector(".gradient-text");
  if (!titleElement) return;

  const originalText = titleElement.textContent;
  titleElement.textContent = "";

  let i = 0;
  const typeWriter = () => {
    if (i < originalText.length) {
      titleElement.textContent += originalText.charAt(i++);
      setTimeout(typeWriter, 45);
    } else {
      const cursor = document.createElement("span");
      cursor.textContent = "|";
      cursor.style.animation = "blink 1s infinite";
      titleElement.appendChild(cursor);
      setTimeout(() => cursor.remove(), 2000);
    }
  };
  setTimeout(typeWriter, 200);
}

// Partículas flotantes en el hero
function setupBackgroundParticles() {
  const hero = document.querySelector(".hero-section");
  if (!hero) return;

  const particlesContainer = document.createElement("div");
  particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: 1;
    `;

  hero.appendChild(particlesContainer);
  for (let i = 0; i < 20; i++) createParticle(particlesContainer);
}

function createParticle(container) {
  const particle = document.createElement("div");
  const size = Math.random() * 4 + 1;

  particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: particleFloat ${Math.random() * 20 + 10}s linear infinite;
    `;

  container.appendChild(particle);

  setTimeout(() => {
    particle.remove();
    createParticle(container);
  }, (Math.random() * 20 + 10) * 1000);
}

// Agregar CSS para animaciones adicionales
const additionalStyles = `
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) translateX(0px);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(${
              Math.random() * 200 - 100
            }px);
            opacity: 0;
        }
    }
    
    .contributor-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .hero-content > * {
        opacity: 0;
        animation: fadeInUp 1s ease-out forwards;
    }
    
    .hero-content > *:nth-child(1) { animation-delay: 0.2s; }
    .hero-content > *:nth-child(2) { animation-delay: 0.4s; }
    .hero-content > *:nth-child(3) { animation-delay: 0.6s; }
`;

// Inyectar estilos adicionales
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Menú móvil
function setupMobileMenu() {
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
}
