import { useInvoice } from "../store/useInvoice";
import type { FooterId } from "../types/types";

const OPTS: {id: FooterId; label: string}[] = [
  { id: "v1-minimal", label: "Minimal" },
  { id: "v2-legal", label: "Legal" },
  { id: "v3-us", label: "US" },
  { id: "v4-brand", label: "Brand" },
  { id: "v5-compact", label: "Compact" },
];

export default function FooterSelector() {
  const { invoice, setFooterId } = useInvoice();
  return (
    <label>Footer:&nbsp;
      <select value={invoice.footerId} onChange={e=>setFooterId(e.target.value as FooterId)}>
        {OPTS.map(o=> <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
    </label>
  );
}
