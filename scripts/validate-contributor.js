// ============================================================================
// 🔍 VALIDADOR DE PR — IEEE CS UNAP
// ============================================================================
// Reglas:
//   1. Solo se permiten cambios en contributors/
//   2. Los archivos en contributors/ deben tener extensión .json
//   3. El contenido debe ser JSON sintácticamente válido
// No se validan campos, formatos ni contenido.
// ============================================================================

'use strict';

const fs   = require('fs');
const path = require('path');

// ── COLORES ───────────────────────────────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  blue:   '\x1b[34m',
  cyan:   '\x1b[36m',
  bold:   '\x1b[1m',
};

// ── OBTENER ARCHIVOS MODIFICADOS ──────────────────────────────────────────────
function getChangedFiles() {
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

  const changedFiles    = getChangedFiles();
  const contributorsDir = path.join(__dirname, '..', 'contributors');

  const summary = { forbiddenFiles: [], jsonResults: [], passed: true };

  // ── 1. Detectar archivos fuera de contributors/ ──────────────────────────
  summary.forbiddenFiles = changedFiles.filter(f => {
    return !f.replace(/\\/g, '/').startsWith('contributors/');
  });

  if (summary.forbiddenFiles.length > 0) {
    summary.passed = false;
    console.log(`${c.red}${c.bold}⛔  ARCHIVOS MODIFICADOS FUERA DE contributors/${c.reset}\n`);
    summary.forbiddenFiles.forEach(f => console.log(`   ${c.red}• ${f}${c.reset}`));
    console.log();
  } else {
    console.log(`${c.green}✅ Todos los archivos modificados están en contributors/${c.reset}\n`);
  }

  // ── 2. Detectar archivos en contributors/ que no sean .json ─────────────
  const nonJson = changedFiles.filter(f => {
    const norm = f.replace(/\\/g, '/');
    return norm.startsWith('contributors/') && !norm.endsWith('.json');
  });

  if (nonJson.length > 0) {
    summary.passed = false;
    console.log(`${c.red}${c.bold}⛔  ARCHIVOS SIN EXTENSIÓN .json EN contributors/${c.reset}\n`);
    nonJson.forEach(f => console.log(`   ${c.red}• ${f}${c.reset}`));
    console.log(`\n   ${c.yellow}Solo se permiten archivos .json en contributors/${c.reset}\n`);
  }

  // ── 3. Determinar qué JSON validar ───────────────────────────────────────
  let prJsonFiles = changedFiles.filter(f => {
    const norm = f.replace(/\\/g, '/');
    return norm.startsWith('contributors/') && norm.endsWith('.json');
  });

  // Modo local (sin CHANGED_FILES): validar todos
  if (changedFiles.length === 0) {
    prJsonFiles = fs.readdirSync(contributorsDir)
      .filter(f => f.endsWith('.json'))
      .map(f => path.join('contributors', f));
  }

  if (prJsonFiles.length === 0) {
    console.log(`${c.yellow}⚠️  No hay archivos .json en contributors/ para validar.${c.reset}\n`);
  }

  // ── 4. Verificar que cada archivo sea JSON válido ─────────────────────────
  prJsonFiles.forEach(relPath => {
    const absPath = path.join(__dirname, '..', relPath);
    console.log(`${c.blue}🔎 Validando: ${relPath}${c.reset}`);

    try {
      JSON.parse(fs.readFileSync(absPath, 'utf-8'));
      console.log(`   ${c.green}✓ JSON válido${c.reset}\n`);
      summary.jsonResults.push({ file: relPath, errors: [] });
    } catch (err) {
      const msg = `Sintaxis JSON inválida: ${err.message}`;
      console.log(`   ${c.red}✗ ${msg}${c.reset}\n`);
      summary.jsonResults.push({ file: relPath, errors: [msg] });
      summary.passed = false;
    }
  });

  // ── 5. Escribir resumen para el workflow ─────────────────────────────────
  fs.writeFileSync(
    path.join(__dirname, '..', 'validation-summary.json'),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );

  // ── 6. Resultado final ────────────────────────────────────────────────────
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
