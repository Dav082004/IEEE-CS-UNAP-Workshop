// ============================================================================
// IEEE CS UNAP — AGREGAR CONTRIBUIDOR
// Lógica de formulario, validación, generación de JSON y descarga
// ============================================================================

'use strict';

// ── CONSTANTES ──────────────────────────────────────────────────────────────
const MAX_HOBBIES   = 4;
const MIN_HOBBIES   = 1;
const MAX_DESC      = 200;
const STEP_DELAY_MS = 700;

// Regex permisivos para usuarios de redes sociales (solo básico)
const NICKNAME_RE  = /^[a-zA-Z0-9_.\-]{1,40}$/;
const GITHUB_RE    = /^[a-zA-Z0-9_.\-]{1,60}$/;
const URL_SAFE_RE  = /^(https?:\/\/)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]{1,300}$/;

// ── ESTADO ──────────────────────────────────────────────────────────────────
let generatedBlob     = null;
let generatedFilename = 'tu-nickname.json';
let avatarDebounce    = null;

// ── INICIALIZACIÓN ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    try {
        initMobileMenu();
        initHobbies();
        initLivePreview();
        initForm();
        initDownload();
        initReset();
    } catch (err) {
        console.error('Error al inicializar la página:', err);
    }
});

// ── MENÚ MÓVIL ──────────────────────────────────────────────────────────────
function initMobileMenu() {
    const toggle  = document.getElementById('mobileMenuToggle');
    const nav     = document.getElementById('headerNav');
    const overlay = document.getElementById('mobileOverlay');

    if (!toggle || !nav || !overlay) return;

    const open  = () => { nav.classList.add('active'); overlay.classList.add('active'); toggle.classList.add('active'); document.body.style.overflow = 'hidden'; };
    const close = () => { nav.classList.remove('active'); overlay.classList.remove('active'); toggle.classList.remove('active'); document.body.style.overflow = ''; };

    toggle.addEventListener('click', () => nav.classList.contains('active') ? close() : open());
    overlay.addEventListener('click', close);
    nav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 768) close(); });
}

// ── HOBBIES DINÁMICOS ────────────────────────────────────────────────────────
function initHobbies() {
    const container  = document.getElementById('hobbiesContainer');
    const addBtn     = document.getElementById('addHobbyBtn');

    if (!container || !addBtn) return;

    // Escuchar cambios en el contenedor (delegación)
    container.addEventListener('input', () => { updateAddBtn(); updatePreview(); });
    container.addEventListener('click', e => {
        const btn = e.target.closest('.ac-hobby-remove');
        if (!btn) return;
        const row = btn.closest('.ac-hobby-row');
        if (!row) return;
        row.remove();
        updateRemoveButtons();
        updateAddBtn();
        updatePreview();
    });

    addBtn.addEventListener('click', () => {
        const count = container.querySelectorAll('.ac-hobby-row').length;
        if (count >= MAX_HOBBIES) return;
        addHobbyRow(container);
        updateRemoveButtons();
        updateAddBtn();
    });

    updateRemoveButtons();
    updateAddBtn();
}

function addHobbyRow(container, value = '') {
    const row = document.createElement('div');
    row.className = 'ac-hobby-row';
    row.innerHTML = `
        <input type="text" class="ac-input ac-hobby-input" placeholder="Ej: Gaming" maxlength="40" value="${escapeHtml(value)}" />
        <button type="button" class="ac-hobby-remove" aria-label="Quitar hobby">
            <i class="fas fa-times"></i>
        </button>`;
    container.appendChild(row);
    row.querySelector('.ac-hobby-input').focus();
}

function updateRemoveButtons() {
    const container = document.getElementById('hobbiesContainer');
    if (!container) return;
    const rows = container.querySelectorAll('.ac-hobby-row');
    rows.forEach((row, i) => {
        const btn = row.querySelector('.ac-hobby-remove');
        if (btn) btn.style.display = rows.length > 1 ? 'flex' : 'none';
    });
}

function updateAddBtn() {
    const container = document.getElementById('hobbiesContainer');
    const addBtn    = document.getElementById('addHobbyBtn');
    if (!container || !addBtn) return;
    const count = container.querySelectorAll('.ac-hobby-row').length;
    addBtn.disabled = count >= MAX_HOBBIES;
    addBtn.title    = count >= MAX_HOBBIES ? `Máximo ${MAX_HOBBIES} hobbies permitidos` : '';
}

