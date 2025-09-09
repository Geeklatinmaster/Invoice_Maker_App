import { useInvoice } from "@/features/invoice/store/useInvoice";
import { getAvailableFooters, isFooterAvailable, getDefaultFooterForDocType } from "@/lib/footer-rules";
import type { FooterId } from "../types/types";
import { useEffect } from "react";

export default function FooterSelector() {
  const { invoice, setFooterId } = useInvoice();
  const availableFooters = getAvailableFooters(invoice.docType);
  
  // Auto-correct footer if it's not available for current docType
  useEffect(() => {
    if (!isFooterAvailable(invoice.footerId, invoice.docType)) {
      const defaultFooter = getDefaultFooterForDocType(invoice.docType);
      setFooterId(defaultFooter);
    }
  }, [invoice.docType, invoice.footerId, setFooterId]);
  
  return (
    <label>
      Footer:&nbsp;
      <select value={invoice.footerId} onChange={(e)=>setFooterId(e.target.value as FooterId)}>
        {availableFooters.map(f=><option key={f.id} value={f.id}>{f.label}</option>)}
      </select>
    </label>
  );
}
