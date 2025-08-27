import { useInvoice } from "../../store/useInvoice";
import { useTheme } from "../../../../theme/useTheme";
import { TheIcon } from "../../../../theme/Icon";
import { fmtCurrency } from "../../lib/format";
import { FooterBar } from "../parts";

export function ModernTeal(){
  const s = useInvoice(); 
  const iv = s.invoice;
  const profile = s.profiles.find(p=>p.id===s.selectedProfileId) ?? s.profiles[0];
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
        {(profile?.logo?.logoDataUrl || profile?.logo?.logoUrl) && 
          <img src={profile.logo.logoDataUrl || profile.logo.logoUrl} alt="logo" style={{height:"var(--logoH)"}}/>}
        <div>
          <h1 style={{margin:0, fontFamily:"var(--heading)", fontWeight:"var(--hW)"}}>{iv.docType ?? "INVOICE"}</h1>
          <small>{iv.docType ?? "Invoice"} #{iv.code ?? "0001"} • Date: {iv.issueDate ?? ""}</small>
        </div>
      </div>
      <address style={{textAlign:"right"}}>
        <div style={{fontWeight:600}}>{profile?.businessName}</div>
        <div style={{opacity:.9}}>{profile?.address}</div>
      </address>
    </header>

    <section style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp)", padding:"var(--sp)"}}>
      <div style={{background:"var(--surface)", border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", padding:"var(--sp)"}}>
        <div style={{fontWeight:700, color:"white", background:"var(--acc)", borderRadius:"calc(var(--r)/2)", display:"inline-block", padding:"2px 8px"}}>
          {iv.docType === "QUOTE" ? "QUOTE TO" : "INVOICE TO"}
        </div>
        <div style={{fontWeight:600, marginTop:6}}>{iv.customerName}</div>
        <div style={{opacity:.9}}>{iv.customerAddress}</div>
        <div style={{display:"flex", gap:12, marginTop:6, color:"var(--txtMuted)"}}>
          {iv.customerEmail && <span><TheIcon spec={icons.phone}/> {iv.customerEmail}</span>}
          {iv.customerEmail && <span><TheIcon spec={icons.email}/> {iv.customerEmail}</span>}
        </div>
      </div>
      <div style={{padding:"var(--sp)"}}>
        <div style={{fontWeight:700, marginBottom:6}}>Payment Info</div>
        <div>Business: {profile?.businessName}</div>
        <div>Email: {profile?.email}</div>
        <div>Phone: {profile?.phone}</div>
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
        {iv.items?.map((it,idx)=>(
          <tr key={it.id} style={{
            height:"var(--rowH)",
            background: idx%2===1 && (useTheme.getState().tokens.stripe) ? "rgba(0,0,0,var(--stripeOp))" : "transparent"
          }}>
            <td style={{textAlign:"right", padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{String(idx+1).padStart(2,"0")}</td>
            <td style={{textAlign:"left",  padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{it.title}</td>
            <td style={{textAlign:"right", padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{fmtCurrency(it.unitPrice, profile?.currency || "USD", profile?.locale || "en-US")}</td>
            <td style={{textAlign:"right", padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{it.qty}</td>
            <td style={{textAlign:"right", padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{fmtCurrency(it.qty * it.unitPrice, profile?.currency || "USD", profile?.locale || "en-US")}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <section style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"var(--sp)", padding:"var(--sp)"}}>
      <div>
        <div style={{fontWeight:700, color:"var(--acc)"}}>{iv.docType === "QUOTE" ? "QUOTE VALIDITY" : "TERMS & CONDITIONS"}</div>
        <p style={{opacity:.9}}>
          {iv.docType === "QUOTE" 
            ? "This quote is valid for 30 days from the quote date." 
            : "Payment is due within 30 days of invoice date."}
        </p>
      </div>
      <div style={{background:"var(--surface)", border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", padding:"var(--sp)"}}>
        <Row label="Sub Total" value={fmtCurrency(s.totals.subtotal, profile?.currency || "USD", profile?.locale || "en-US")}/>
        <Row label={`Tax (${(iv.globalTaxRate ?? 0)*100}%)`} value={fmtCurrency(s.totals.tax, profile?.currency || "USD", profile?.locale || "en-US")}/>
        <Row label="Grand Total" value={fmtCurrency(s.totals.total, profile?.currency || "USD", profile?.locale || "en-US")} strong accent />
      </div>
    </section>
    
    <div style={{padding:"var(--sp)"}}>
      <FooterBar />
    </div>
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