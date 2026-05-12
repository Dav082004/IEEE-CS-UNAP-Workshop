// ============================================================================
// 🔍 VALIDADOR DE PR — IEEE CS UNAP
// ============================================================================
// Valida que la PR solo modifique archivos en contributors/ y que cada JSON
// tenga la estructura correcta.
//
// Uso: node scripts/validate-contributor.js [archivo1.json ...]
// Si no se pasan argumentos, valida todos los archivos en contributors/
// ============================================================================

'use strict';

const fs   = require('fs');
const path = require('path');

// ── REGLAS DE VALIDACIÓN ─────────────────────────────────────────────────────
const REQUIRED_FIELDS  = ['name', 'nickname', 'description', 'hobbies'];
const MAX_HOBBIES      = 4;
const MIN_HOBBIES      = 1;
const MAX_DESC_LEN     = 200;
const MAX_NAME_LEN     = 80;
const MAX_NICK_LEN     = 40;
const NICKNAME_RE      = /^[a-zA-Z0-9_.\-]{1,40}$/;
const GITHUB_URL_RE    = /^https:\/\/github\.com\/[a-zA-Z0-9_.\-]+$/;
const LINKEDIN_URL_RE  = /^https:\/\/(www\.)?linkedin\.com\/in\/.+$/;
const INSTAGRAM_URL_RE = /^https:\/\/(www\.)?instagram\.com\/.+\/$/;
const URL_RE           = /^https?:\/\/.+/;

// ── COLORES ───────────────────────────────────────────────────────────────────
const c = {
  reset:   '\x1b[0m',
  red:     '\x1b[31m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  blue:    '\x1b[34m',
  cyan:    '\x1b[36m',
  bold:    '\x1b[1m',
};

// ── VALIDADOR PRINCIPAL ───────────────────────────────────────────────────────
function validateContributor(data, filename) {
  const errors   = [];
  const warnings = [];

  // Nombre del archivo debe coincidir con nickname (solo advertencia)
  const expectedFile = `${data.nickname ? sanitize(data.nickname) : '?'}.json`;
  if (data.nickname && path.basename(filename) !== expectedFile) {
    warnings.push(
      `El archivo se llama "${path.basename(filename)}" pero el nickname es "${data.nickname}". ` +
      `El nombre esperado sería "${expectedFile}".`
    );
  }

  // Campos obligatorios presentes
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`Campo obligatorio ausente o vacío: \`${field}\``);
    }
  }

  // name
  if (data.name !== undefined) {
    if (typeof data.name !== 'string') {
      errors.push('`name` debe ser una cadena de texto');
    } else if (data.name.trim().length < 2) {
      errors.push('`name` debe tener al menos 2 caracteres');
    } else if (data.name.length > MAX_NAME_LEN) {
      errors.push(`\`name\` supera el máximo de ${MAX_NAME_LEN} caracteres`);
    }
  }

  // nickname
  if (data.nickname !== undefined) {
    if (typeof data.nickname !== 'string') {
      errors.push('`nickname` debe ser una cadena de texto');
    } else if (!NICKNAME_RE.test(data.nickname)) {
      errors.push(
        `\`nickname\` inválido: "${data.nickname}". Solo se permiten letras, números, guion (-) y punto (.). Sin espacios.`
      );
    } else if (data.nickname.length > MAX_NICK_LEN) {
      errors.push(`\`nickname\` supera el máximo de ${MAX_NICK_LEN} caracteres`);
    }
  }

  // github
  if (data.github !== undefined && data.github !== '') {
    if (!GITHUB_URL_RE.test(data.github)) {
      errors.push(
        `\`github\` no tiene el formato correcto. Debe ser: \`https://github.com/tu-usuario\`. ` +
        `Valor actual: \`${data.github}\``
      );
    }
  }

  // linkedin (opcional)
  if (data.linkedin !== undefined && data.linkedin !== '') {
    if (!LINKEDIN_URL_RE.test(data.linkedin)) {
      errors.push(
        `\`linkedin\` no tiene el formato correcto. Debe ser: \`https://www.linkedin.com/in/tu-perfil\`. ` +
        `Valor actual: \`${data.linkedin}\``
      );
    }
  }

  // instagram (opcional)
  if (data.instagram !== undefined && data.instagram !== '') {
    if (!INSTAGRAM_URL_RE.test(data.instagram)) {
      errors.push(
        `\`instagram\` no tiene el formato correcto. Debe ser: \`https://www.instagram.com/tu-usuario/\`. ` +
        `Valor actual: \`${data.instagram}\``
      );
    }
  }

  // image (opcional)
  if (data.image !== undefined && data.image !== '') {
    if (!URL_RE.test(data.image)) {
      errors.push(
        `\`image\` debe ser una URL válida que empiece con http:// o https://. ` +
        `Valor actual: \`${data.image}\``
      );
    }
  }

  // description
  if (typeof data.description === 'string') {
    if (data.description.trim().length < 5) {
      errors.push('`description` debe tener al menos 5 caracteres');
    } else if (data.description.length > MAX_DESC_LEN) {
      errors.push(`\`description\` supera el máximo de ${MAX_DESC_LEN} caracteres (tiene ${data.description.length})`);
    }
  }

  // hobbies
  if (data.hobbies !== undefined) {
    if (!Array.isArray(data.hobbies)) {
      errors.push('`hobbies` debe ser un array. Ejemplo: `["Programación", "Gaming"]`');
    } else {
      if (data.hobbies.length < MIN_HOBBIES) {
        errors.push(`\`hobbies\` debe tener al menos ${MIN_HOBBIES} elemento`);
      }
      if (data.hobbies.length > MAX_HOBBIES) {
        errors.push(
          `\`hobbies\` tiene ${data.hobbies.length} elementos pero el máximo es ${MAX_HOBBIES}. ` +
          `El pipeline fallará si supera este límite.`
        );
      }
      data.hobbies.forEach((h, i) => {
        if (typeof h !== 'string' || h.trim() === '') {
          errors.push(`\`hobbies[${i}]\` debe ser una cadena de texto no vacía`);
        }
      });
    }
  }

  // Campos desconocidos (advertencia)
  const knownFields = ['name', 'nickname', 'github', 'linkedin', 'instagram', 'image', 'description', 'hobbies'];
  Object.keys(data).forEach(k => {
    if (!knownFields.includes(k)) {
      warnings.push(`Campo desconocido ignorado: \`${k}\``);
    }
  });

  return { errors, warnings };
}