function getHobbies() {
    const container = document.getElementById('hobbiesContainer');
    if (!container) return [];
    return Array.from(container.querySelectorAll('.ac-hobby-input'))
        .map(i => i.value.trim())
        .filter(v => v.length > 0);
}

// ── LIVE PREVIEW ─────────────────────────────────────────────────────────────
function initLivePreview() {
    const fields = ['f-name', 'f-nick', 'f-github', 'f-linkedin', 'f-instagram', 'f-image', 'f-desc'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updatePreview);
    });

    // Contador de caracteres para descripción
    const descEl = document.getElementById('f-desc');
    const counter = document.getElementById('desc-count');
    if (descEl && counter) {
        descEl.addEventListener('input', () => {
            const len = descEl.value.length;
            counter.textContent = len;
            counter.parentElement.classList.toggle('ac-over', len > MAX_DESC);
        });
    }

    // Actualizar hint del nombre de archivo según nickname
    const nickEl = document.getElementById('f-nick');
    if (nickEl) {
        nickEl.addEventListener('input', () => {
            const val = nickEl.value.trim() || 'tu-nickname';
            const safe = sanitizeFilename(val);
            const hintEl  = document.getElementById('hint-filename');
            const previewEl = document.getElementById('preview-filename');
            const step3El   = document.getElementById('step3-filename');
            if (hintEl) hintEl.textContent = safe + '.json';
            if (previewEl) previewEl.textContent = safe + '.json';
            if (step3El)   step3El.textContent   = safe + '.json';
        });
    }

    updatePreview();
}

function updatePreview() {
    const data = getFormData();
    const json = buildJSON(data);

    const codeEl = document.getElementById('jsonPreviewCode');
    if (codeEl) codeEl.textContent = JSON.stringify(json, null, 2);

    updateAvatarPreview(data);
}

function getFormData() {
    const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const nick    = val('f-nick');
    const github  = val('f-github');

    return {
        name:        val('f-name'),
        nickname:    nick,
        github:      github ? `https://github.com/${github}` : '',
        linkedin:    val('f-linkedin') ? `https://www.linkedin.com/in/${val('f-linkedin')}` : '',
        instagram:   val('f-instagram') ? `https://www.instagram.com/${val('f-instagram')}/` : '',
        image:       val('f-image') || (github ? `https://github.com/${github}.png` : ''),
        description: val('f-desc'),
        hobbies:     getHobbies(),
    };
}

function buildJSON(data) {
    const obj = { name: data.name, nickname: data.nickname };
    if (data.github)    obj.github    = data.github;
    if (data.linkedin)  obj.linkedin  = data.linkedin;
    if (data.instagram) obj.instagram = data.instagram;
    if (data.image)     obj.image     = data.image;
    obj.description = data.description;
    obj.hobbies     = data.hobbies;
    return obj;
}

function updateAvatarPreview(data) {
    const wrap = document.getElementById('avatarImgWrap');
    const initSpan = document.getElementById('avatarInitials');
    if (!wrap) return;

    // Debounce para no hacer muchas peticiones mientras el usuario escribe
    clearTimeout(avatarDebounce);
    avatarDebounce = setTimeout(() => {
        if (data.image) {
            let existing = wrap.querySelector('img');
            if (!existing) {
                existing = document.createElement('img');
                existing.alt = 'Avatar preview';
                existing.onerror = () => { existing.remove(); showInitials(initSpan, data.name); };
                wrap.innerHTML = '';
                wrap.appendChild(existing);
            }
            existing.src = data.image;
            if (initSpan) initSpan.style.display = 'none';
        } else {
            const existingImg = wrap.querySelector('img');
            if (existingImg) existingImg.remove();
            showInitials(initSpan, data.name);
        }
    }, 600);
}

function showInitials(span, name) {
    if (!span) return;
    span.style.display = '';
    if (name) {
        const parts = name.trim().split(/\s+/);
        span.textContent = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    } else {
        span.textContent = '?';
    }
}

