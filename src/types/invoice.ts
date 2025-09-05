export type DocType = "invoice" | "quote";

export type Brand = {
  name?: string; 
  email?: string; 
  phone?: string; 
  address?: string;
  logoUrl?: string; 
  ein?: string; 
  tin?: string; 
  tagline?: string; 
  logoDataUrl?: string;
};

export type Client = { 
  name?: string; 
  email?: string; 
  address?: string; 
};

export type Item = {
  id?: string; 
  description?: string; 
  title?: string;
  qty?: number; 
  unit?: string; 
  unitPrice?: number; 
  taxRate?: number; 
  discount?: number;
};

export type Settings = { 
  locale?: string; 
  currency?: string; 
  decimals?: number; 
};

export type Meta = { 
  number?: string; 
  date?: string; 
};

export type FooterState = { 
  payment?: { 
    items?: any[]; 
  }; 
};

export type InvoiceModel = {
  brand?: Brand; 
  client?: Client; 
  items?: Item[];
  settings?: Settings; 
  meta?: Meta; 
  footer?: any;
};