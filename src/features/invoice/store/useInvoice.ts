import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Profile, Invoice, InvoiceItem, DocType, FooterId, RetentionPreset, FooterSettings, ThemeSettings, LogoSettings, LogoSize, LogoAlign } from "../types/types";

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

type TableSettings = {
  stripes: boolean;
  totalsAlign: 'left' | 'center' | 'right';
};

export type CustomizerSettings = {
  logoSize: number;
  logoPosition: 'left' | 'center' | 'right';
  margins: { top: number; right: number; bottom: number; left: number };
  colors: { primary: string; text: string; background: string };
  fontSize: { title: number; body: number; small: number };
  fontFamily: string;
  table: TableSettings;
};

export const defaultCustomizer: CustomizerSettings = {
  logoSize: 100,
  logoPosition: 'left',
  margins: { top: 20, right: 20, bottom: 20, left: 20 },
  colors: { primary: '#1e40af', text: '#1f2937', background: '#ffffff' },
  fontSize: { title: 24, body: 14, small: 12 },
  fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  table: { stripes: false, totalsAlign: 'right' },
};

const mergeCustomizer = (c?: Partial<CustomizerSettings>): CustomizerSettings => ({
  ...defaultCustomizer,
  ...(c ?? {}),
  margins: { ...defaultCustomizer.margins, ...(c?.margins ?? {}) },
  colors: { ...defaultCustomizer.colors, ...(c?.colors ?? {}) },
  fontSize: { ...defaultCustomizer.fontSize, ...(c?.fontSize ?? {}) },
});

