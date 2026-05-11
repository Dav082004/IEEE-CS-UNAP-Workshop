# 📁 Assets - Recursos del Proyecto

Esta carpeta contiene todos los recursos estáticos del proyecto organizados por categoría.

## 📂 Estructura

```
assets/
├── images/          # Imágenes generales del proyecto
│   └── Github.png   # Logo de GitHub
├── guides-v1/       # Guía paso a paso versión 1 (Contribución básica)
│   ├── Paso1.png
│   ├── Paso2.png
│   └── ...
└── guides-v2/       # Guía paso a paso versión 2 (Contribución con Codespace)
    ├── Paso1.png
    ├── Paso2.png
    └── ...
```

## 🎨 Uso de Assets

### Logos

Los logos se utilizan en:
- Footer de la página principal
- Página "Cómo Contribuir"
- Documentación y README

**Nota:** Respetar los lineamientos de marca de cada organización.

### Imágenes

Imágenes generales del proyecto que se usan en múltiples lugares.

### Guías

Capturas de pantalla paso a paso para ayudar a los colaboradores:

- **guides-v1**: Guía de contribución local (método tradicional)
- **guides-v2**: Guía de contribución con GitHub Codespace (recomendado)

## ➕ Agregar Nuevos Assets

1. **Coloca el archivo en la carpeta apropiada**
   ```bash
   # Ejemplo: Agregar un nuevo logo
   cp mi-logo.png assets/logos/
   ```

2. **Usa nombres descriptivos**
   - ✅ `logo-organizacion-nombre.png`
   - ✅ `captura-paso-5-commit.png`
   - ❌ `imagen1.png`
   - ❌ `screenshot.png`

3. **Optimiza las imágenes**
   - Usa formatos web apropiados (PNG para logos, JPG para fotos)
   - Comprime las imágenes antes de subirlas
   - Mantén resoluciones razonables (no más de 1920px de ancho)

## 📏 Convenciones

- **Nombres en minúsculas** con guiones: `mi-imagen.png`
- **Formatos preferidos**: PNG (transparencias), JPG (fotos), SVG (vectores)
- **Tamaño**: Optimizar para web (<500KB preferiblemente)

## 🚫 No Incluir

- ❌ Archivos PSD, AI, XCF (archivos fuente de edición)
- ❌ Imágenes sin optimizar o muy pesadas
- ❌ Screenshots con información sensible
- ❌ Contenido con derechos de autor sin permiso
