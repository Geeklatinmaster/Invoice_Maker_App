// src/types/invoice.ts
export type DocType = 'invoice' | 'quote';

export type LineItem = {
  id: string;
  title: string;
  description?: string;
  qty: number;             // >= 0
  unitPrice: number;       // >= 0
  taxRate?: number;        // % 0..100 (por ítem opcional)
  retentionRate?: number;  // % 0..100 (por ítem opcional)
  discount?: number;       // absoluto por ítem (opcional)
};

export type BrandProfile = {
  id: string;
  name: string;
  logoUrl?: string;
  colors?: { primary?: string; secondary?: string };
  footerBlocks: { showOnInvoice: boolean; showOnQuote: boolean; text: string }[];
  taxConfig?: { globalRate?: number; perItem?: boolean };
  currency: string; // ISO code e.g. "USD", "VES", "EUR"
};

export type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';

export type InvoiceDoc = {
  id: string;
  docType: DocType;      // 'invoice' | 'quote'
  code: string;          // autonum por docType
  brandProfileId: string;
  clientId: string;
  issueDate: string;     // ISO
  dueDate?: string;      // ISO
  items: LineItem[];
  globalDiscount?: number; // absoluto
  notes?: string;
  legalText?: string;
  currency: string;        // redundante a profile si decides congelar moneda por doc
  status: InvoiceStatus;
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    retention: number;
    grandTotal: number;
  };
};

export type AppPrefs = {
  lang: 'es' | 'en';
  theme: 'light' | 'dark';
};

export type AppState = {
  invoices: Record<string, InvoiceDoc>;
  clients: Record<string, Client>;
  brandProfiles: Record<string, BrandProfile>;
  selectedInvoiceId?: string;
  prefs: AppPrefs;

  // Actions
  setSelectedInvoiceId: (id?: string) => void;
  upsertInvoice: (doc: Partial<InvoiceDoc> & { id: string }) => void;
  updateCurrentInvoice: (patch: Partial<InvoiceDoc>) => void;
  addLineItem: (item: LineItem) => void;
  removeLineItem: (id: string) => void;
  setPrefs: (p: Partial<AppPrefs>) => void;
};