# Pull Request

> **Title:** usa prefix convencional (feat|fix|docs|perf|refactor|chore): descripción breve  
> **Ej.:** feat: Live Customizer (MUI) + templates 95% + socials + docType + print parity

## Resumen / Summary
- ¿Qué cambia y por qué? 1–3 bullets claros.

## Tipo de cambio / Type of change
- [ ] feat (nueva función)
- [ ] fix (bug)
- [ ] docs (documentación)
- [ ] perf (rendimiento)
- [ ] refactor (sin cambios funcionales)
- [ ] chore (infra/tareas internas)
- [ ] breaking change

## Alcance / Scope (áreas tocadas)
- [ ] Live Customizer (MUI)
- [ ] Templates / Preview
- [ ] Social Footer
- [ ] Print / PDF
- [ ] Theme / Tokens / Bridge
- [ ] Store / Zustand
- [ ] Docs / CI

## Cambios clave / Key changes
- Bullet points de los cambios relevantes (máx 6).

## Cómo probar / How to test
1) Pasos para reproducir el escenario principal  
2) Datos de ejemplo  
3) Resultado esperado

## Capturas / Screenshots or GIFs (UI **obligatorio**)
> Adjunta 2–3: Panel, Preview, Print

---

## QA Checklist (marcar todo antes de pedir review)
- [ ] Customizer controla **todos** los estilos (Invoice Form sin personalización)
- [ ] DocType: `Quote` oculta Payment Info; `Invoice` lo muestra
- [ ] Ítems: **descripción**, **unit price**, **qty**, **line total** en los 7 templates
- [ ] Social Footer: CRUD + MUI allowlist + SVG sanitizado (≤200KB)
- [ ] **Print = Preview** (Chrome/Safari/Firefox)
- [ ] Tema persiste **por perfil** tras refresh
- [ ] Build sin arrastrar todo `@mui/icons-material`
- [ ] No `dangerouslySetInnerHTML` de SVG sin DOMPurify

## Seguridad & Performance / Security & Performance
- [ ] SVG sanitizado con DOMPurify (FORBID_TAGS/ATTR)
- [ ] Iconos MUI con **imports estáticos** (allowlist)
- [ ] No secretos en código / logs
- [ ] Tamaño de bundle revisado (opcional `source-map-explorer`)

## Compatibilidad / Compatibility
- [ ] Sin breaking changes **o** documentados
- [ ] Sin migraciones de datos **o** documentadas

## Documentación / Docs
- [ ] README actualizado (ES/EN) si aplica
- [ ] CHANGELOG actualizado si aplica
- [ ] Screenshots en `docs/images/` si aplica

## Issues vinculados / Linked issues
Closes #___  (o) Relates to #___

## Notas de release / Release notes
- Una línea clara para el changelog.
