import { useInvoice } from "../store/useInvoice";

type MoneyOpts = { locale?: string; currency?: string; decimals?: number };

export function formatMoney(value: number, opts: MoneyOpts = {}): string {
  const settings = useInvoice.getState().invoice?.settings ?? { locale:'en-US', currency:'USD', decimals:2 };
  const locale   = opts.locale   ?? settings.locale   ?? 'en-US';
  const currency = opts.currency ?? settings.currency ?? 'USD';
  const decimals = opts.decimals ?? settings.decimals ?? 2;

  const nf = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return nf.format(Number.isFinite(value) ? value : 0);
}

// Aliases de compatibilidad con código legacy
export const fmtCurrency = formatMoney;
export const fmtMoney    = formatMoney;
export const fmtPrice    = formatMoney;

export function formatDate(d: Date | string): string {
  const settings = useInvoice.getState().invoice?.settings ?? { locale:'en-US' };
  const dtf = new Intl.DateTimeFormat(settings.locale ?? 'en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const date = typeof d === 'string' ? new Date(d) : d;
  return dtf.format(date);
}
export const fmtDate = formatDate;