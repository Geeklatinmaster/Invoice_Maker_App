export const fmtCurrency = (value: number, currency: string, locale: string) =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

export const fmtDate = (iso: string, locale = "en-US") =>
  new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date(iso));