type InvoiceStore = {
  // State
  profiles: Profile[];
  selectedProfileId: string;
  invoice: Invoice;
  totals: Totals;
  renderVersion: number;
  customizer: CustomizerSettings;
  
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
  
  // Item actions
  addItem: () => void;
  updateItem: (id: string, updates: Partial<InvoiceItem>) => void;
  removeItem: (id: string) => void;
  
  // Theme/Footer/Logo actions
  setFooter: (footerSettings: FooterSettings) => void;
  setTheme: (themeSettings: ThemeSettings) => void;
  setLogo: (logoSettings: LogoSettings) => void;
  
  // Granular live update actions
  updateLogoSize: (size: LogoSize) => void;
  updateLogoAlign: (align: LogoAlign) => void;
  updateLogoUrl: (url: string) => void;
  updateBrandPrimary: (color: string) => void;
  updateBrandSecondary: (color: string) => void;
  updateBackground: (color: string) => void;
  updateBaseFontSize: (size: number) => void;
  
  // Customizer granular setters
  updateCustomizerLogoSize: (size: number) => void;
  updateLogoPosition: (pos: CustomizerSettings['logoPosition']) => void;
  updateMargins: (margins: Partial<CustomizerSettings['margins']>) => void;
  updateColors: (colors: Partial<CustomizerSettings['colors']>) => void;
  updateFontSize: (sizes: Partial<CustomizerSettings['fontSize']>) => void;
  updateFontFamily: (fontFamily: string) => void;
  updateTable: (patch: Partial<TableSettings>) => void;
  applyLegacyThemeToCustomizer: (legacy: {
    primary?: string; text?: string; background?: string;
    fontFamily?: string; bodySize?: number; titleSize?: number;
  }) => void;
  
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

const defaultProfile = createDefaultProfile();

const initialState = {
  profiles: [defaultProfile],
  selectedProfileId: defaultProfile.id,
  invoice: createDefaultInvoice(),
  totals: createDefaultTotals(),
  renderVersion: 0,
  customizer: defaultCustomizer,
};

export const useInvoice = create<InvoiceStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,
  
  // Profile actions
  selectProfile: (id: string) => {
    set({ selectedProfileId: id });
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
  },
  
  updateProfile: (id: string, updates: Partial<Profile>) => {
    set(state => ({
      profiles: state.profiles.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
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
  },
  
  patchInvoice: (updates: Partial<Invoice>) => {
    set(state => ({
      invoice: { ...state.invoice, ...updates },
    }));
  },
  
  setFooterId: (footerId: FooterId) => {
    set(state => ({
      invoice: { ...state.invoice, footerId },
    }));
  },
  
  setGlobalDiscount: (discount: number) => {
    set(state => ({
      invoice: { ...state.invoice, globalDiscount: discount },
    }));
    // Auto-recompute totals after discount change
    get().compute();
  },
  
  setGlobalTax: (tax: number) => {
    set(state => ({
      invoice: { ...state.invoice, globalTaxRate: tax },
    }));
    // Auto-recompute totals after tax change
    get().compute();
  },
  
  setRetentionPreset: (preset: RetentionPreset) => {
    set(state => ({
      invoice: { ...state.invoice, retentionPreset: preset },
    }));
    // Auto-recompute totals after retention change
    get().compute();
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
  },
  
  updateItem: (id: string, updates: Partial<InvoiceItem>) => {
    set(state => ({
      invoice: {
        ...state.invoice,
        items: state.invoice.items.map(item =>
          item.id === id ? { ...item, ...updates } : item
        ),
      },
    }));
    // Auto-recompute totals after updating item
    get().compute();
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
  },
  
  // Theme/Footer/Logo actions
  setFooter: (footerSettings: FooterSettings) => {
    set(state => {
      const profileIdx = state.profiles.findIndex(p => p.id === state.selectedProfileId);
      if (profileIdx >= 0) {
        state.profiles[profileIdx].footer = { ...(state.profiles[profileIdx].footer || {}), ...footerSettings };
      }
      state.renderVersion++;
      return state;
    });
  },
  
  setTheme: (themeSettings: ThemeSettings) => {
    set(state => {
      const profileIdx = state.profiles.findIndex(p => p.id === state.selectedProfileId);
      if (profileIdx >= 0) {
        state.profiles[profileIdx].theme = { ...(state.profiles[profileIdx].theme || {}), ...themeSettings };
      }
      state.renderVersion++;
      return state;
    });
  },
  
  setLogo: (logoSettings: LogoSettings) => {
    set(state => {
      const profileIdx = state.profiles.findIndex(p => p.id === state.selectedProfileId);
      if (profileIdx >= 0) {
        state.profiles[profileIdx].logo = { ...(state.profiles[profileIdx].logo || {}), ...logoSettings };
      }
      state.renderVersion++;
      return state;
    });
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
  },
  
  // Granular live update actions
  updateLogoSize: (size: LogoSize) => {
    set(state => {
      const profileIdx = state.profiles.findIndex(p => p.id === state.selectedProfileId);
      if (profileIdx >= 0) {
        const currentTheme = state.profiles[profileIdx].theme || {};
        state.profiles[profileIdx].theme = { ...currentTheme, logoSize: size };
      }
      state.renderVersion++;
      return state;
    });
  },
  
  updateLogoAlign: (align: LogoAlign) => {
    set(state => {
      const profileIdx = state.profiles.findIndex(p => p.id === state.selectedProfileId);
      if (profileIdx >= 0) {
        const currentTheme = state.profiles[profileIdx].theme || {};
        state.profiles[profileIdx].theme = { ...currentTheme, logoAlign: align };
      }
      state.renderVersion++;
      return state;
    });
  },
  
  updateLogoUrl: (url: string) => {
    set(state => {
      const profileIdx = state.profiles.findIndex(p => p.id === state.selectedProfileId);
      if (profileIdx >= 0) {
        const currentLogo = state.profiles[profileIdx].logo || {};
        state.profiles[profileIdx].logo = { ...currentLogo, logoUrl: url, logoDataUrl: undefined };
      }
      state.renderVersion++;
      return state;
    });
  },
  
  updateBrandPrimary: (color: string) => {
    set(state => {
      const profileIdx = state.profiles.findIndex(p => p.id === state.selectedProfileId);
      if (profileIdx >= 0) {
        const currentTheme = state.profiles[profileIdx].theme || {};
        state.profiles[profileIdx].theme = { ...currentTheme, brandPrimary: color };
      }
      state.renderVersion++;
      return state;
    });
  },
  
  updateBrandSecondary: (color: string) => {
    set(state => {
      const profileIdx = state.profiles.findIndex(p => p.id === state.selectedProfileId);
      if (profileIdx >= 0) {
        const currentTheme = state.profiles[profileIdx].theme || {};
        state.profiles[profileIdx].theme = { ...currentTheme, brandSecondary: color };
      }
      state.renderVersion++;
      return state;
    });
  },
  
  updateBackground: (color: string) => {
    set(state => {
      const profileIdx = state.profiles.findIndex(p => p.id === state.selectedProfileId);
      if (profileIdx >= 0) {
        const currentTheme = state.profiles[profileIdx].theme || {};
        state.profiles[profileIdx].theme = { ...currentTheme, background: color };
      }
      state.renderVersion++;
      return state;
    });
  },
  
  updateBaseFontSize: (size: number) => {
    set(state => {
      const profileIdx = state.profiles.findIndex(p => p.id === state.selectedProfileId);
      if (profileIdx >= 0) {
        const currentTheme = state.profiles[profileIdx].theme || {};
        state.profiles[profileIdx].theme = { ...currentTheme, baseFontPx: size };
      }
      state.renderVersion++;
      return state;
    });
  },
  
  // --- Setters granulares para customizer ---
  updateCustomizerLogoSize: (size) =>
    set((s) => ({ customizer: { ...s.customizer, logoSize: size } })),

  updateLogoPosition: (pos) =>
    set((s) => ({ customizer: { ...s.customizer, logoPosition: pos } })),

  updateMargins: (margins) =>
    set((s) => ({
      customizer: {
        ...s.customizer,
        margins: { ...s.customizer.margins, ...margins },
      },
    })),

  updateColors: (colors) =>
    set((s) => ({
      customizer: {
        ...s.customizer,
        colors: { ...s.customizer.colors, ...colors },
      },
    })),

  updateFontSize: (sizes) =>
    set((s) => ({
      customizer: {
        ...s.customizer,
        fontSize: { ...s.customizer.fontSize, ...sizes },
      },
    })),

  updateFontFamily: (fontFamily) =>
    set((s) => ({
      customizer: {
        ...s.customizer,
        fontFamily,
      },
    })),

  updateTable: (patch) =>
    set((s) => ({
      customizer: {
        ...s.customizer,
        table: { ...s.customizer.table, ...patch },
      },
    })),

  // Bridge Legacy → Customizer (para que "Legacy theme colors & fonts" impacte Preview al instante)
  applyLegacyThemeToCustomizer: (legacy) =>
    set((s) => ({
      customizer: {
        ...s.customizer,
        colors: {
          ...s.customizer.colors,
          ...(legacy.primary ? { primary: legacy.primary } : {}),
          ...(legacy.text ? { text: legacy.text } : {}),
          ...(legacy.background ? { background: legacy.background } : {}),
        },
        fontFamily: legacy.fontFamily ?? s.customizer.fontFamily,
        fontSize: {
          ...s.customizer.fontSize,
          ...(legacy.bodySize  ? { body:  legacy.bodySize }  : {}),
          ...(legacy.titleSize ? { title: legacy.titleSize } : {}),
        },
      },
    })),
      }),
      {
        name: 'invoice-store',
        version: 3,
        migrate: (persisted: any, from) => {
          const s = (persisted ?? {}) as any;
          const prevCustomizer = s.customizer ?? {};

          // Intentar mapear del pasado:
          const altRows = s?.profiles?.find?.((p: any) => p.id === s.selectedProfileId)?.theme?.altRowStripesOn;
          const totalsAlign = s?.invoice?.totalsAlign;

          return {
            ...s,
            customizer: {
              ...defaultCustomizer,
              ...prevCustomizer,
              fontFamily: prevCustomizer.fontFamily ?? defaultCustomizer.fontFamily,
              table: {
                ...defaultCustomizer.table,
                ...(prevCustomizer.table ?? {}),
                stripes: typeof altRows === 'boolean' ? altRows : (prevCustomizer.table?.stripes ?? defaultCustomizer.table.stripes),
                totalsAlign: totalsAlign ?? (prevCustomizer.table?.totalsAlign ?? defaultCustomizer.table.totalsAlign),
              },
              margins: { ...defaultCustomizer.margins, ...(prevCustomizer.margins ?? {}) },
              colors: { ...defaultCustomizer.colors, ...(prevCustomizer.colors ?? {}) },
              fontSize: { ...defaultCustomizer.fontSize, ...(prevCustomizer.fontSize ?? {}) },
            },
          };
        },

        // ❌ NO mutar state dentro de onRehydrateStorage (eliminado para evitar loops)
      }
    )
  )
);

