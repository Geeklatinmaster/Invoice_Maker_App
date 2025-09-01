import { useInvoice } from "@/features/invoice/store/useInvoice";

type MoneyOpts = { locale?: string; currency?: string; decimals?: number };

// Overload for legacy 3-parameter calls
export function formatMoney(value: number, locale?: string, currency?: string): string;
// Main signature with options object
export function formatMoney(value: number, opts?: MoneyOpts): string;
export function formatMoney(value: number, optsOrLocale: MoneyOpts | string = {}, currencyParam?: string): string {
  // Handle legacy 3-parameter calls
  const opts = typeof optsOrLocale === 'string' 
    ? { locale: optsOrLocale, currency: currencyParam } 
    : optsOrLocale;
  const settings = useInvoice.getState().invoice?.settings ?? { locale:'en-US', currency:'USD', decimals:2 };
  const locale   = opts.locale   ?? settings.locale   ?? 'en-US';
  const currency = opts.currency ?? settings.currency ?? 'USD';
  const decimals = opts.decimals ?? settings.decimals ?? 2;

  // Validate currency code format (should be 3 letters like USD, EUR)
  const validatedCurrency = /^[A-Z]{3}$/.test(currency) ? currency : 'USD';
  const validatedLocale = locale || 'en-US';
  
  try {
    const nf = new Intl.NumberFormat(validatedLocale, {
      style: 'currency',
      currency: validatedCurrency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return nf.format(Number.isFinite(value) ? value : 0);
  } catch (error) {
    console.error('formatMoney error:', { value, locale: validatedLocale, currency: validatedCurrency, originalCurrency: currency, error });
    // Fallback to simple formatting
    return `${validatedCurrency} ${value.toFixed(decimals || 2)}`;
  }
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