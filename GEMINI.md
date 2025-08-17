# Project: Invoice_Maker_App

## Objetivo
Aplicación para crear **Presupuestos** y **Invoices** profesionales con:
- **Mercados**: USA, Europa (UE), Venezuela.
- **Moneda**: multi‑moneda con formateo por `Intl.NumberFormat`.
- **Impuestos**: VAT/IVA configurables (global y por ítem), retenciones y cargos locales.
- **Exportación PDF** confiable (márgenes, footer fijo, páginas múltiples).
- **Perfiles de marca** (importar/exportar JSON).
- **Plantillas** de layout (3–5 footers + variaciones de encabezado).

## Arquitectura (resumen)
- Frontend: React + TypeScript.
- Estado: Zustand (`src/store/useInvoice.ts`).
- Utilidades: `src/lib/format.ts` (moneda, números, fechas).
- UI clave: `src/components/Preview.tsx`, `src/components/Footers.tsx`.
- Export PDF: html2pdf (o equivalente) controlado por CSS de impresión.

## Guardrails para el Agente
- **No** añadir dependencias sin autorización.
- **Cálculos monetarios en enteros (cents)** o decimal library; **nunca floats** en lógica.
- Formateo **solo en la capa de vista**.
- Si toca `format.ts` o `useInvoice.ts`: **añadir tests** Vitest con casos borde.
- Git Flow: ramas `feature/* | fix/* | chore/*` → PR → `main`. **Prohibido** commit directo a `main`.

## Modelos y tipos (dirección)
- Money: `{ amountCents: number, currency: 'USD'|'EUR'|'VES'|string }`
- TaxRule:
  ```ts
  type TaxScope = 'item' | 'global';
  type TaxType = 'VAT'|'IVA'|'SALES_TAX'|'WITHHOLDING'|'OTHER';
  interface TaxRule { id: string; name: string; rateBps: number; scope: TaxScope; type: TaxType; appliesTo?: string[]; }
