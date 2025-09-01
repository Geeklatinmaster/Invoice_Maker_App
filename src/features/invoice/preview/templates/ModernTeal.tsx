import { useTheme } from "../../../../theme/useTheme";
import { TheIcon } from "../../../../theme/Icon";
import { formatDate } from "../../lib/format";
import { FooterBar } from "../parts";
import FooterSlot from "../FooterSlot";
import type { TemplateVM } from "./types";

export function ModernTeal({ ctx }: { ctx: TemplateVM }){
  const { icons } = useTheme();
  
  // Safety check - return early if context is not ready
  if (!ctx || !ctx.client || !ctx.company || !ctx.doc) {
    return <div>Loading...</div>;
  }

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
        {ctx.company.logoUrl && ctx.company.logoUrl.trim() && !ctx.company.logoUrl.startsWith('blob:') && 
          <img src={ctx.company.logoUrl} alt="logo" style={{height:"var(--logoH)"}} onError={(e) => e.currentTarget.style.display = 'none'}/>}
        <div>
          <h1 style={{margin:0, fontFamily:"var(--heading)", fontWeight:"var(--hW)"}}>{ctx.doc.type ?? "INVOICE"}</h1>
          <small>{ctx.doc.type ?? "Invoice"} #{ctx.doc.code ?? "0001"} • Date: {formatDate(ctx.doc.dateISO ?? new Date())}</small>
        </div>
      </div>
      <address style={{textAlign:"right"}}>
        <div style={{fontWeight:600}}>{ctx.company.name}</div>
        <div style={{opacity:.9}}>{ctx.company.address}</div>
      </address>
    </header>

    <section style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp)", padding:"var(--sp)"}}>
      <div style={{background:"var(--surface)", border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", padding:"var(--sp)"}}>
        <div style={{fontWeight:700, color:"white", background:"var(--acc)", borderRadius:"calc(var(--r)/2)", display:"inline-block", padding:"2px 8px"}}>
          {ctx.doc.type === "QUOTE" ? "QUOTE TO" : "INVOICE TO"}
        </div>
        <div style={{fontWeight:600, marginTop:6}}>{ctx.client.name}</div>
        <div style={{opacity:.9}}>{ctx.client.address}</div>
        <div style={{display:"flex", gap:12, marginTop:6, color:"var(--txtMuted)"}}>
          {ctx.client.email && <span><TheIcon spec={icons.email}/> {ctx.client.email}</span>}
        </div>
      </div>
      <div style={{padding:"var(--sp)"}}>
        <div style={{fontWeight:700, marginBottom:6}}>Payment Info</div>
        <div>Business: {ctx.company.name}</div>
        <div>Email: {ctx.company.email}</div>
        <div>Phone: {ctx.company.phone}</div>
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
        {ctx.items?.map((it,idx)=>(
          <tr key={it.id} style={{
            height:"var(--rowH)",
            background: idx%2===1 && (useTheme.getState().tokens.stripe) ? "rgba(0,0,0,var(--stripeOp))" : "transparent"
          }}>
            <td style={{textAlign:"right", padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{String(idx+1).padStart(2,"0")}</td>
            <td style={{textAlign:"left",  padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{it.title}</td>
            <td style={{textAlign:"right", padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{it.priceFmt}</td>
            <td style={{textAlign:"right", padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{it.qty}</td>
            <td style={{textAlign:"right", padding:"10px", borderBottom:`var(--bw) solid var(--border)`}}>{it.totalFmt}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <section style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"var(--sp)", padding:"var(--sp)"}}>
      <div>
        {ctx.footer?.terms?.show ? (
          <>
            <div style={{fontWeight:700, color:"var(--acc)"}}>TERMS & CONDITIONS</div>
            <p style={{opacity:.9}}>{ctx.footer.terms.text}</p>
          </>
        ) : (
          <>
            <div style={{fontWeight:700, color:"var(--acc)"}}>{ctx.doc.type === "QUOTE" ? "QUOTE VALIDITY" : "TERMS & CONDITIONS"}</div>
            <p style={{opacity:.9}}>
              {ctx.doc.type === "QUOTE" 
                ? "This quote is valid for 30 days from the quote date." 
                : "Payment is due within 30 days of invoice date."}
            </p>
          </>
        )}
      </div>
      <div style={{background:"var(--surface)", border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", padding:"var(--sp)"}}>
        <Row label="Sub Total" value={ctx.totals.subTotalFmt}/>
        <Row label="Tax" value={ctx.totals.taxFmt}/>
        <Row label="Grand Total" value={ctx.totals.grandTotalFmt} strong accent />
      </div>
    </section>

    {/* New Footer Sections */}
    <footer style={{ display:"grid", gap:12, padding:"var(--sp)" }}>
      {ctx.footer?.notes?.show && (
        <section className="notes-block">
          <h4 style={{margin:"0 0 8px 0", fontWeight:700, color:"var(--acc)"}}>NOTES</h4>
          <p style={{margin:0, opacity:.9}}>{ctx.footer.notes.text}</p>
        </section>
      )}

      {ctx.footer?.payment?.show && ctx.footer.payment.items.length > 0 && (
        <section className="payment-block">
          <h4 style={{margin:"0 0 8px 0", fontWeight:700, color:"var(--acc)"}}>PAYMENT CONDITIONS</h4>
          <ul style={{margin:0, paddingLeft:20, opacity:.9}}>
            {ctx.footer.payment.items.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </section>
      )}
    </footer>
    
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