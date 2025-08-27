# Invoice Maker — Live Customizer (MUI)

Sistema de facturas/cotizaciones con personalización en vivo, templates editables, footer social y salida a impresión igual al preview. Construido con React + Zustand + MUI.

**Estado actual:** `2.2.0-themes-rc` — listo para producción con parches de seguridad y performance.

## ✨ Features Clave

🎨 **Live Customizer (MUI)**: colores, tipografías, radius, zebra, grosor de borde, spacing, tamaño de logo, selección de template.

📄 **7 Templates 95%**: variaciones basadas en las referencias (sin copiar 1:1), todas controladas por tokens.

🔁 **DocType Dinámico**: INVOICE ↔ QUOTE con contenido condicional (Quote oculta Payment Info).

🔗 **Social Footer**: CRUD de enlaces, picker de íconos MUI allowlist + SVG propio (sanitizado).

🖨️ **Print = Preview**: paridad de color y layout; @page para márgenes/tamaño de página.

👤 **Tema por Perfil**: el template y tokens se guardan por perfil y sobreviven refresh.

## 🖼️ Screenshots

- Live Customizer Panel
- Templates Grid  
- Print Preview (PDF)
- Social Footer

## 🚀 Quick Start

```bash
npm i
npm run dev
```

## 🏗️ Build de producción

```bash
npm run build
npm run preview
```

**Dependencias clave:** `@mui/material`, `@mui/icons-material`, `@emotion/*`, `zustand`, `dompurify`.

## 🧭 Estructura relevante

```
src/
  features/
    customizer/
      CustomizerPanelMUI.tsx
      SocialList.tsx
    invoice/
      preview/
        TemplateRenderer.tsx
        FooterBar.tsx
        templates/
          tealInvoice.tsx
          mintBand95.tsx
          navyWave95.tsx
          redBadge95.tsx
          redRibbon95.tsx
          orangeCut95.tsx
          yellowArc95.tsx
      store/
        useInvoice.ts
      lib/format.ts
  theme/
    ThemeVars.tsx
    useTheme.ts
    types.ts
    ProfileThemeBridge.tsx
  ui/
    icons/
      allowlist.tsx
docs/
  images/
```

## 🧩 Uso del Live Customizer

1. Abre la pestaña **Live Customizer**.
2. Ajusta **Accent**, **Text**, **Surface**, **Border**, **Radius**, **Border Width**, **Zebra**, **Fonts**, **Logo Size**.
3. Selecciona un **Template** (7 disponibles, ~95% de las referencias).
4. Cambia **Document Type**: Invoice o Quote.
5. **Social Media & Contact**: añade filas, elige ícono (allowlist MUI) o sube un SVG (≤200KB, sanitizado).
6. **Imprimir** → el PDF sale igual que el preview.

## 🧱 Templates

Todos los templates usan CSS variables (tokens) para que el Customizer tenga efecto inmediato.  
DocType controla el título y el contenido lateral (Payment Info vs Quote Details).

**Nota legal:** son variaciones de las referencias (≈95%), con cambios en radios, ángulos, ondulaciones, jerarquías y paletas.

## 🔒 Seguridad & ⚡ Performance

- **SVG**: Sanitizado con DOMPurify (`USE_PROFILES: svg`, `FORBID_TAGS`, `FORBID_ATTR` con regex `^on`), límite de 200KB.
- **Íconos**: Allowlist de MUI (`Phone`, `Email`, `Instagram`, `WhatsApp`, `Language`, `LocationOn`) con imports estáticos.
- **Print**: `print-color-adjust: exact` y `@page` garantizan paridad con el preview.

## 🧪 QA / Checklist

- ✅ Customizer controla todos los estilos (Invoice Form no tiene personalización).
- ✅ DocType: Quote oculta Payment Info; Invoice lo muestra.
- ✅ Ítems: descripción, precio, qty, total por ítem visibles en los 7 templates.
- ✅ Social Footer: CRUD + ícono MUI allowlist + SVG propio sanitizado (≤200KB).
- ✅ Print = Preview (Chrome/Safari/Firefox).
- ✅ Tema persiste por perfil tras refresh.
- ✅ Build sin arrastrar todo `@mui/icons-material`.

## 🧰 Desarrollo

### Ramas
- **Feature**: `feature/*`  
- **Hotfix**: `hotfix/*`  
- **Docs**: `docs/*`  

### Commits (Convencionales)
- `feat`: nuevas funciones  
- `fix`: bugs  
- `perf`: rendimiento  
- `chore`: tareas internas  
- `refactor`: cambios sin efecto externo  

### Analizar bundle (opcional)
```bash
npm i -D source-map-explorer  
npx source-map-explorer "dist/assets/*.js" --no-border
```

## 📦 Release

```bash
git checkout main
git pull origin main  
git tag v2.2.0-themes-rc
git push origin v2.2.0-themes-rc
```

Publica notas desde `CHANGELOG.md`.

## 🛟 Troubleshooting

- **Sin color al imprimir** → revisa `@media print` y configuración del navegador.
- **SVG no visible** → puede exceder 200KB o tener atributos deshabilitados.
- **Ícono faltante** → asegúrate de estar en la allowlist (`src/ui/icons/allowlist.tsx`).
- **Tema no persiste** → confirma `ProfileThemeBridge.tsx` montado y `updateProfile` disponible.

## 📄 Licencia

TBD. Mientras tanto, derechos reservados.