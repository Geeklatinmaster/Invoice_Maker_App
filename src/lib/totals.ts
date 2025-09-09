// src/lib/totals.ts
import { InvoiceDoc, LineItem } from '@/types/invoice';

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function computeLineItem(item: LineItem) {
  const base = round2(item.qty * item.unitPrice);
  const itemDiscount = round2(item.discount ?? 0);
  const afterDiscount = Math.max(0, base - itemDiscount);
  const tax = round2(afterDiscount * ((item.taxRate ?? 0) / 100));
  const retention = round2(afterDiscount * ((item.retentionRate ?? 0) / 100));
  const total = round2(afterDiscount + tax - retention);
  return { base, itemDiscount, afterDiscount, tax, retention, total };
}

// Orden: (subtotal - descuentos) → impuestos → retenciones
export function computeTotals(doc: InvoiceDoc) {
  const lines = doc.items.map(computeLineItem);
  const subtotal = round2(lines.reduce((a, l) => a + l.base, 0));
  const itemDiscounts = round2(lines.reduce((a, l) => a + l.itemDiscount, 0));
  const globalDiscount = round2(doc.globalDiscount ?? 0);
  const discounted = Math.max(0, round2(subtotal - itemDiscounts - globalDiscount));
  const tax = round2(lines.reduce((a, l) => a + l.tax, 0));
  const retention = round2(lines.reduce((a, l) => a + l.retention, 0));
  const grandTotal = round2(discounted + tax - retention);

  return {
    subtotal,
    discount: round2(itemDiscounts + globalDiscount),
    tax,
    retention,
    grandTotal
  };
}