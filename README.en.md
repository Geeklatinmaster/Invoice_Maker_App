# Invoice Maker — Live Customizer (MUI)

Invoice/Quote system with live customization, editable templates, social footer, and print output identical to preview. Built with React + Zustand + MUI.

**Current state:** `2.2.0-themes-rc` — production-ready with security and performance patches.

## ✨ Key Features

🎨 **Live Customizer (MUI)**: colors, typography, radius, zebra rows, border width, spacing, logo size, template selection.

📄 **7 Templates (~95% fidelity)**: variations inspired by provided references (not 1:1), all controlled by tokens.

🔁 **Dynamic DocType**: INVOICE ↔ QUOTE with conditional content (Quote hides Payment Info).

🔗 **Social Footer**: CRUD links, MUI icon allowlist + custom sanitized SVG.

🖨️ **Print = Preview**: color and layout parity; @page for page margins/size.

👤 **Per-Profile Theme**: template/tokens are tied to the selected profile and persist across refresh.

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

## 🏗️ Production Build

```bash
npm run build
npm run preview
```

**Key deps:** `@mui/material`, `@mui/icons-material`, `@emotion/*`, `zustand`, `dompurify`.

## 🧭 Relevant Structure

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

## 🧩 Using the Live Customizer

1. Open **Live Customizer** tab.
2. Adjust **Accent**, **Text**, **Surface**, **Border**, **Radius**, **Border Width**, **Zebra**, **Fonts**, **Logo Size**.
3. Pick a **Template** (7 options, ~95% of references).
4. Switch **Document Type**: Invoice or Quote.
5. **Social Media & Contact**: add rows, pick an icon (MUI allowlist) or upload a SVG (≤200KB, sanitized).
6. **Print** → PDF matches preview exactly.

## 🧱 Templates

All templates rely on CSS variables (tokens) so the Customizer updates instantly.  
DocType drives the title and the side panel (Payment Info vs Quote Details).

**Legal note:** these are variations (~95%) of the supplied references—adjusted radii, angles/waves, hierarchy, and palette.

## 🔒 Security & ⚡ Performance

- **SVG**: Sanitized with DOMPurify (`USE_PROFILES: svg`, `FORBID_TAGS`, `FORBID_ATTR` with `^on` regex), 200KB size limit.
- **Icons**: MUI allowlist (`Phone`, `Email`, `Instagram`, `WhatsApp`, `Language`, `LocationOn`) with static imports for proper tree-shaking.
- **Print**: `print-color-adjust: exact` and `@page` to guarantee parity with the preview.

## 🧪 QA / Checklist

- ✅ Customizer controls all styling (no personalization left in Invoice Form).
- ✅ DocType: Quote hides Payment Info; Invoice shows it.
- ✅ Items show description, unit price, qty, line total across all 7 templates.
- ✅ Social Footer: CRUD + MUI allowlist icon + sanitized custom SVG (≤200KB).
- ✅ Print = Preview (Chrome/Safari/Firefox).
- ✅ Theme persists per profile after refresh.
- ✅ Build does not include the entire `@mui/icons-material` package.

## 🧰 Development

### Branches
- **Feature**: `feature/*`  
- **Hotfix**: `hotfix/*`  
- **Docs**: `docs/*`  

### Conventional Commits
- `feat`: new features  
- `fix`: bug fixes  
- `perf`: performance  
- `chore`: internal tasks  
- `refactor`: non-breaking refactors  

### Bundle analysis (optional)
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

Publish release notes from `CHANGELOG.md`.

## 🛟 Troubleshooting

- **No colors in print** → ensure `@media print` includes `print-color-adjust: exact` and browser allows color printing.
- **SVG not visible** → may exceed 200KB or contain forbidden attributes.
- **Missing icon** → confirm it's in the allowlist (`src/ui/icons/allowlist.tsx`).
- **Theme not persisting** → verify `ProfileThemeBridge.tsx` is mounted and `updateProfile` is present.

## 📄 License

TBD. All rights reserved until decided.