import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

export type SupportedLocale = 'en-US' | 'es-VE' | 'es-ES';

const dateLocales = {
  'en-US': enUS,
  'es-VE': es,
  'es-ES': es
};

/**
 * Format currency using Intl.NumberFormat
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: SupportedLocale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format number using Intl.NumberFormat
 */
export function formatNumber(
  value: number,
  locale: SupportedLocale = 'en-US',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  locale: SupportedLocale = 'en-US',
  decimals: number = 1
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
}

/**
 * Format date using date-fns
 */
export function formatDate(
  date: Date | string | number,
  formatStr: string = 'MMM d, yyyy',
  locale: SupportedLocale = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  const dateLocale = dateLocales[locale] || dateLocales['en-US'];
  
  return format(dateObj, formatStr, { locale: dateLocale });
}

/**
 * Format relative date (e.g., "2 days ago")
 */
export function formatRelativeDate(
  date: Date | string | number,
  locale: SupportedLocale = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  const now = new Date();
  const diffTime = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (locale.startsWith('es')) {
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
  } else {
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }
}

/**
 * Format phone number
 */
export function formatPhone(phone: string, locale: SupportedLocale = 'en-US'): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  if (locale === 'en-US' && cleaned.length === 10) {
    // US format: (123) 456-7890
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else if (locale.startsWith('es') && cleaned.length >= 10) {
    // Venezuelan/Spanish format: +58 123 456-7890
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3-$4');
  }
  
  // Return as-is if no formatting rule matches
  return phone;
}

/**
 * Parse number from localized string
 */
export function parseNumber(value: string, locale: SupportedLocale = 'en-US'): number {
  // Handle different decimal separators
  if (locale.startsWith('es')) {
    // Spanish locales use comma as decimal separator
    value = value.replace(/\./g, '').replace(',', '.');
  } else {
    // English locales use period as decimal separator, remove commas
    value = value.replace(/,/g, '');
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format document number with padding
 */
export function formatDocumentNumber(
  number: number,
  prefix: string = '',
  padding: number = 4
): string {
  const paddedNumber = number.toString().padStart(padding, '0');
  return prefix ? `${prefix}-${paddedNumber}` : paddedNumber;
}

/**
 * Generate document number patterns
 */
export function getDocumentNumberPattern(
  docType: 'invoice' | 'quote',
  locale: SupportedLocale = 'en-US'
): string {
  const prefixes = {
    invoice: locale.startsWith('es') ? 'FAC' : 'INV',
    quote: locale.startsWith('es') ? 'COT' : 'QUO'
  };
  
  return prefixes[docType];
}