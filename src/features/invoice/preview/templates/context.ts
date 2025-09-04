import { useInvoice } from "@/features/invoice/store/useInvoice";
import type { DocType } from "@/types/invoice";
import { selectVisibleFooter } from "@/features/invoice/selectors/footer";
import { formatMoney } from "../../lib/format";
import type { TemplateVM } from "./types";
import { useMemo } from "react";

export function buildTemplateContext(s: any): TemplateVM {
  const docType = s.docType || 'invoice';
  const footerState = s.footerState;
  
  return {
    company: {
      name: "My Business",
      email: "",
      phone: "",
      einTin: "",
      address: "",
      logoUrl: "",
      tagline: "",
    },
    client: {
      name: "",
      email: "",
      address: "",
    },
    doc: {
      type: docType.toUpperCase(),
      number: "",
      dateISO: new Date().toISOString().slice(0, 10),
      code: "",
    },
    items: [],
    totals: {
      subTotal: 0,
      tax: 0,
      discount: 0,
      retention: 0,
      grandTotal: 0,
      subTotalFmt: "$0.00",
      taxFmt: "$0.00",
      discountFmt: "$0.00",
      retentionFmt: "$0.00",
      grandTotalFmt: "$0.00",
      currencyCode: "USD",
    },
    notes: "",
    terms: "",
    footer: {
      enabled: true,
      mode: 'social' as const,
      showTerms: false,
      style: footerState?.style || 'Brand',
      notes: selectVisibleFooter(docType, [footerState.notes]).length > 0
        ? { show: true, text: footerState.notes.text }
        : undefined,
      terms: selectVisibleFooter(docType, [footerState.terms]).length > 0
        ? { show: true, text: footerState.terms.text }
        : undefined,
      payment: selectVisibleFooter(docType, [footerState.payment]).length > 0
        ? { show: true, items: footerState.payment.items }
        : undefined,
    },
    settings: { locale: 'en-US', currency: 'USD', decimals: 2 },
    meta: {
      number: "",
      date: "",
    },
  };
}

/** Hook: memoized TemplateVM for minimal re-renders */
export function useTemplateContext(): TemplateVM {
  // Use individual selectors to avoid infinite loops
  const docType = useInvoice(s => s.docType);
  const footerState = useInvoice(s => s.footerState);
  
  // Memoize the context to prevent infinite re-renders
  return useMemo(() => {
    return buildTemplateContext({ docType, footerState } as any);
  }, [docType, footerState]);
}