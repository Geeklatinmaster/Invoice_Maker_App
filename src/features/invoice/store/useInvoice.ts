import { create } from "zustand";
import { nanoid } from "nanoid";
import { saveLegacy, loadLegacy, sanitizePrice, preserveId } from "../lib/storage";
import type { Profile, Invoice, InvoiceItem, DocType, FooterId, RetentionPreset } from "../types/types";

// Robust code generation helpers
const rand = (n = 5) => Math.random().toString(36).slice(2, 2 + n).toUpperCase();
const makeCode = (docType: DocType) =>
  (docType === "INVOICE" ? "INV-" : "QTE-") +
  new Date().toISOString().slice(2,10).replace(/-/g, "") + "-" + rand();

type Totals = {
  subtotal: number;
  tax: number;
  discount: number;
  retention: number;
  total: number;
};

type InvoiceStore = {
  // State
  profiles: Profile[];
  selectedProfileId: string;
  invoice: Invoice;
  totals: Totals;
  
  // Profile actions
  selectProfile: (id: string) => void;
  addProfile: (profile: Partial<Profile>) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  exportProfiles: () => string;
  importProfiles: (json: string) => void;
  
  // Invoice actions
  setDocType: (docType: DocType) => void;
  regenerateCode: () => void;
  patchInvoice: (updates: Partial<Invoice>) => void;
  setFooterId: (footerId: FooterId) => void;
  setGlobalDiscount: (discount: number) => void;
  setGlobalTax: (tax: number) => void;
  setRetentionPreset: (preset: RetentionPreset) => void;
  
  // Document management
  createNewDocument: () => void;
  duplicateDocument: () => void;
  loadDocumentForEdit: (invoice: Invoice) => void;
  
  // Item actions
  addItem: () => void;
  updateItem: (id: string, updates: Partial<InvoiceItem>) => void;
  removeItem: (id: string) => void;
  
  // Computation
  compute: () => void;
};


const createDefaultProfile = (): Profile => ({
  id: nanoid(),
  name: "Default Profile",
  businessName: "My Business",
  currency: "USD",
  locale: "en-US",
  defaultFooterId: "v1-minimal",
});

const createDefaultInvoice = (): Invoice => ({
  docType: "INVOICE",
  code: makeCode("INVOICE"),
  issueDate: new Date().toISOString().split("T")[0],
  customerName: "",
  customerEmail: "",
  customerAddress: "",
  items: [],
  globalDiscount: 0,
  globalTaxRate: 0,
  retentionPreset: "NONE",
  footerId: "v1-minimal",
});

const createDefaultTotals = (): Totals => ({
  subtotal: 0,
  tax: 0,
  discount: 0,
  retention: 0,
  total: 0,
});

const initialState = {
  profiles: [createDefaultProfile()],
  selectedProfileId: "",
  invoice: createDefaultInvoice(),
  totals: createDefaultTotals(),
};

// Load persisted state
const persistedState = loadLegacy(initialState);
// Ensure selectedProfileId is set
if (!persistedState.selectedProfileId && persistedState.profiles.length > 0) {
  persistedState.selectedProfileId = persistedState.profiles[0].id;
}

