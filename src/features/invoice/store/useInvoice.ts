import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type { DocType, FooterState, FooterVisibility } from '@/types/invoice';
import type { Invoice, InvoiceItem, Profile, Brand, Client, Footer, Settings, Meta, RetentionPreset } from '../types/types';

type InvoiceStore = {
  // Current invoice data
  invoice: Invoice;
  profiles: Profile[];
  selectedProfileId?: string;
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    retention: number;
    total: number;
  };
  
  // Legacy footer state for backward compatibility
  docType: DocType;
  footerState: FooterState;
  
  // Invoice actions
  patchInvoice: (patch: Partial<Invoice>) => void;
  setDocType: (docType: DocType) => void;
  
  // Item management
  addItem: () => void;
  updateItem: (id: string, update: Partial<InvoiceItem>) => void;
  removeItem: (id: string) => void;
  
  // Brand/Client/Meta updates
  updateBrandField: (field: keyof Brand, value: string) => void;
  updateClientField: (field: keyof Client, value: string) => void;
  updateFooterField: (field: keyof Footer, value: any) => void;
  updateSettingsField: (field: keyof Settings, value: any) => void;
  updateMetaField: (field: keyof Meta, value: string) => void;
  setTerms: (terms: string) => void;
  
  // Global settings
  setGlobalDiscount: (discount: number) => void;
  setGlobalTax: (tax: number) => void;
  setRetentionPreset: (preset: RetentionPreset) => void;
  regenerateCode: () => void;
  
  // Footer actions (legacy support)
  setFooterEnabled: (key: keyof FooterState, enabled: boolean) => void;
  setFooterText: (key: 'notes' | 'terms', text: string) => void;
  setFooterVisibility: (key: keyof FooterState, visibility: FooterVisibility) => void;
  addPaymentCondition: (item: string) => void;
  updatePaymentCondition: (index: number, item: string) => void;
  removePaymentCondition: (index: number) => void;
};

const initialFooterState: FooterState = {
  notes: {
    enabled: true,
    text: 'Thank you for your business!',
    visibility: { showOnInvoice: true, showOnQuote: true },
  },
  terms: {
    enabled: false,
    text: 'Payment is due within 30 days of receipt.',
    visibility: { showOnInvoice: true, showOnQuote: true },
  },
  payment: {
    enabled: false,
    items: ['Bank Transfer', 'Credit Card (3% fee)'],
    visibility: { showOnInvoice: true, showOnQuote: false },
  },
};

const createInitialInvoice = (): Invoice => ({
  docType: 'INVOICE',
  code: `INV-${nanoid(8).toUpperCase()}`,
  issueDate: new Date().toISOString().slice(0, 10),
  brand: {
    name: '',
    ein: '',
    email: '',
    phone: '',
    address: '',
    tagline: ''
  },
  client: {
    name: '',
    email: '',
    address: ''
  },
  footer: {
    mode: 'social',
    showTerms: false
  },
  settings: {
    locale: 'en-US',
    currency: 'USD',
    decimals: 2
  },
  meta: {
    number: '',
    date: new Date().toISOString().slice(0, 10)
  },
  items: [],
  terms: '',
  globalDiscount: 0,
  globalTaxRate: 0,
  retentionPreset: 'NO_AGENTE',
  footerId: 'v1-minimal',
  socials: []
});

const calculateTotals = (invoice: Invoice) => {
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  
  const itemDiscounts = invoice.items.reduce((sum, item) => {
    const itemSubtotal = item.qty * item.unitPrice;
    const discount = item.discount ? (itemSubtotal * item.discount) / 100 : 0;
    return sum + discount;
  }, 0);
  
  const globalDiscount = invoice.globalDiscount ? (subtotal * invoice.globalDiscount) / 100 : 0;
  const totalDiscount = itemDiscounts + globalDiscount;
  
  const discountedSubtotal = subtotal - totalDiscount;
  
  const itemTaxes = invoice.items.reduce((sum, item) => {
    const itemSubtotal = item.qty * item.unitPrice;
    const itemDiscount = item.discount ? (itemSubtotal * item.discount) / 100 : 0;
    const taxableAmount = itemSubtotal - itemDiscount;
    const taxRate = item.taxRate ?? invoice.globalTaxRate ?? 0;
    return sum + (taxableAmount * taxRate) / 100;
  }, 0);
  
  const globalTax = invoice.globalTaxRate ? (discountedSubtotal * invoice.globalTaxRate) / 100 : 0;
  const totalTax = itemTaxes + globalTax;
  
  let retention = 0;
  if (invoice.retentionPreset === 'AGENTE_RETENCION') {
    retention = subtotal * 0.02; // 2%
  }
  
  const total = discountedSubtotal + totalTax - retention;
  
  return {
    subtotal,
    discount: totalDiscount,
    tax: totalTax,
    retention,
    total
  };
};

