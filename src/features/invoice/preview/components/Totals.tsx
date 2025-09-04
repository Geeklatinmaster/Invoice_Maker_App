import { useMemo } from "react";
import { formatMoney } from "../../lib/format";
import { useInvoice } from "@/features/invoice/store/useInvoice";

export default function Totals(){
  // For minimal footer visibility implementation, use empty data
  const items: any[] = [];
  const globalTaxRate = 0;
  const globalDiscount = 0;
  
  // Computed values with useMemo for performance
  const subTotal = useMemo(() => 
    items.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0), 
    [items]
  );
  
  const taxAmount = useMemo(() => 
    subTotal * (globalTaxRate / 100), 
    [subTotal, globalTaxRate]
  );
  
  const discountAmount = useMemo(() => 
    subTotal * (globalDiscount / 100), 
    [subTotal, globalDiscount]
  );
  
  const grandTotal = useMemo(() => 
    subTotal + taxAmount - discountAmount, 
    [subTotal, taxAmount, discountAmount]
  );

  return (
    <div className="totals" style={{
      background:"var(--surface)", 
      border:`var(--bw) solid var(--border)`, 
      borderRadius:"var(--r)", 
      padding:"var(--sp)"
    }}>
      <TotalRow label="Sub Total" value={formatMoney(subTotal)} />
      {globalDiscount > 0 && (
        <TotalRow label={`Discount (${globalDiscount}%)`} value={`-${formatMoney(discountAmount)}`} />
      )}
      {globalTaxRate > 0 && (
        <TotalRow label={`Tax (${globalTaxRate}%)`} value={formatMoney(taxAmount)} />
      )}
      <TotalRow label="Grand Total" value={formatMoney(grandTotal)} strong accent />
    </div>
  );
}

function TotalRow({label, value, strong, accent}: {
  label: string; 
  value: string; 
  strong?: boolean; 
  accent?: boolean;
}) {
  return (
    <div style={{
      display: "flex", 
      justifyContent: "space-between", 
      padding: "8px 0",
      borderBottom: `var(--bw) solid var(--border)`, 
      fontWeight: strong ? 700 : 500, 
      color: accent ? "var(--acc)" : "inherit"
    }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}