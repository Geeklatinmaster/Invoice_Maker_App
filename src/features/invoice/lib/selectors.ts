import { useInvoice } from "@/features/invoice/store/useInvoice";
import type { Lang } from "./i18n";

export const useLang = (): Lang => {
  // const loc = useInvoice(s=>s.invoice.settings?.locale || 'en-US');
  // return loc.startsWith('es') ? 'es' : 'en';
  return 'en'; // Fallback for minimal store
};
export const useDocType = () => useInvoice(s=>s.docType || 'invoice');

// Commented out - depends on full store structure
// export const useBrand = () => useInvoice(s=>s.invoice.brand);
// export const useClient = () => useInvoice(s=>s.invoice.client);
// export const useMeta = () => useInvoice(s=>s.invoice.meta || { number:'', date: new Date().toISOString().slice(0,10) });
// export const useTagline = () => useInvoice(s=>s.invoice.brand?.tagline || '');