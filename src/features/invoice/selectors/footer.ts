import type { DocType } from '../types/types';

export function selectVisibleFooter(docType: DocType | 'invoice' | 'quote', footerState?: any): string[] {
  if (!footerState || !footerState.payment) return [];
  
  const payment = footerState.payment;
  if (!payment.enabled || !payment.items) return [];
  
  const normalizedDocType = docType === 'invoice' || docType === 'INVOICE' ? 'invoice' : 'quote';
  
  // Check visibility settings
  if (normalizedDocType === 'invoice' && !payment.visibility?.showOnInvoice) return [];
  if (normalizedDocType === 'quote' && !payment.visibility?.showOnQuote) return [];
  
  return payment.items;
}