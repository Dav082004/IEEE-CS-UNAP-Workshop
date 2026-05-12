// ============================================================================
// FUNCIONES PARA RENDERIZAR COLABORADORES
// Los datos se cargan desde public/index.json
// ============================================================================

// Variable global para los colaboradores (se carga desde index.json)
let contributors = [];

// Escapa caracteres HTML para prevenir XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Valida que una URL sea http/https (previene javascript: XSS)
function safeUrl(url) {
  if (!url) return '#';
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') ? url : '#';
  } catch {
    return '#';
  }
}

// Función para obtener las iniciales del nombre
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Función para generar un color basado en el nombre
function getColorFromName(name) {
  const colors = [
    "linear-gradient(135deg, #38bdf8 0%, #44e2cd 100%)",
    "linear-gradient(135deg, #8ed5ff 0%, #38bdf8 100%)",
    "linear-gradient(135deg, #44e2cd 0%, #03c6b2 100%)",
    "linear-gradient(135deg, #c5c9ff 0%, #a3abff 100%)",
    "linear-gradient(135deg, #38bdf8 0%, #c5c9ff 100%)",
    "linear-gradient(135deg, #44e2cd 0%, #8ed5ff 100%)",
    "linear-gradient(135deg, #a3abff 0%, #44e2cd 100%)",
    "linear-gradient(135deg, #7bd0ff 0%, #03c6b2 100%)",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return colors[Math.abs(hash) % colors.length];
}

// Función para renderizar las tarjetas de colaboradores
function renderContributors() {
  const grid = document.getElementById("contributors-grid");

  if (!grid) return;

  grid.innerHTML = "";

  contributors.forEach((contributor, index) => {
    const card = document.createElement("div");
    card.className = "contributor-card";
    card.style.animationDelay = `${index * 0.1}s`;

    const initials = getInitials(contributor.name);
    const avatarColor = getColorFromName(contributor.name);

    // Avatar: construido por DOM para mantener event listeners
    let avatarNode;
    let imgSrc = '';
    if (contributor.image) {
      imgSrc = safeUrl(contributor.image);
    } else if (contributor.github) {
      const githubUsername = contributor.github.split('/').pop();
      imgSrc = `https://github.com/${encodeURIComponent(githubUsername)}.png`;
    }

    if (imgSrc) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = contributor.name;
      img.className = 'contributor-avatar-img';
      img.addEventListener('error', () => {
        const fallback = document.createElement('div');
        fallback.className = 'contributor-avatar';
        fallback.style.background = avatarColor;
        fallback.textContent = initials;
        img.replaceWith(fallback);
      });
      avatarNode = img;
    } else {
      const fallback = document.createElement('div');
      fallback.className = 'contributor-avatar';
      fallback.style.background = avatarColor;
      fallback.textContent = initials;
      avatarNode = fallback;
    }

    const safeHobbies = (contributor.hobbies || [])
      .slice(0, 4)
      .map((hobby) => `<span class="hobby-tag">${escapeHtml(hobby)}</span>`)
      .join('');

    const githubHTML = contributor.github
      ? `<a href="${escapeHtml(safeUrl(contributor.github))}" target="_blank" rel="noopener noreferrer" class="contributor-social-link github">
           <i class="fab fa-github"></i> GitHub
         </a>`
      : '';

    const linkedinHTML = contributor.linkedin
      ? `<a href="${escapeHtml(safeUrl(contributor.linkedin))}" target="_blank" rel="noopener noreferrer" class="contributor-social-link linkedin">
           <i class="fab fa-linkedin"></i> LinkedIn
         </a>`
      : '';

    const instagramHTML = contributor.instagram
      ? `<a href="${escapeHtml(safeUrl(contributor.instagram))}" target="_blank" rel="noopener noreferrer" class="contributor-social-link instagram">
           <i class="fab fa-instagram"></i> Instagram
         </a>`
      : '';

    card.innerHTML = `
      <div class="contributor-name">${escapeHtml(contributor.name)}</div>
      <div class="contributor-nickname">@${escapeHtml(contributor.nickname)}</div>
      <div class="contributor-description">${escapeHtml(contributor.description) || 'Desarrollador apasionado por la tecnología'}</div>
      <div class="contributor-hobbies">${safeHobbies}</div>
      <div class="contributor-social-links">${githubHTML}${linkedinHTML}${instagramHTML}</div>
    `;

    // Insertar el avatar al principio (con su event listener intacto)
    card.insertBefore(avatarNode, card.firstChild);

    grid.appendChild(card);
  });
}

// Función para animar números
function animateNumber(element, finalNumber, duration = 2000) {
  let startNumber = 0;
  const increment = finalNumber / (duration / 16);

  const timer = setInterval(() => {
    startNumber += increment;
    if (startNumber >= finalNumber) {
      startNumber = finalNumber;
      clearInterval(timer);
    }
    element.textContent = Math.floor(startNumber);
  }, 16);
}

// Función para actualizar estadísticas
function updateStats() {
  const contributorsCount = contributors.length;

  // Animar números cuando sean visibles
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const contributorsElement =
          document.getElementById("contributors-count");

        if (contributorsElement && !contributorsElement.dataset.animated) {
          animateNumber(contributorsElement, contributorsCount);
          contributorsElement.dataset.animated = "true";
        }

        observer.disconnect();
      }
    });
  });

  const statsSection = document.querySelector(".stats-section");
  if (statsSection) {
    observer.observe(statsSection);
  }
}

// Función para inicializar colaboradores
function initializeContributors() {
  try { renderContributors(); } catch (err) { console.error('Error renderizando colaboradores:', err); }
  try { updateStats(); } catch (err) { console.warn('Error actualizando estadísticas:', err); }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (window.contributors) {
      contributors = window.contributors;
      initializeContributors();
    } else {
      window.addEventListener('contributorsLoaded', () => {
        try {
          contributors = Array.isArray(window.contributors) ? window.contributors : [];
          initializeContributors();
        } catch (err) {
          console.error('Error al inicializar colaboradores:', err);
        }
      });
    }
  } catch (err) {
    console.error('Error en DOMContentLoaded de contributors:', err);
  }
});
