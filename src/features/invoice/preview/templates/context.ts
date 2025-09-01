import { useInvoice } from "@/features/invoice/store/useInvoice";
import { formatMoney } from "../../lib/format";
import type { TemplateVM } from "./types";
import { useMemo } from "react";

export function buildTemplateContext(s: ReturnType<typeof useInvoice.getState>): TemplateVM {
  const profile = s.profiles?.find(p => p.id === s.selectedProfileId) ?? s.profiles?.[0];
  const invoice = s.invoice || {};
  const totals = s.totals || {};
  
  // Safe settings extraction
  const settings = invoice.settings || { locale: 'en-US', currency: 'USD', decimals: 2 };
  const locale = settings.locale || 'en-US';
  const currency = settings.currency || 'USD';
  const decimals = settings.decimals || 2;

  // Process items with formatted values
  const items = (invoice.items || []).map((item: any, idx: number) => {
    const price = Number(item.unitPrice) || 0;
    const qty = Number(item.qty) || 0;
    const total = price * qty;
    
    return {
      id: item.id || String(idx + 1),
      no: idx + 1,
      title: item.title || "",
      description: item.description || "",
      price,
      qty,
      total,
      priceFmt: formatMoney(price, { locale, currency }),
      totalFmt: formatMoney(total, { locale, currency }),
    };
  });

  return {
    company: {
      name: invoice.brand?.name || profile?.businessName || "My Business",
      email: invoice.brand?.email || profile?.email || "",
      phone: invoice.brand?.phone || profile?.phone || "",
      einTin: invoice.brand?.ein || profile?.taxId || "",
      address: invoice.brand?.address || profile?.address || "",
      logoUrl: invoice.brand?.logoUrl || profile?.logo?.logoUrl || "",
      tagline: invoice.brand?.tagline || "",
    },
    client: {
      name: invoice.client?.name || "",
      email: invoice.client?.email || "",
      address: invoice.client?.address || "",
    },
    doc: {
      type: invoice.docType || "INVOICE",
      number: invoice.meta?.number || "",
      dateISO: invoice.meta?.date || new Date().toISOString().slice(0, 10),
      code: invoice.code || "",
    },
    items,
    totals: {
      subTotal: totals.subtotal || 0,
      tax: totals.tax || 0,
      discount: totals.discount || 0,
      retention: totals.retention || 0,
      grandTotal: totals.total || 0,
      subTotalFmt: formatMoney(totals.subtotal || 0, { locale, currency }),
      taxFmt: formatMoney(totals.tax || 0, { locale, currency }),
      discountFmt: formatMoney(totals.discount || 0, { locale, currency }),
      retentionFmt: formatMoney(totals.retention || 0, { locale, currency }),
      grandTotalFmt: formatMoney(totals.total || 0, { locale, currency }),
      currencyCode: currency,
    },
    notes: invoice.terms || "",
    terms: invoice.terms || "",
    footer: {
      enabled: invoice.footer?.mode !== 'none',
      mode: invoice.footer?.mode || 'social',
      showTerms: invoice.footer?.showTerms || false,
    },
    settings: { locale, currency, decimals },
    meta: {
      number: invoice.meta?.number || "",
      date: invoice.meta?.date || "",
    },
  };
}

/** Hook: memoized TemplateVM for minimal re-renders */
export function useTemplateContext(): TemplateVM {
  // Use individual selectors to avoid infinite loops
  const profiles = useInvoice(s => s.profiles);
  const selectedProfileId = useInvoice(s => s.selectedProfileId);
  const invoice = useInvoice(s => s.invoice);
  const totals = useInvoice(s => s.totals);
  
  // Memoize the context to prevent infinite re-renders
  return useMemo(() => {
    return buildTemplateContext({ profiles, selectedProfileId, invoice, totals } as any);
  }, [profiles, selectedProfileId, invoice, totals]);
}