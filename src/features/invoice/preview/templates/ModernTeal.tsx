import { useInvoice } from "../../store/useInvoice";
import { useTheme } from "../../../../theme/useTheme";
import { TheIcon } from "../../../../theme/Icon";
import { formatMoney, formatDate } from "../../lib/format";
import { FooterBar } from "../parts";
import FooterSlot from "../FooterSlot";

export function ModernTeal(){
  // Use reactive selectors for optimal performance
  const brand = useInvoice(s => s.invoice.brand);
  const client = useInvoice(s => s.invoice.client);
  const items = useInvoice(s => s.invoice.items);
  const docType = useInvoice(s => s.invoice.docType);
  const code = useInvoice(s => s.invoice.code);
  const issueDate = useInvoice(s => s.invoice.issueDate);
  const totals = useInvoice(s => s.totals);
  const { icons } = useTheme();

  return (
  <section style={{
    background:"var(--bg)", color:"var(--txt)", fontFamily:"var(--body)",
    border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", overflow:"hidden"
  }}>
    <header style={{
      padding:"calc(var(--sp)*1.25)",
      background:"linear-gradient(90deg,var(--acc),var(--acc2))",
      color:"#fff", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12
    }}>
      <div style={{display:"flex", alignItems:"center", gap:12}}>
        {brand?.logoUrl && 
          <img src={brand.logoUrl} alt="logo" style={{height:"var(--logoH)"}}/>}
        <div>
          <h1 style={{margin:0, fontFamily:"var(--heading)", fontWeight:"var(--hW)"}}>{docType ?? "INVOICE"}</h1>
          <small>{docType ?? "Invoice"} #{code ?? "0001"} • Date: {formatDate(issueDate ?? new Date())}</small>
        </div>
      </div>
      <address style={{textAlign:"right"}}>
        <div style={{fontWeight:600}}>{brand?.name || 'My Business'}</div>
        <div style={{opacity:.9}}>{brand?.address}</div>
      </address>
    </header>

    <section style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp)", padding:"var(--sp)"}}>
      <div style={{background:"var(--surface)", border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", padding:"var(--sp)"}}>
        <div style={{fontWeight:700, color:"white", background:"var(--acc)", borderRadius:"calc(var(--r)/2)", display:"inline-block", padding:"2px 8px"}}>
          {docType === "QUOTE" ? "QUOTE TO" : "INVOICE TO"}
        </div>
        <div style={{fontWeight:600, marginTop:6}}>{client?.name || 'Cliente de Prueba'}</div>
        <div style={{opacity:.9}}>{client?.address}</div>
        <div style={{display:"flex", gap:12, marginTop:6, color:"var(--txtMuted)"}}>
          {client?.email && <span><TheIcon spec={icons.email}/> {client.email}</span>}
        </div>
      </div>
      <div style={{padding:"var(--sp)"}}>
        <div style={{fontWeight:700, marginBottom:6}}>Payment Info</div>
        <div>Business: {brand?.name || 'My Business'}</div>
        <div>Email: {brand?.email}</div>
        <div>Phone: {brand?.phone}</div>
      </div>
    </section>

    <table style={{width:"100%", borderCollapse:"collapse"}}>
      <thead style={{background:"var(--surface)"}}>
        <tr>
          {["No.","Description","Price","Qty.","Total"].map((h,i)=>(
            <th key={i} style={{textAlign:i===1?"left":"right", padding:"12px", borderBottom:`var(--bw) solid var(--border)`}}>
              <span style={{fontWeight:700}}>{h}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items?.map((it,idx)=>(
          <tr key={it.id} style={{
            height:"var(--rowH)",
            background: idx%2===1 && (useTheme.getState().tokens.stripe) ? "rgba(0,0,0,var(--stripeOp))" : "transparent"
          }}>
            <td style={{textAlign:"right", padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{String(idx+1).padStart(2,"0")}</td>
            <td style={{textAlign:"left",  padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{it.title}</td>
            <td style={{textAlign:"right", padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{formatMoney(it.unitPrice)}</td>
            <td style={{textAlign:"right", padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{it.qty}</td>
            <td style={{textAlign:"right", padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{formatMoney(it.qty * it.unitPrice)}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <section style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"var(--sp)", padding:"var(--sp)"}}>
      <div>
        <div style={{fontWeight:700, color:"var(--acc)"}}>{docType === "QUOTE" ? "QUOTE VALIDITY" : "TERMS & CONDITIONS"}</div>
        <p style={{opacity:.9}}>
          {docType === "QUOTE" 
            ? "This quote is valid for 30 days from the quote date." 
            : "Payment is due within 30 days of invoice date."}
        </p>
      </div>
      <div style={{background:"var(--surface)", border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", padding:"var(--sp)"}}>
        <Row label="Sub Total" value={formatMoney(totals.subtotal)}/>
        <Row label="Tax" value={formatMoney(totals.tax)}/>
        <Row label="Grand Total" value={formatMoney(totals.total)} strong accent />
      </div>
    </section>
    
    <FooterSlot />
  </section>);
}

function Row({label,value,strong,accent}:{label:string;value:string;strong?:boolean;accent?:boolean;}){
  return (
    <div style={{display:"flex", justifyContent:"space-between", padding:"8px 0",
      borderBottom:`var(--bw) solid var(--border)`, fontWeight:strong?700:500, color:accent?"var(--acc)":"inherit"}}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}