export const useInvoice = create<InvoiceStore>((set, get) => ({
  ...persistedState,
  
  // Profile actions
  selectProfile: (id: string) => {
    set({ selectedProfileId: id });
    saveLegacy(get());
  },
  
  addProfile: (profile: Partial<Profile>) => {
    const newProfile: Profile = {
      id: nanoid(),
      name: profile.name || "New Profile",
      businessName: profile.businessName || "",
      currency: profile.currency || "USD",
      locale: profile.locale || "en-US",
      defaultFooterId: profile.defaultFooterId || "v1-minimal",
      ...profile,
    };
    
    set(state => ({
      profiles: [...state.profiles, newProfile],
      selectedProfileId: newProfile.id,
    }));
    saveLegacy(get());
  },
  
  updateProfile: (id: string, updates: Partial<Profile>) => {
    set(state => ({
      profiles: state.profiles.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
    saveLegacy(get());
  },
  
  deleteProfile: (id: string) => {
    const state = get();
    const remainingProfiles = state.profiles.filter(p => p.id !== id);
    
    if (remainingProfiles.length === 0) {
      // Create a new default profile if all profiles are deleted
      const defaultProfile = createDefaultProfile();
      set({
        profiles: [defaultProfile],
        selectedProfileId: defaultProfile.id,
      });
    } else {
      const newSelectedId = state.selectedProfileId === id 
        ? remainingProfiles[0].id 
        : state.selectedProfileId;
      set({
        profiles: remainingProfiles,
        selectedProfileId: newSelectedId,
      });
    }
    saveLegacy(get());
  },
  
  exportProfiles: () => {
    return JSON.stringify(get().profiles, null, 2);
  },
  
  importProfiles: (json: string) => {
    try {
      const profiles: Profile[] = JSON.parse(json);
      if (Array.isArray(profiles) && profiles.length > 0) {
        set({
          profiles,
          selectedProfileId: profiles[0].id,
        });
        saveLegacy(get());
      }
    } catch (error) {
      console.error("Failed to import profiles:", error);
    }
  },
  
  // Invoice actions
  setDocType: (docType: DocType) => {
    set(state => ({
      invoice: {
        ...state.invoice,
        docType,
        code: makeCode(docType),
      },
    }));
    // Auto-recompute totals after docType change
    get().compute();
    saveLegacy(get());
  },
  
  regenerateCode: () => {
    const state = get();
    const newCode = makeCode(state.invoice.docType);
    set({
      invoice: {
        ...state.invoice,
        code: newCode,
      },
    });
    // Auto-recompute totals after regeneration
    get().compute();
    saveLegacy(get());
  },
  
  patchInvoice: (updates: Partial<Invoice>) => {
    set(state => ({
      invoice: { ...state.invoice, ...updates },
    }));
    saveLegacy(get());
  },
  
  setFooterId: (footerId: FooterId) => {
    set(state => ({
      invoice: { ...state.invoice, footerId },
    }));
    saveLegacy(get());
  },
  
  setGlobalDiscount: (discount: number) => {
    const sanitizedDiscount = Math.min(100, sanitizePrice(discount));
    set(state => ({
      invoice: { ...state.invoice, globalDiscount: sanitizedDiscount },
    }));
    // Auto-recompute totals after discount change
    get().compute();
    saveLegacy(get());
  },
  
  setGlobalTax: (tax: number) => {
    const sanitizedTax = sanitizePrice(tax);
    set(state => ({
      invoice: { ...state.invoice, globalTaxRate: sanitizedTax },
    }));
    // Auto-recompute totals after tax change
    get().compute();
    saveLegacy(get());
  },
  
  setRetentionPreset: (preset: RetentionPreset) => {
    set(state => ({
      invoice: { ...state.invoice, retentionPreset: preset },
    }));
    // Auto-recompute totals after retention change
    get().compute();
    saveLegacy(get());
  },
  
  // Item actions
  addItem: () => {
    const newItem: InvoiceItem = {
      id: nanoid(),
      title: "",
      description: "",
      qty: 1,
      unitPrice: 0,
      taxRate: undefined,
      discount: undefined,
    };
    
    set(state => ({
      invoice: {
        ...state.invoice,
        items: [...state.invoice.items, newItem],
      },
    }));
    // Auto-recompute totals after adding item
    get().compute();
    saveLegacy(get());
  },
  
  updateItem: (id: string, updates: Partial<InvoiceItem>) => {
    // Sanitize price fields
    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.unitPrice !== undefined) {
      sanitizedUpdates.unitPrice = sanitizePrice(sanitizedUpdates.unitPrice);
    }
    if (sanitizedUpdates.qty !== undefined) {
      sanitizedUpdates.qty = Math.max(1, Math.floor(sanitizePrice(sanitizedUpdates.qty)));
    }
    if (sanitizedUpdates.taxRate !== undefined && sanitizedUpdates.taxRate !== null) {
      sanitizedUpdates.taxRate = sanitizePrice(sanitizedUpdates.taxRate);
    }
    if (sanitizedUpdates.discount !== undefined && sanitizedUpdates.discount !== null) {
      sanitizedUpdates.discount = Math.min(100, sanitizePrice(sanitizedUpdates.discount));
    }

    set(state => ({
      invoice: {
        ...state.invoice,
        items: state.invoice.items.map(item =>
          item.id === id ? { ...item, ...sanitizedUpdates } : item
        ),
      },
    }));
    // Auto-recompute totals after updating item
    get().compute();
    saveLegacy(get());
  },
  
  removeItem: (id: string) => {
    set(state => ({
      invoice: {
        ...state.invoice,
        items: state.invoice.items.filter(item => item.id !== id),
      },
    }));
    // Auto-recompute totals after removing item
    get().compute();
    saveLegacy(get());
  },
  
  // Computation
  compute: () => {
    const state = get();
    const { invoice, profiles, selectedProfileId } = state;
    const profile = profiles.find(p => p.id === selectedProfileId) || profiles[0];
    
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    
    // Calculate item-by-item
    invoice.items.forEach(item => {
      const lineTotal = item.qty * item.unitPrice;
      const itemDiscount = (item.discount || 0) / 100 * lineTotal;
      const discountedAmount = lineTotal - itemDiscount;
      const itemTaxRate = item.taxRate !== undefined ? item.taxRate : (invoice.globalTaxRate || profile.defaultTaxRate || 0);
      const itemTax = itemTaxRate / 100 * discountedAmount;
      
      subtotal += lineTotal;
      totalDiscount += itemDiscount;
      totalTax += itemTax;
    });
    
    // Apply global discount
    const globalDiscountAmount = (invoice.globalDiscount || 0) / 100 * subtotal;
    totalDiscount += globalDiscountAmount;
    
    // Calculate retention
    let retention = 0;
    const taxableAmount = subtotal - totalDiscount;
    
    if (invoice.retentionPreset === "AGENTE_RETENCION") {
      retention = 0.02 * taxableAmount; // 2%
    }
    
    const total = subtotal - totalDiscount + totalTax - retention;
    
    const totals: Totals = {
      subtotal,
      tax: totalTax,
      discount: totalDiscount,
      retention,
      total: Math.max(0, total), // Ensure non-negative
    };
    
    set({ totals });
    saveLegacy(get());
  },
  
  // Document management methods
  createNewDocument: () => {
    const newInvoice = createDefaultInvoice();
    set({
      invoice: newInvoice,
      totals: createDefaultTotals(),
    });
    get().compute();
    saveLegacy(get());
  },
  
  duplicateDocument: () => {
    const state = get();
    const currentInvoice = state.invoice;
    
    // Create duplicate with new code and IDs
    const duplicateInvoice: Invoice = {
      ...currentInvoice,
      code: makeCode(currentInvoice.docType),
      items: currentInvoice.items.map(item => ({
        ...item,
        id: nanoid(), // Generate new IDs for duplicated items
      })),
      issueDate: new Date().toISOString().split("T")[0], // Update to current date
    };
    
    set({
      invoice: duplicateInvoice,
      totals: createDefaultTotals(),
    });
    get().compute();
    saveLegacy(get());
  },
  
  loadDocumentForEdit: (invoice: Invoice) => {
    // Preserve existing IDs when loading for edit
    const sanitizedInvoice: Invoice = {
      ...invoice,
      items: invoice.items.map(item => ({
        ...item,
        id: preserveId(item.id), // Preserve existing IDs
        unitPrice: sanitizePrice(item.unitPrice),
        qty: Math.max(1, Math.floor(sanitizePrice(item.qty))),
        taxRate: item.taxRate !== undefined ? sanitizePrice(item.taxRate) : undefined,
        discount: item.discount !== undefined ? Math.min(100, sanitizePrice(item.discount)) : undefined,
      })),
      globalDiscount: invoice.globalDiscount !== undefined ? Math.min(100, sanitizePrice(invoice.globalDiscount)) : undefined,
      globalTaxRate: invoice.globalTaxRate !== undefined ? sanitizePrice(invoice.globalTaxRate) : undefined,
    };
    
    set({
      invoice: sanitizedInvoice,
      totals: createDefaultTotals(),
    });
    get().compute();
    saveLegacy(get());
  },
}));