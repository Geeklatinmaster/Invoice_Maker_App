// src/store/invoiceStore.ts
import { create } from 'zustand';
import { AppState, InvoiceDoc, LineItem } from '@/types/invoice';
import { computeTotals } from '@/lib/totals';
import { nextDocCode } from '@/lib/codegen';

export const useAppStore = create<AppState>()((set, get) => ({
  invoices: {},
  clients: {},
  brandProfiles: {},
  selectedInvoiceId: undefined,
  prefs: { lang: 'es', theme: 'dark' },

  setSelectedInvoiceId: (id) => set({ selectedInvoiceId: id }),
  
  upsertInvoice: (doc) => set((state) => {
    const prev = state.invoices[doc.id] as InvoiceDoc | undefined;
    const merged = { ...prev, ...doc } as InvoiceDoc;
    // recalcular totales siempre que cambie el documento
    merged.totals = computeTotals(merged);
    return {
      invoices: { ...state.invoices, [merged.id]: merged }
    };
  }),
  
  updateCurrentInvoice: (patch) => set((state) => {
    const id = state.selectedInvoiceId;
    if (!id || !state.invoices[id]) return state;
    
    const curr = state.invoices[id];
    const merged = { ...curr, ...patch } as InvoiceDoc;
    merged.totals = computeTotals(merged);
    
    return {
      invoices: { ...state.invoices, [id]: merged }
    };
  }),
  
  addLineItem: (item: LineItem) => set((state) => {
    const id = state.selectedInvoiceId;
    if (!id || !state.invoices[id]) return state;
    
    const curr = state.invoices[id];
    const updated = { ...curr, items: [...curr.items, item] };
    updated.totals = computeTotals(updated);
    
    return {
      invoices: { ...state.invoices, [id]: updated }
    };
  }),
  
  removeLineItem: (lineId: string) => set((state) => {
    const id = state.selectedInvoiceId;
    if (!id || !state.invoices[id]) return state;
    
    const curr = state.invoices[id];
    const updated = { ...curr, items: curr.items.filter((i) => i.id !== lineId) };
    updated.totals = computeTotals(updated);
    
    return {
      invoices: { ...state.invoices, [id]: updated }
    };
  }),
  
  setPrefs: (p) => set((state) => ({ prefs: { ...state.prefs, ...p } })),
}));

// ---------- Selectores puros (fuera de componentes) ----------
export const selectPrefs = (s: AppState) => s.prefs;
export const selectSelectedInvoice = (s: AppState) =>
  s.selectedInvoiceId ? s.invoices[s.selectedInvoiceId] : undefined;

export const selectTotals = (s: AppState) => {
  const inv = selectSelectedInvoice(s);
  return inv?.totals;
};

// Generación de código: ejemplo de helper invocable desde acciones de UI
export function ensureDocCode(doc: InvoiceDoc, lastSeq: number) {
  if (!doc.code || !doc.code.trim()) {
    doc.code = nextDocCode(doc.docType, lastSeq);
  }
  return doc.code;
}