// ── VALIDACIÓN ───────────────────────────────────────────────────────────────
function validateForm() {
    let ok = true;

    // Nombre
    const name = document.getElementById('f-name');
    if (!name || name.value.trim().length < 2) {
        showError('err-name', 'El nombre debe tener al menos 2 caracteres.');
        markField(name, false); ok = false;
    } else {
        clearError('err-name'); markField(name, true);
    }

    // Nickname
    const nick = document.getElementById('f-nick');
    if (!nick || nick.value.trim().length === 0) {
        showError('err-nick', 'El nickname es obligatorio.');
        markField(nick, false); ok = false;
    } else if (!NICKNAME_RE.test(nick.value.trim())) {
        showError('err-nick', 'Solo letras, números, guion y punto. Sin espacios.');
        markField(nick, false); ok = false;
    } else {
        clearError('err-nick'); markField(nick, true);
    }

    // GitHub (opcional pero si se pone debe ser válido)
    const github = document.getElementById('f-github');
    if (github && github.value.trim() && !GITHUB_RE.test(github.value.trim())) {
        showError('err-github', 'Usuario de GitHub inválido.');
        markField(github, false); ok = false;
    } else {
        clearError('err-github'); if (github && github.value.trim()) markField(github, true);
    }

    // Imagen (si se pone debe ser una URL válida)
    const image = document.getElementById('f-image');
    if (image && image.value.trim() && !URL_SAFE_RE.test(image.value.trim())) {
        showError('err-image', 'La URL de la imagen no parece válida.');
        markField(image, false); ok = false;
    } else {
        clearError('err-image');
    }

    // Descripción
    const desc = document.getElementById('f-desc');
    if (!desc || desc.value.trim().length < 5) {
        showError('err-desc', 'La descripción debe tener al menos 5 caracteres.');
        markField(desc, false); ok = false;
    } else if (desc.value.trim().length > MAX_DESC) {
        showError('err-desc', `Máximo ${MAX_DESC} caracteres.`);
        markField(desc, false); ok = false;
    } else {
        clearError('err-desc'); markField(desc, true);
    }

    // Hobbies
    const hobbies = getHobbies();
    if (hobbies.length < MIN_HOBBIES) {
        showError('err-hobbies', `Debes agregar al menos ${MIN_HOBBIES} hobby.`);
        ok = false;
    } else if (hobbies.length > MAX_HOBBIES) {
        showError('err-hobbies', `Máximo ${MAX_HOBBIES} hobbies. Tienes ${hobbies.length}.`);
        ok = false;
    } else {
        clearError('err-hobbies');
    }

    return ok;
}

function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
}
function clearError(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
}
function markField(input, valid) {
    if (!input) return;
    input.classList.toggle('ac-valid',   valid);
    input.classList.toggle('ac-invalid', !valid);
}

// ── FORMULARIO: SUBMIT ────────────────────────────────────────────────────────
function initForm() {
    const form = document.getElementById('contributorForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!validateForm()) return;

        const btn = document.getElementById('generateBtn');
        if (btn) btn.disabled = true;

        try {
            await runGenerationSteps();
        } catch (err) {
            console.error('Error al generar el archivo:', err);
            alert('Ocurrió un error inesperado. Por favor inténtalo de nuevo.');
            if (btn) btn.disabled = false;
        }
    });
}

// ── PASOS ANIMADOS ────────────────────────────────────────────────────────────
async function runGenerationSteps() {
    const section = document.getElementById('stepsSection');
    const result  = document.getElementById('acResult');
    if (!section) return;

    // Mostrar sección
    section.classList.add('ac-visible');
    if (result) result.classList.remove('ac-visible');

    // Scroll hacia los pasos
    setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

    // Resetear todos los pasos
    resetAllSteps();

    // Paso 1: Validar
    await runStep(1, 'Validando datos',
        '<i class="fas fa-circle-notch fa-spin"></i>',
        '<i class="fas fa-check"></i>');

    // Paso 2: Generar estructura
    await runStep(2, 'Generando estructura JSON',
        '<i class="fas fa-circle-notch fa-spin"></i>',
        '<i class="fas fa-check"></i>');

    // Recoger datos y construir JSON real
    const data      = getFormData();
    const json      = buildJSON(data);
    const jsonStr   = JSON.stringify(json, null, 2);
    const nick      = sanitizeFilename(data.nickname || 'perfil');
    generatedFilename = nick + '.json';

    // Paso 3: Crear archivo
    await runStep(3, `Creando ${generatedFilename}`,
        '<i class="fas fa-circle-notch fa-spin"></i>',
        '<i class="fas fa-check"></i>');

    // Generar Blob
    generatedBlob = new Blob([jsonStr], { type: 'application/json; charset=utf-8' });

    // Paso 4: Listo
    await runStep(4, '¡Archivo listo!',
        '<i class="fas fa-circle-notch fa-spin"></i>',
        '<i class="fas fa-check"></i>');

    // Mostrar resultado
    showResult(generatedFilename);
}

