export type FooterId = "v1-minimal" | "v2-legal" | "v3-us" | "v4-brand" | "v5-compact";
export type DocType = "INVOICE" | "QUOTE";

export type FooterLayout = "corporate" | "simple";
export type TotalsAlign = "left" | "center" | "right";
export type SeparatorStyle = "none" | "lines" | "underline";
export type CurrencySymbolPos = "before" | "after";
export type LogoAlign = "left" | "center" | "right";
export type LogoSize = "sm" | "md" | "lg";

export interface FooterSettings {
  notes?: string;
  contact?: string;         // e.g. "www.geeklatinmaster.com | +1..."
  socialsCsv?: string;      // e.g. "Instagram @..., YouTube @..."
  legal?: string;           // legal blurb
  showSocialIcons?: boolean;
  layout?: FooterLayout;    // "corporate"
  colorBarOn?: boolean;
  colorBarHeightPx?: number; // 0..10+
}

export interface ThemeSettings {
  brandPrimary?: string;   // #RRGGBB
  brandSecondary?: string;
  text?: string;
  muted?: string;
  background?: string;
  accent?: string;

  fontFamily?: string;     // "Roboto"
  fontWeight?: "Normal" | "SemiBold" | "Bold";
  baseFontPx?: number;     // e.g. 15
  density?: "compact" | "normal" | "relaxed";
  separators?: SeparatorStyle;
  headerRule?: SeparatorStyle;
  currencySymbolPos?: CurrencySymbolPos;
  totalsAlign?: TotalsAlign;
  altRowStripesOn?: boolean;
  
  // Logo positioning (moved from LogoSettings for unified theme management)
  logoSize?: LogoSize;
  logoAlign?: LogoAlign;
}

export interface LogoSettings {
  logoUrl?: string;
  logoDataUrl?: string; // preferred if present (local upload)
}

export type Profile = {
  id: string;
  name: string;
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
  
  // NEW/ensure present:
  footer?: FooterSettings;
  theme?: ThemeSettings;
  logo?: LogoSettings;
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
  footer?: import('../store/useInvoice').FooterData;
};
