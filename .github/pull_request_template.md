## Summary
- Implement robust regenerate flow (idempotent) and auto totals recompute.

## Changes
- Canonical store: @/features/invoice/store/useInvoice
- Actions: regenerateCode(), compute(), setDocType(), patchInvoice()
- Auto compute on: add/update/remove item, discount, tax, retention, regenerate, docType change
- UI: "Regenerar" button (idempotent), removed manual "Recalcular", added View Totals (debug)

## QA Checklist
- [ ] Typecheck passes: `npm run typecheck`
- [ ] Dev boots locally (Vite) with no runtime errors
- [ ] DocType toggle (INVOICE ↔ QUOTE) updates code with prefixes INV-/QTE-
- [ ] Clicking **Regenerar** multiple times is idempotent (no flicker/duplicates)
- [ ] Items add/update/remove recompute totals automatically
- [ ] Global discount/tax/retention recompute totals automatically
- [ ] All imports point to `@/features/invoice/store/useInvoice`
- [ ] No duplicate `useInvoice.*` files under `src/**`

## Notes
- Keep named export: `export const useInvoice = ...`
- Alias @ configured in tsconfig + Vite