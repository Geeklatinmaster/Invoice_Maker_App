import { ItemsTable, TotalsCard, FooterBar } from "../parts";
import type { TemplateVM } from "./types";

export default function OrangeCut({ ctx }: { ctx: TemplateVM }){
  
  // Safety check - return early if context is not ready
  if (!ctx || !ctx.client || !ctx.company || !ctx.doc) {
    return <div>Loading...</div>;
  }
  
  return (
    <section style={{background:"var(--bg)", color:"var(--txt)", fontFamily:"var(--body)",
      border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", overflow:"hidden"}}>
      <div style={{height:90, background:"linear-gradient(135deg,#ff7a18,#ffb800)",
        clipPath:"polygon(0 0, 100% 0, 100% 65%, 0 100%)", color:"#fff", display:"flex",
        alignItems:"flex-end", padding:"0 var(--sp) 10px", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:"var(--sp)"}}>
          {ctx.company.logoUrl && <img src={ctx.company.logoUrl} alt="logo" style={{height:"var(--logoH)", filter:"brightness(0) invert(1)"}} onError={(e) => e.currentTarget.style.display = 'none'}/>}
          <h1 style={{margin:0, color:"#fff", fontFamily:"var(--heading)", fontWeight:"var(--hW)"}}>{ctx.doc.type ?? "INVOICE"}</h1>
        </div>
        <div style={{textAlign:"right"}}>
          <small>No: {ctx.doc.code ?? "0001"} • Date: {ctx.doc.dateISO ?? ""}</small>
        </div>
      </div>
      
      <div style={{padding:"var(--sp)"}}>
        <div style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:"var(--sp)", marginBottom:"var(--sp)"}}>
          <div>
            <div style={{padding:"var(--sp)", background:"var(--surface)", borderRadius:"var(--r)", border:`var(--bw) solid var(--border)`}}>
              <strong style={{color:"var(--acc)"}}>Invoice From:</strong><br/>
              <div style={{marginTop:8}}>
                <strong>{ctx.company.name}</strong><br/>
                {ctx.company.address}<br/>
                {ctx.company.email} • {ctx.company.phone}
              </div>
            </div>
          </div>
          <div>
            <div style={{padding:"var(--sp)", background:"var(--surface)", borderRadius:"var(--r)", border:`var(--bw) solid var(--border)`}}>
              <strong style={{color:"var(--acc)"}}>{ctx.doc.type === "QUOTE" ? "Quote To:" : "Bill To:"}</strong><br/>
              <div style={{marginTop:8}}>
                {ctx.client.name}<br/>
                {ctx.client.address}
              </div>
            </div>
          </div>
        </div>
        
        <ItemsTable/>
        
        <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"var(--sp)", marginTop:"var(--sp)"}}>
          <div>
            <div style={{fontWeight:700, color:"var(--acc)"}}>{ctx.doc.type === "QUOTE" ? "QUOTE CONDITIONS" : "PAYMENT CONDITIONS"}</div>
            <ul style={{margin:"8px 0", paddingLeft:"20px", fontSize:"14px"}}>
              {ctx.doc.type === "QUOTE" ? (
                <>
                  <li>Quote valid for 30 days</li>
                  <li>Subject to availability</li>
                </>
              ) : (
                <>
                  <li>Payment due within 30 days</li>
                  <li>Late fees may apply after due date</li>
                </>
              )}
              <li>All prices in {ctx.totals.currencyCode || 'USD'}</li>
            </ul>
          </div>
          <TotalsCard/>
        </div>
        <FooterBar />
      </div>
    </section>
  );
}