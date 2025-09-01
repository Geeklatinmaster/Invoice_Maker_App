import { ItemsTable, TotalsCard, FooterBar } from "../parts";
import type { TemplateVM } from "./types";

export default function RedBadge({ ctx }: { ctx: TemplateVM }){
  
  // Safety check - return early if context is not ready
  if (!ctx || !ctx.client || !ctx.company || !ctx.doc) {
    return <div>Loading...</div>;
  }
  
  return (
    <section style={{background:"var(--bg)", color:"var(--txt)", fontFamily:"var(--body)",
      border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", overflow:"hidden", position:"relative"}}>
      <div style={{position:"absolute", left:-40, top:24, transform:"rotate(-8deg)", zIndex:10}}>
        <div style={{background:"#d61f1f", color:"#fff", padding:"6px 24px", fontWeight:800,
          borderRadius:"6px", boxShadow:"0 6px 18px rgba(214,31,31,.35)"}}>{ctx.doc.type}</div>
      </div>
      
      <div style={{padding:"calc(var(--sp)*1.5) var(--sp) var(--sp) var(--sp)"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom:"var(--sp)"}}>
          <div style={{display:"flex", alignItems:"center", gap:"var(--sp)"}}>
            {ctx.company.logoUrl && <img src={ctx.company.logoUrl} alt="logo" style={{height:"var(--logoH)"}}/>}
            <div>
              <h2 style={{margin:0, fontFamily:"var(--heading)", fontWeight:"var(--hW)"}}>{ctx.company.name}</h2>
              <small>{ctx.company.address}</small>
            </div>
          </div>
          <div style={{textAlign:"right", background:"var(--surface)", padding:"var(--sp)", borderRadius:"var(--r)"}}>
            <div><strong>{ctx.doc.type ?? "Invoice"} No:</strong> {ctx.doc.code ?? "0001"}</div>
            <div><strong>Date:</strong> {ctx.doc.dateISO ?? ""}</div>
          </div>
        </div>

        <div style={{marginBottom:"var(--sp)", padding:"var(--sp)", 
          background:"var(--surface)", borderRadius:"var(--r)", border:`var(--bw) solid var(--border)`}}>
          <strong style={{color:"var(--acc)"}}>{ctx.doc.type === "QUOTE" ? "Quote To:" : "Bill To:"}</strong><br/>
          <div style={{marginTop:8}}>
            {ctx.client.name}<br/>
            {ctx.client.email && <><small>{ctx.client.email}</small><br/></>}
            {ctx.client.address}
          </div>
        </div>
        
        <ItemsTable/>
        
        <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"var(--sp)", marginTop:"var(--sp)"}}>
          <div>
            <div style={{fontWeight:700, color:"var(--acc)"}}>{ctx.doc.type === "QUOTE" ? "QUOTE VALIDITY" : "PAYMENT NOTES"}</div>
            <p style={{margin:"8px 0", fontSize:"14px", color:"var(--txtMuted)"}}>
              {ctx.doc.type === "QUOTE" 
                ? "This quote is valid for 30 days from the quote date." 
                : "Please make payment within 30 days. Thank you for your business!"}
            </p>
          </div>
          <TotalsCard/>
        </div>
        <FooterBar />
      </div>
    </section>
  );
}