async function runStep(stepNum, runningTitle, runningStatusHtml, doneStatusHtml) {
    const step = document.querySelector(`.ac-step[data-step="${stepNum}"]`);
    if (!step) return;

    // Estado: corriendo
    step.classList.add('ac-step-running');
    const titleEl  = step.querySelector('.ac-step-title');
    const statusEl = step.querySelector('.ac-step-status');
    if (titleEl)  titleEl.textContent  = runningTitle;
    if (statusEl) statusEl.innerHTML   = runningStatusHtml;

    await delay(STEP_DELAY_MS);

    // Estado: hecho
    step.classList.remove('ac-step-running');
    step.classList.add('ac-step-done');
    if (statusEl) statusEl.innerHTML = doneStatusHtml;
}

function resetAllSteps() {
    document.querySelectorAll('.ac-step').forEach(s => {
        s.classList.remove('ac-step-running', 'ac-step-done', 'ac-step-error');
        const status = s.querySelector('.ac-step-status');
        if (status) status.innerHTML = '';
    });
}

function showResult(filename) {
    const result = document.getElementById('acResult');
    if (!result) return;

    const fnEls = [
        document.getElementById('result-filename'),
        document.getElementById('next-filename'),
    ];
    fnEls.forEach(el => { if (el) el.textContent = filename; });

    result.classList.add('ac-visible');
}

// ── DESCARGA ──────────────────────────────────────────────────────────────────
function initDownload() {
    const btn = document.getElementById('downloadBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!generatedBlob) return;

        try {
            const url = URL.createObjectURL(generatedBlob);
            const a   = document.createElement('a');
            a.href     = url;
            a.download = generatedFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 10000);
        } catch (err) {
            console.error('Error al descargar el archivo:', err);
            alert('No se pudo descargar el archivo. Inténtalo de nuevo.');
        }
    });
}

// ── RESET ──────────────────────────────────────────────────────────────────────
function initReset() {
    const btn = document.getElementById('resetBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        generatedBlob     = null;
        generatedFilename = 'tu-nickname.json';

        // Limpiar formulario
        const form = document.getElementById('contributorForm');
        if (form) form.reset();

        // Limpiar errores y clases de validación
        document.querySelectorAll('.ac-error').forEach(e => e.textContent = '');
        document.querySelectorAll('.ac-input').forEach(i => {
            i.classList.remove('ac-valid', 'ac-invalid');
        });

        // Reiniciar hobbies
        const container = document.getElementById('hobbiesContainer');
        if (container) {
            container.innerHTML = `
                <div class="ac-hobby-row">
                    <input type="text" class="ac-input ac-hobby-input" placeholder="Ej: Programación" maxlength="40" />
                    <button type="button" class="ac-hobby-remove" aria-label="Quitar hobby" style="display:none">
                        <i class="fas fa-times"></i>
                    </button>
                </div>`;
        }

        // Reiniciar hints
        const hintEl    = document.getElementById('hint-filename');
        const previewEl = document.getElementById('preview-filename');
        const step3El   = document.getElementById('step3-filename');
        if (hintEl)    hintEl.textContent    = 'tu-nickname.json';
        if (previewEl) previewEl.textContent  = 'tu-nickname.json';
        if (step3El)   step3El.textContent    = 'tu-nickname.json';

        // Reiniciar contador
        const counter = document.getElementById('desc-count');
        if (counter) { counter.textContent = '0'; counter.parentElement.classList.remove('ac-over'); }

        // Ocultar sección de pasos y resultado
        const section = document.getElementById('stepsSection');
        const result  = document.getElementById('acResult');
        if (section) section.classList.remove('ac-visible');
        if (result)  result.classList.remove('ac-visible');

        // Habilitar botón generar
        const genBtn = document.getElementById('generateBtn');
        if (genBtn) genBtn.disabled = false;

        // Reiniciar preview
        updatePreview();

        // Scroll al formulario
        document.getElementById('contributorForm')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// ── UTILIDADES ─────────────────────────────────────────────────────────────────
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sanitizeFilename(str) {
    return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // quitar tildes
        .replace(/[^a-z0-9_.\-]/g, '-')                    // solo chars seguros
        .replace(/-{2,}/g, '-')                             // no doble guion
        .replace(/^-+|-+$/g, '');                           // no guion al inicio/fin
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
