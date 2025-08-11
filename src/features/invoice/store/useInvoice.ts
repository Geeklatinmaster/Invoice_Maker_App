import { create } from "zustand";
import { nanoid } from "nanoid";
import { load, save } from "../lib/storage";
import type { Profile, Invoice, InvoiceItem, FooterId, DocType, RetentionPreset } from "../types/types";

type Totals = { subTotal: number; discount: number; tax: number; retention: number; total: number };

type State = {
  profiles: Profile[];
  selectedProfileId?: string;
  invoice: Invoice;
  totals: Totals;
};

type Actions = {
  patchInvoice: (patch: Partial<Invoice>) => void;
  setDocType: (t: DocType) => void;
  regenerateCode: () => void;
  setFooterId: (f: FooterId) => void;
  setGlobalTax: (p: number) => void;
  setGlobalDiscount: (p: number) => void;
  setRetentionPreset: (r: RetentionPreset) => void;

  addItem: () => void;
  updateItem: (id: string, patch: Partial<InvoiceItem>) => void;
  removeItem: (id: string) => void;

  addProfile: (p: Omit<Profile,"id">) => void;
  updateProfile: (id: string, patch: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  selectProfile: (id: string) => void;
  exportProfiles: () => string;
  importProfiles: (json: string) => void;
  compute: () => void;
};

const codeFor = (t: DocType) => {
  const d = new Date();
  const yyyymm = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}`;
  const rand = Math.floor(Math.random()*10000).toString().padStart(4,"0");
  return (t === "INVOICE" ? "INV" : "QTE") + "-" + yyyymm + "-" + rand;
};

const initial: State = load<State>({
  profiles: [{
    id: "demo",
    name: "Geeklatinmaster (demo)",
    businessName: "Geeklatinmaster LLC",
    email: "info@geeklatinmaster.com",
    phone: "+1 (555) 555-5555",
    website: "https://geeklatinmaster.com",
    taxId: "12-3456789",
    currency: "USD",
    locale: "en-US",
    defaultTaxRate: 0,
    defaultFooterId: "v3-us",
  }],
  selectedProfileId: "demo",
  invoice: {
    docType: "INVOICE",
    code: codeFor("INVOICE"),
    issueDate: new Date().toISOString().slice(0,10),
    customerName: "",
    items: [{ id: nanoid(), title: "Service", qty: 1, unitPrice: 100 }],
    globalDiscount: 0,
    globalTaxRate: 0,
    retentionPreset: "NO_AGENTE",
    footerId: "v3-us",
  },
  totals: { subTotal: 0, discount: 0, tax: 0, retention: 0, total: 0 },
});

export const useInvoice = create<State & Actions>()((set, get) => ({
  ...initial,

  patchInvoice: (patch) => set(s => ({ invoice: { ...s.invoice, ...patch } })),

  setDocType: (t) => set(s => ({ invoice: { ...s.invoice, docType: t }})),
  regenerateCode: () => set(s => ({ invoice: { ...s.invoice, code: codeFor(s.invoice.docType) } })),
  setFooterId: (f) => set(s => ({ invoice: { ...s.invoice, footerId: f } })),
  setGlobalTax: (p) => set(s => ({ invoice: { ...s.invoice, globalTaxRate: p }})),
  setGlobalDiscount: (p) => set(s => ({ invoice: { ...s.invoice, globalDiscount: p }})),
  setRetentionPreset: (r) => set(s => ({ invoice: { ...s.invoice, retentionPreset: r }})),

  addItem: () => set(s => ({ invoice: { ...s.invoice, items: [...s.invoice.items, { id: nanoid(), title: "", qty:1, unitPrice:0 }] } })),
  updateItem: (id, patch) => set(s => ({ invoice: { ...s.invoice, items: s.invoice.items.map(it => it.id===id ? { ...it, ...patch } : it) } })),
  removeItem: (id) => set(s => ({ invoice: { ...s.invoice, items: s.invoice.items.filter(it => it.id!==id) } })),

  addProfile: (p) => set(s => ({ profiles: [...s.profiles, { ...p, id: nanoid() }] })),
  updateProfile: (id, patch) => set(s => ({ profiles: s.profiles.map(pr => pr.id===id ? { ...pr, ...patch } : pr) })),
  deleteProfile: (id) => set(s => {
    const left = s.profiles.filter(p => p.id !== id);
    const sel = s.selectedProfileId === id ? left[0]?.id : s.selectedProfileId;
    return { profiles: left, selectedProfileId: sel };
  }),
  selectProfile: (id) => set({ selectedProfileId: id }),
  exportProfiles: () => JSON.stringify(get().profiles, null, 2),
  importProfiles: (json: string) => {
    try {
      const arr = JSON.parse(json) as Profile[];
      set({ profiles: arr, selectedProfileId: arr[0]?.id });
    } catch { /* ignore */ }
  },

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
