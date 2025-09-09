import i18n from '@/i18n';

export function formatMoney(amount: number, currency: string = "USD", locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string, locale: string = 'es-ES'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d).replace(/\b\w/g, l => l.toUpperCase());
}

export function getDocTypeLabel(docType: 'INVOICE' | 'QUOTE'): string {
  return docType === 'INVOICE' ? i18n.t('docType.invoice') : i18n.t('docType.quote');
}

export function formatDocumentCode(prefix: string, year: number, sequence: number): string {
  return `${prefix}-${year}-${sequence.toString().padStart(6, '0')}`;
}

export const money = (n:number, currency:string, locale:string="es-VE") =>
  new Intl.NumberFormat(locale, { style:"currency", currency }).format(n||0);