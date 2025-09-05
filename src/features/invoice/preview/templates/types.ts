export type TemplateVM = {
  company: {
    name: string;
    email: string;
    phone: string;
    einTin: string;
    address: string;
    logoUrl: string;
    tagline: string;
  };
  client: {
    name: string;
    email: string;
    address: string;
  };
  doc: {
    type: "INVOICE" | "QUOTE";
    code: string;
    dateISO: string;
  };
  items: {
    id?: string;
    description: string;
    qty: number;
    unit: string;
    unitPrice: number;
    taxRate?: number;
    discount?: number;
    lineTotal: number;
  }[];
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    retention: number;
    total: number;
  };
  footer: {
    notes: string;
    terms: string;
    payment: { 
      show: boolean; 
      items: string[]; 
    };
    style?: any;
  };
  settings: {
    locale: string;
    currency: string;
    decimals: number;
  };
  meta: {
    number: string;
    date: string;
  };
};