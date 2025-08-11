export type FooterId = "v1-minimal" | "v2-legal" | "v3-us" | "v4-brand" | "v5-compact";
export type DocType = "INVOICE" | "QUOTE";

export type Profile = {
  id: string;
  name: string;
  logoUrl?: string;
  businessName: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  taxId?: string;            // EIN/TIN
  currency: string;          // "USD"
  locale: string;            // "en-US"
  defaultTaxRate?: number;   // IVA/Tax global %
  defaultFooterId?: FooterId;
  customFields?: { key: string; value: string }[];
};

export type InvoiceItem = {
  id: string;
  title: string;
  description?: string;
  qty: number;
  unitPrice: number;
  taxRate?: number;   // si no, usa el global
  discount?: number;  // % por línea
};

export type RetentionPreset = "AGENTE_RETENCION" | "NO_AGENTE" | "NONE";

export type Invoice = {
  docType: DocType;       // INVOICE/QUOTE
  code: string;           // autogenerado
  issueDate: string;      // ISO yyyy-mm-dd
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  items: InvoiceItem[];
  globalDiscount?: number;  // % global
  globalTaxRate?: number;   // % si se usa global
  retentionPreset: RetentionPreset;
  footerId: FooterId;
};
