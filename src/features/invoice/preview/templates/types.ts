export type TemplateVM = {
  company: {
    name: string;
    email?: string;
    phone?: string;
    einTin?: string;
    address?: string;
    logoUrl?: string;
    tagline?: string;
  };
  client: {
    name: string;
    email?: string;
    address?: string;
  };
  doc: {
    type: "QUOTE" | "INVOICE";
    number: string;
    dateISO: string;
    code: string;
  };
  items: Array<{
    id: string;
    no: number;
    title: string;
    description?: string;
    price: number;
    qty: number;
    total: number;
    totalFmt: string;
    priceFmt: string;
  }>;
  totals: {
    subTotal: number;
    tax: number;
    discount: number;
    retention: number;
    grandTotal: number;
    subTotalFmt: string;
    taxFmt: string;
    discountFmt: string;
    retentionFmt: string;
    grandTotalFmt: string;
    currencyCode: string;
  };
  notes?: string;
  terms?: string;
  footer?: {
    enabled: boolean;
    mode: string;
    showTerms: boolean;
    notes?: { show: boolean; text: string };
    terms?: { show: boolean; text: string };
    payment?: { show: boolean; items: string[] };
    style?: string;
  };
  settings: { 
    locale: string; 
    currency: string; 
    decimals: number;
  };
  meta: {
    number?: string;
    date?: string;
  };
};

export type TemplateComponent = (props: { ctx: TemplateVM }) => React.JSX.Element;