import { useInvoice } from "../store/useInvoice";
import { fmtCurrency } from "../lib/format";

export function ItemsTable(){
  const s = useInvoice();
  const iv = s.invoice;
  const profile = s.profiles.find(p=>p.id===s.selectedProfileId) ?? s.profiles[0];
  const currency = profile?.currency ?? "USD";
  const locale = profile?.locale ?? "en-US";
  
  return (
    <table style={{width:"100%", borderCollapse:"collapse"}}>
      <thead style={{background:"var(--surface)"}}>
        <tr>
          {["No.","Description","Price","Qty.","Total"].map((h,i)=>(
            <th key={i} style={{
              textAlign: i===1?"left":"right",
              padding:"12px", borderBottom:`var(--bw) solid var(--border)`}}>
              <span style={{fontWeight:700}}>{h}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {iv.items?.map((it,idx)=>(
          <tr key={it.id} style={{
            height:"var(--rowH)",
            background: idx%2===1 && (getStripe()) ? "rgba(0,0,0,var(--stripeOp))" : "transparent"
          }}>
            <td style={tdR()}>{String(idx+1).padStart(2,"0")}</td>
            <td style={tdL()}>{it.title}</td>
            <td style={tdR()}>{fmtCurrency(it.unitPrice, currency, locale)}</td>
            <td style={tdR()}>{it.qty}</td>
            <td style={tdR()}>{fmtCurrency(it.unitPrice*it.qty, currency, locale)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function getStripe(){ return (Number(getComputedStyle(document.documentElement).getPropertyValue('--stripe')) ?? 0) === 1; }
function tdBase(){ return { padding:"10px", borderBottom:`var(--bw) solid var(--border)` } as const; }
function tdR(){ return { ...tdBase(), textAlign:"right" } as const; }
function tdL(){ return { ...tdBase(), textAlign:"left" } as const; }

export function TotalsCard(){
  const s = useInvoice();
  const totals = s.totals;
  const profile = s.profiles.find(p=>p.id===s.selectedProfileId) ?? s.profiles[0];
  const currency = profile?.currency ?? "USD";
  const locale = profile?.locale ?? "en-US";
  
  const Row = ({label,val,strong,accent}:{label:string;val:string;strong?:boolean;accent?:boolean;}) => (
    <div style={{
      display:"flex", justifyContent:"space-between", padding:"8px 0",
      borderBottom:`var(--bw) solid var(--border)`,
      fontWeight: strong?700:500, color: accent? "var(--acc)":"inherit"}}>
      <span>{label}</span><span>{val}</span>
    </div>
  );
  return (
    <div style={{background:"var(--surface)", border:`var(--bw) solid var(--border)`,
      borderRadius:"var(--r)", padding:"var(--sp)"}}>
      <Row label="Sub Total" val={fmtCurrency(totals.subtotal, currency, locale)}/>
      {totals.tax > 0 && <Row label="Tax" val={fmtCurrency(totals.tax, currency, locale)}/>}
      {totals.discount > 0 && <Row label="Discount" val={`-${fmtCurrency(totals.discount, currency, locale)}`}/>}
      {totals.retention > 0 && <Row label="Retention" val={`-${fmtCurrency(totals.retention, currency, locale)}`}/>}
      <Row label="Grand Total" val={fmtCurrency(totals.total, currency, locale)} strong accent />
    </div>
  );
}