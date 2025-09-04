export type DocType = 'invoice' | 'quote';

export type FooterVisibility = {
  showOnInvoice: boolean;
  showOnQuote: boolean;
};

export interface FooterBlock {
  enabled: boolean;
  visibility: FooterVisibility;
  id?: string; // opcional, útil para tests/debug
}

export interface FooterTextSection extends FooterBlock {
  text: string;
}

export interface FooterPaymentSection extends FooterBlock {
  items: string[];
}

export type FooterState = {
  notes: FooterTextSection;
  terms: FooterTextSection;
  payment: FooterPaymentSection;
};