export const useInvoice = create<InvoiceStore>()(
  immer((set, get) => ({
    // --- INITIAL STATE ---
    invoice: createInitialInvoice(),
    profiles: [],
    selectedProfileId: undefined,
    get totals() { return calculateTotals(get().invoice); },
    docType: 'INVOICE' as DocType,
    footerState: initialFooterState,

    // --- INVOICE ACTIONS ---
    patchInvoice: (patch) => set((state) => {
      Object.assign(state.invoice, patch);
    }),

    setDocType: (docType) => set((state) => {
      state.invoice.docType = docType;
      state.docType = docType === 'INVOICE' ? 'invoice' : 'quote';
    }),

    // --- ITEM MANAGEMENT ---
    addItem: () => set((state) => {
      const newItem: InvoiceItem = {
        id: nanoid(),
        title: '',
        description: '',
        qty: 1,
        unitPrice: 0,
        taxRate: undefined,
        discount: undefined
      };
      state.invoice.items.push(newItem);
    }),

    updateItem: (id, update) => set((state) => {
      const item = state.invoice.items.find(item => item.id === id);
      if (item) {
        Object.assign(item, update);
      }
    }),

    removeItem: (id) => set((state) => {
      const index = state.invoice.items.findIndex(item => item.id === id);
      if (index >= 0) {
        state.invoice.items.splice(index, 1);
      }
    }),

    // --- FIELD UPDATES ---
    updateBrandField: (field, value) => set((state) => {
      state.invoice.brand[field] = value;
    }),

    updateClientField: (field, value) => set((state) => {
      state.invoice.client[field] = value;
    }),

    updateFooterField: (field, value) => set((state) => {
      (state.invoice.footer as any)[field] = value;
    }),

    updateSettingsField: (field, value) => set((state) => {
      state.invoice.settings[field] = value;
    }),

    updateMetaField: (field, value) => set((state) => {
      state.invoice.meta[field] = value;
    }),

    setTerms: (terms) => set((state) => {
      state.invoice.terms = terms;
    }),

    // --- GLOBAL SETTINGS ---
    setGlobalDiscount: (discount) => set((state) => {
      state.invoice.globalDiscount = discount;
    }),

    setGlobalTax: (tax) => set((state) => {
      state.invoice.globalTaxRate = tax;
    }),

    setRetentionPreset: (preset) => set((state) => {
      state.invoice.retentionPreset = preset;
    }),

    regenerateCode: () => set((state) => {
      state.invoice.code = `INV-${nanoid(8).toUpperCase()}`;
    }),

    // --- LEGACY FOOTER ACTIONS ---
    setFooterEnabled: (key, enabled) => set((state) => {
      state.footerState[key].enabled = enabled;
    }),

    setFooterText: (key, text) => set((state) => {
      if (key === 'notes' || key === 'terms') {
        state.footerState[key].text = text;
      }
    }),

    setFooterVisibility: (key, visibility) => set((state) => {
      state.footerState[key].visibility = visibility;
    }),

    addPaymentCondition: (item) => set((state) => {
      state.footerState.payment.items.push(item);
    }),

    updatePaymentCondition: (index, item) => set((state) => {
      if (index >= 0 && index < state.footerState.payment.items.length) {
        state.footerState.payment.items[index] = item;
      }
    }),

    removePaymentCondition: (index) => set((state) => {
      if (index >= 0 && index < state.footerState.payment.items.length) {
        state.footerState.payment.items.splice(index, 1);
      }
    }),
  }))
);