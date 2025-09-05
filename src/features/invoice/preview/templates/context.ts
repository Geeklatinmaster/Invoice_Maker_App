import { useMemo } from "react";
import { useInvoice } from "@/features/invoice/store/useInvoice";
import type { TemplateVM } from "./types";

export function useTemplateContext(): TemplateVM {
  // Granular subscriptions that affect the preview
  const invoice = useInvoice(s => s.invoice);
  const profiles = useInvoice(s => s.profiles);
  const selectedProfileId = useInvoice(s => s.selectedProfileId);
  const totals = useInvoice(s => s.totals);

  return useMemo(() => {
    const profile = profiles.find(p => p.id === selectedProfileId) || profiles[0];
    
    // Fallback for when profile might be undefined
    const safeProfile = profile || {
      businessName: '',
      currency: 'USD',
      locale: 'en-US',
      logoUrl: '',
      email: '',
      phone: '',
      address: '',
      taxId: ''
    };

    return {
      company: {
        name: safeProfile.businessName || "",
        email: safeProfile.email || "",
        phone: safeProfile.phone || "",
        einTin: safeProfile.taxId || "",
        address: safeProfile.address || "",
        logoUrl: safeProfile.logoUrl || "",
        tagline: "", // Not in current profile structure
      },
      client: {
        name: invoice?.customerName || "",
        email: invoice?.customerEmail || "",
        address: invoice?.customerAddress || "",
      },
      doc: {
        type: invoice?.docType || "INVOICE",
        code: invoice?.code || "",
        dateISO: invoice?.issueDate || new Date().toISOString(),
      },
      items: (invoice?.items || []).map((i) => ({
        id: i?.id,
        description: i?.description || i?.title || "",
        qty: Number(i?.qty || 0),
        unit: "", // Not in current item structure
        unitPrice: Number(i?.unitPrice || 0),
        taxRate: i?.taxRate,
        discount: i?.discount,
        lineTotal: Number(i?.qty || 0) * Number(i?.unitPrice || 0),
      })),
      totals: totals || { subtotal: 0, discount: 0, tax: 0, retention: 0, total: 0 },
      footer: {
        notes: "", // Could be extended based on footerId
        terms: "", // Could be extended based on footerId
        payment: { 
          show: false, // Simplified for now
          items: [] 
        },
        style: invoice?.footerId,
      },
      settings: {
        locale: safeProfile.locale || "en-US",
        currency: safeProfile.currency || "USD",
        decimals: 2, // Default, could be extended
      },
      meta: {
        number: invoice?.code || "",
        date: invoice?.issueDate || new Date().toISOString().slice(0, 10),
      },
    };
  }, [invoice, profiles, selectedProfileId, totals]);
}