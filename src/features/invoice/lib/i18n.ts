export type Lang = 'en'|'es';
export const labels = {
  en: {
    invoice: 'INVOICE',
    quote: 'QUOTE',
    billedFrom: 'Invoice From:',
    quoteFrom: 'Billed From:',
    invoiceTo: 'Invoice To:',
    quoteTo: 'Quote To:',
    number: 'No',
    date: 'Date',
  },
  es: {
    invoice: 'FACTURA',
    quote: 'COTIZACIÓN',
    billedFrom: 'Facturado Por:',
    quoteFrom: 'Facturado Por:',
    invoiceTo: 'Facturar A:',
    quoteTo: 'Cotizar A:',
    number: 'N.º',
    date: 'Fecha',
  }
} as const;