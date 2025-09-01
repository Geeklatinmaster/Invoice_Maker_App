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
  theme?: ThemeSettings & {
    template?: import('../../../theme/types').TemplateId;
    tokens?: Partial<import('../../../theme/types').ThemeTokens>;
  };
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

export type SocialLink = {
  id: string;
  label: string;   // "Instagram", "Teléfono", etc.
  value: string;   // @user, url, número
  icon: { type:'mui'; name:'Phone'|'Email'|'Instagram'|'WhatsApp'|'Language'|'LocationOn' }
      | { type:'custom'; svg:string };
};

// Enhanced types for consistent structure
export type Brand = { 
  name?: string; 
  ein?: string; 
  email?: string; 
  phone?: string; 
  address?: string;
  logoUrl?: string;
  tagline?: string;
};

export type Client = { 
  name?: string; 
  email?: string; 
  address?: string; 
};

export type FooterMode = 'none'|'minimal'|'brand'|'social';

export type Footer = { 
  mode?: FooterMode; 
  showTerms?: boolean; 
};

export type Settings = { 
  locale: string; 
  currency: string; 
  decimals: number; 
};

export type Meta = {
  number?: string;
  date?: string;
};

export type Invoice = {
  docType: DocType;       // INVOICE/QUOTE
  code: string;           // autogenerado
  issueDate: string;      // ISO yyyy-mm-dd
  
  // Structured data with consistent defaults
  brand: Brand;
  client: Client;
  footer: Footer;
  settings: Settings;
  meta: Meta;
  
  items: InvoiceItem[];
  terms?: string;
  globalDiscount?: number;  // % global
  globalTaxRate?: number;   // % si se usa global
  retentionPreset: RetentionPreset;
  footerId: FooterId;
  socials: SocialLink[];  // Always array, never undefined
  
  // Legacy support - will be migrated
  customerName?: string;
  customerEmail?: string;
  customerAddress?: string;
};
