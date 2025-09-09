// src/mappers/mapToTemplateProps.ts
import { InvoiceDoc, BrandProfile } from '@/types/invoice';

export type TemplateProps = {
  code: string;
  docType: 'invoice' | 'quote';
  brandName: string;
  logoUrl?: string;
  clientName: string;
  issueDate: string;
  dueDate?: string;
  currency: string;
  items: { title: string; desc?: string; qty: number; unitPrice: number; lineTotal: number }[];
  notes?: string;
  legalText?: string;
  totals: { subtotal: number; discount: number; tax: number; retention: number; grandTotal: number };
  footerBlocks: { text: string }[];
};

export function mapToTemplateProps(doc: InvoiceDoc, profile: BrandProfile, clientName: string): TemplateProps {
  return {
    code: doc.code,
    docType: doc.docType,
    brandName: profile.name,
    logoUrl: profile.logoUrl,
    clientName,
    issueDate: doc.issueDate,
    dueDate: doc.dueDate,
    currency: doc.currency || profile.currency,
    items: doc.items.map(i => ({
      title: i.title,
      desc: i.description,
      qty: i.qty,
      unitPrice: i.unitPrice,
      lineTotal: +(i.qty * i.unitPrice).toFixed(2),
    })),
    notes: doc.notes,
    legalText: doc.legalText,
    totals: doc.totals,
    footerBlocks: profile.footerBlocks
      .filter(f => (doc.docType === 'invoice' ? f.showOnInvoice : f.showOnQuote))
      .map(f => ({ text: f.text })),
  };
}