// Memoized selectors for granular subscriptions  
export const useLogoSettings = () => useInvoice((state) => {
  const profile = state.profiles.find(p => p.id === state.selectedProfileId);
  return {
    logo: profile?.logo || {},
    logoSize: profile?.theme?.logoSize || 'md' as const,
    logoAlign: profile?.theme?.logoAlign || 'left' as const,
  };
});

export const useColorSettings = () => useInvoice((state) => {
  const profile = state.profiles.find(p => p.id === state.selectedProfileId);
  const theme = profile?.theme || {};
  return {
    brandPrimary: theme.brandPrimary || '#3b82f6',
    brandSecondary: theme.brandSecondary || '#64748b',
    background: theme.background || '#ffffff',
    text: theme.text || '#1f2937',
    muted: theme.muted || '#6b7280',
    accent: theme.accent || '#f59e0b',
  };
});

export const useThemeSettings = () => useInvoice((state) => {
  const profile = state.profiles.find(p => p.id === state.selectedProfileId);
  const theme = profile?.theme || {};
  return {
    fontFamily: theme.fontFamily || 'system-ui',
    fontWeight: theme.fontWeight || 'Normal' as const,
    baseFontPx: theme.baseFontPx || 14,
    density: theme.density || 'normal' as const,
    separators: theme.separators || 'lines' as const,
    totalsAlign: theme.totalsAlign || 'right' as const,
  };
});

export const useRenderVersion = () => useInvoice(state => state.renderVersion);

// Selectores memoizados para customizer - direct object reference to prevent recreation
export const useCustomizerSettings = () =>
  useInvoice((s) => s.customizer);

export const useCustomizerLogoSettings = () =>
  useInvoice((s) => ({ size: s.customizer.logoSize, position: s.customizer.logoPosition }));