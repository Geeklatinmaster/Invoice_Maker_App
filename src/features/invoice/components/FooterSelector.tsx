import { useInvoice } from "@/features/invoice/store/useInvoice";
import type { FooterId } from "../types/types";

const FOOTERS: { id: FooterId; label: string }[] = [
  { id: "v1-minimal", label: "Minimal" },
  { id: "v2-legal", label: "Legal" },
  { id: "v3-us", label: "US Business" },
  { id: "v4-brand", label: "Brand" },
  { id: "v5-compact", label: "Compact" },
];

export default function FooterSelector() {
  const { invoice, setFooterId } = useInvoice();
  return (
    <label>
      Footer:&nbsp;
      <select value={invoice.footerId} onChange={(e)=>setFooterId(e.target.value as FooterId)}>
        {FOOTERS.map(f=><option key={f.id} value={f.id}>{f.label}</option>)}
      </select>
    </label>
  );
}
