export type FooterId = "v1-minimal" | "v2-legal" | "v3-us" | "v4-brand" | "v5-compact";
export type DocType = "INVOICE" | "QUOTE";

export type Profile = {
  id: string;
  name: string;
  businessName: string;
  email?: string;
  phone?: string;
  website?: string;
  taxId?: string;
  logoUrl?: string;       // ⬅️ NUEVO
  currency: string;
  locale: string;
  defaultTaxRate?: number;
  defaultFooterId?: FooterId;
};

export type InvoiceItem = {
  id: string;
  title: string;
  description?: string;
  qty: number;
  unitPrice: number;
  taxRate?: number;
  discount?: number; // %
};

export type RetentionPreset = "AGENTE_RETENCION" | "NO_AGENTE" | "NONE";

export type Invoice = {
  docType: DocType;
  code: string;
  issueDate: string; // yyyy-mm-dd
  customerName: string;
  items: InvoiceItem[];
  globalDiscount?: number; // %
  globalTaxRate?: number;  // %
  retentionPreset: RetentionPreset;
  footerId: FooterId;
};
