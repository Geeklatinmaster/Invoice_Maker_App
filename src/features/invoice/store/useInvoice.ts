import { create } from "zustand";
import { nanoid } from "nanoid";
import { load, save } from "../lib/storage";
import type { FooterId, Invoice, InvoiceItem, Profile } from "../types/types";

type Totals = { subTotal: number; discount: number; tax: number; retention: number; total: number };

type State = {
  profiles: Profile[];
  selectedProfileId?: string;
  invoice: Invoice;
  totals: Totals;
  compute: () => void;
  patchInvoice: (patch: Partial<Invoice>) => void;
  updateItem: (id: string, patch: Partial<InvoiceItem>) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
  setFooterId: (f: FooterId) => void;
};

const codeFor = (prefix = "INV") => {
  const d = new Date();
  const yyyymm = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}`;
  const rand = Math.floor(Math.random()*10000).toString().padStart(4,"0");
  return `${prefix}-${yyyymm}-${rand}`;
};

const initial: State = load<State>({
  profiles: [{
    id: "demo",
    name: "Demo",
    businessName: "Geeklatinmaster LLC",
    currency: "USD",
    locale: "en-US",
    defaultTaxRate: 0,
    defaultFooterId: "v3-us",
  }],
  selectedProfileId: "demo",
  invoice: {
    docType: "INVOICE",
    code: codeFor("INV"),
    issueDate: new Date().toISOString().slice(0,10),
    customerName: "",
    items: [{ id: nanoid(), title: "Service", qty: 1, unitPrice: 100 }],
    globalDiscount: 0,
    globalTaxRate: 0,
    retentionPreset: "NO_AGENTE",
    footerId: "v3-us",
  },
  totals: { subTotal: 0, discount: 0, tax: 0, retention: 0, total: 0 },
  compute: () => {},
  patchInvoice: () => {},
  updateItem: () => {},
  addItem: () => {},
  removeItem: () => {},
  setFooterId: () => {},
});

export const useInvoice = create<State>()((set, get) => ({
  ...initial,
  patchInvoice: (patch) => set(s => ({ invoice: { ...s.invoice, ...patch } })),
  setFooterId: (f) => set(s => ({ invoice: { ...s.invoice, footerId: f } })),
  addItem: () => set(s => ({ invoice: { ...s.invoice, items: [...s.invoice.items, { id: nanoid(), title: "", qty:1, unitPrice:0 }] } })),
  updateItem: (id, patch) => set(s => ({ invoice: { ...s.invoice, items: s.invoice.items.map(it => it.id===id ? { ...it, ...patch } : it) } })),
  removeItem: (id) => set(s => ({ invoice: { ...s.invoice, items: s.invoice.items.filter(it => it.id!==id) } })),
  compute: () => {
    const s = get();
    const profile = s.profiles.find(p => p.id === s.selectedProfileId) ?? s.profiles[0];
    const iv = s.invoice;

    const sub = iv.items.reduce((a, it) => a + it.qty * it.unitPrice, 0);
    const discLine = iv.items.reduce((a,it)=> a + (it.discount? (it.discount/100)*it.qty*it.unitPrice : 0), 0);
    const discGlobal = (iv.globalDiscount ?? 0)/100 * (sub - discLine);
    const baseAfterDisc = sub - discLine - discGlobal;

    const taxRate = (iv.globalTaxRate ?? profile?.defaultTaxRate ?? 0) / 100;
    const tax = baseAfterDisc * taxRate;

    const retention = iv.retentionPreset === "AGENTE_RETENCION" ? baseAfterDisc * 0.02 : 0;
    const total = baseAfterDisc + tax - retention;

    const totals = { subTotal: sub, discount: discLine + discGlobal, tax, retention, total };
    set({ totals });
    save({ ...get(), totals });
  },
}));
