// Lee los JSON de contributors/ y genera public/index.json
// Uso: node scripts/generate-contributors.js

const fs = require("fs");
const path = require("path");

const c = {
  reset: "\x1b[0m", red: "\x1b[31m", green: "\x1b[32m",
  yellow: "\x1b[33m", blue: "\x1b[34m", cyan: "\x1b[36m",
};

function validateContributor(contributor, filename) {
  const errors = [];
  if (!contributor.name || contributor.name.trim() === "")     errors.push("El campo 'name' es obligatorio");
  if (!contributor.nickname || contributor.nickname.trim() === "") errors.push("El campo 'nickname' es obligatorio");
  if (!Array.isArray(contributor.hobbies))                     errors.push("El campo 'hobbies' debe ser un array");
  else if (contributor.hobbies.length < 1)                     errors.push("Debe haber al menos 1 hobby");
  else if (contributor.hobbies.length > 5)                     errors.push("No puede haber más de 5 hobbies");

  if (errors.length > 0) {
    console.error(`${c.red}❌ Error en ${filename}:${c.reset}`);
    errors.forEach(e => console.error(`   ${c.red}• ${e}${c.reset}`));
    return false;
  }
  return true;
}

function generateContributors() {
  console.log(`\n${c.cyan}${"=".repeat(50)}${c.reset}`);
  console.log(`${c.cyan}  GENERADOR DE COLABORADORES${c.reset}`);
  console.log(`${c.cyan}${"=".repeat(50)}${c.reset}\n`);

  const contributorsDir = path.join(__dirname, "..", "contributors");

  if (!fs.existsSync(contributorsDir)) {
    console.error(`${c.red}❌ No se encontró la carpeta 'contributors/'${c.reset}`);
    process.exit(1);
  }

  const files = fs.readdirSync(contributorsDir).filter(f => f.endsWith(".json"));

  if (files.length === 0) {
    console.error(`${c.red}❌ No hay archivos JSON en contributors/${c.reset}\n`);
    process.exit(1);
  }

  const contributors = [];
  let invalid = 0;

  files.forEach(file => {
    const filePath = path.join(contributorsDir, file);
    try {
      const contributor = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      if (validateContributor(contributor, file)) {
        contributors.push(contributor);
        console.log(`${c.green}✅ ${file}${c.reset}`);
      } else {
        invalid++;
      }
    } catch (err) {
      console.error(`${c.red}❌ Error al procesar ${file}: ${err.message}${c.reset}`);
      invalid++;
    }
  });

  if (invalid > 0) {
    console.log(`\n${c.red}❌ ${invalid} archivo(s) con errores. Corrige y vuelve a ejecutar.${c.reset}\n`);
    process.exit(1);
  }

  contributors.sort((a, b) => a.nickname.toLowerCase().localeCompare(b.nickname.toLowerCase()));

  const publicDir = path.join(__dirname, "..", "public");
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  fs.writeFileSync(path.join(publicDir, "index.json"), JSON.stringify(contributors, null, 2), "utf-8");

  console.log(`\n${c.cyan}${"=".repeat(50)}${c.reset}`);
  console.log(`${c.green}✅ ${contributors.length} colaboradores procesados${c.reset}`);
  console.log(`${c.blue}📁 public/index.json generado${c.reset}`);
  console.log(`${c.cyan}${"=".repeat(50)}${c.reset}\n`);
}

generateContributors();