function sanitize(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_.\-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── LÓGICA DE ARCHIVOS MODIFICADOS ────────────────────────────────────────────
function getChangedFiles() {
  // Se puede pasar como argumentos o leer de una env var del workflow
  const args = process.argv.slice(2);
  if (args.length > 0) return args;

  const envFiles = process.env.CHANGED_FILES;
  if (envFiles) return envFiles.split('\n').filter(Boolean);

  return [];
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
function main() {
  console.log(`\n${c.cyan}${c.bold}${'═'.repeat(60)}${c.reset}`);
  console.log(`${c.cyan}${c.bold}  🔍 VALIDADOR DE CONTRIBUCIONES — IEEE CS UNAP${c.reset}`);
  console.log(`${c.cyan}${c.bold}${'═'.repeat(60)}${c.reset}\n`);

  const changedFiles = getChangedFiles();
  const contributorsDir = path.join(__dirname, '..', 'contributors');

  // ── 1. Detectar archivos fuera de contributors/ ──────────────────────────
  const forbiddenFiles = changedFiles.filter(f => {
    const normalized = f.replace(/\\/g, '/');
    return !normalized.startsWith('contributors/');
  });

  const summary = {
    forbiddenFiles,
    jsonResults: [],
    passed: true,
  };

  if (forbiddenFiles.length > 0) {
    summary.passed = false;
    console.log(`${c.red}${c.bold}⛔  ARCHIVOS MODIFICADOS FUERA DE contributors/${c.reset}\n`);
    forbiddenFiles.forEach(f => console.log(`   ${c.red}• ${f}${c.reset}`));
    console.log();
  } else {
    console.log(`${c.green}✅ Todos los archivos modificados están en contributors/${c.reset}\n`);
  }

  // ── 2. Validar cada JSON en contributors/ de la PR ───────────────────────
  const prJsonFiles = changedFiles.filter(f => {
    const normalized = f.replace(/\\/g, '/');
    return normalized.startsWith('contributors/') && normalized.endsWith('.json');
  });

  if (prJsonFiles.length === 0 && forbiddenFiles.length === 0) {
    // Modo local: validar todos
    const allFiles = fs.readdirSync(contributorsDir)
      .filter(f => f.endsWith('.json'))
      .map(f => path.join('contributors', f));
    prJsonFiles.push(...allFiles);
  }

  if (prJsonFiles.length === 0) {
    console.log(`${c.yellow}⚠️  No se encontraron archivos JSON en contributors/ para validar.${c.reset}\n`);
  }

  prJsonFiles.forEach(relPath => {
    const absPath = path.join(__dirname, '..', relPath);
    const filename = path.basename(relPath);
    console.log(`${c.blue}🔎 Validando: ${relPath}${c.reset}`);

    let parsed;
    try {
      const raw = fs.readFileSync(absPath, 'utf-8');
      parsed = JSON.parse(raw);
    } catch (err) {
      const msg = `Sintaxis JSON inválida: ${err.message}`;
      console.log(`   ${c.red}✗ ${msg}${c.reset}\n`);
      summary.jsonResults.push({ file: relPath, errors: [msg], warnings: [] });
      summary.passed = false;
      return;
    }

    const { errors, warnings } = validateContributor(parsed, relPath);

    warnings.forEach(w => console.log(`   ${c.yellow}⚠ ${w}${c.reset}`));

    if (errors.length === 0) {
      console.log(`   ${c.green}✓ Estructura correcta${c.reset}\n`);
    } else {
      summary.passed = false;
      errors.forEach(e => console.log(`   ${c.red}✗ ${e}${c.reset}`));
      console.log();
    }

    summary.jsonResults.push({ file: relPath, errors, warnings });
  });

  // ── 3. Escribir resumen como JSON para el workflow ────────────────────────
  const summaryPath = path.join(__dirname, '..', 'validation-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');

  // ── 4. Resultado final ────────────────────────────────────────────────────
  console.log(`${c.cyan}${'═'.repeat(60)}${c.reset}`);
  if (summary.passed) {
    console.log(`${c.green}${c.bold}  ✅ VALIDACIÓN EXITOSA — Todo correcto.${c.reset}`);
    console.log(`${c.cyan}${'═'.repeat(60)}${c.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${c.red}${c.bold}  ❌ VALIDACIÓN FALLIDA — Hay errores que corregir.${c.reset}`);
    console.log(`${c.cyan}${'═'.repeat(60)}${c.reset}\n`);
    process.exit(1);
  }
}

main();
