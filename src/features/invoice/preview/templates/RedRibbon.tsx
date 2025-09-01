import { ItemsTable, TotalsCard, FooterBar } from "../parts";
import type { TemplateVM } from "./types";

export default function RedRibbon({ ctx }: { ctx: TemplateVM }){
  
  // Safety check - return early if context is not ready
  if (!ctx || !ctx.client || !ctx.company || !ctx.doc) {
    return <div>Loading...</div>;
  }
  
  return (
    <section style={{background:"var(--bg)", color:"var(--txt)", fontFamily:"var(--body)",
      border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", overflow:"hidden"}}>
      <header style={{position:"relative", padding:"28px var(--sp) 20px"}}>
        <div style={{position:"absolute", inset:0, background:"linear-gradient(90deg,#ee2d2d,#ff5858)"}}/>
        <div style={{position:"relative", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{display:"flex", alignItems:"center", gap:"var(--sp)"}}>
            {ctx.company.logoUrl && <img src={ctx.company.logoUrl} alt="logo" style={{height:"var(--logoH)", filter:"brightness(0) invert(1)"}} onError={(e) => e.currentTarget.style.display = 'none'}/>}
            <h1 style={{margin:0, color:"#fff", fontFamily:"var(--heading)", fontWeight:"var(--hW)"}}>{ctx.doc.type ?? "INVOICE"}</h1>
          </div>
          <div style={{color:"#fff", textAlign:"right"}}>
            <div>{ctx.company.name}</div>
            <small>{ctx.company.email}</small>
          </div>
        </div>
        <div style={{position:"absolute", right:"var(--sp)", bottom:-18, background:"#111827", color:"#fff",
          borderRadius:10, padding:"6px 12px", fontSize:12, boxShadow:"0 6px 16px rgba(0,0,0,.25)"}}>
          No: {ctx.doc.code ?? "0001"} • Date: {ctx.doc.dateISO ?? ""}
        </div>
      </header>
      
      <div style={{padding:"var(--sp)", paddingTop:"calc(var(--sp) + 8px)"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp)", marginBottom:"var(--sp)"}}>
          <div style={{padding:"var(--sp)", background:"var(--surface)", borderRadius:"var(--r)"}}>
            <strong style={{color:"var(--acc)"}}>{ctx.doc.type === "QUOTE" ? "Quote To:" : "Bill To:"}</strong><br/>
            <div style={{marginTop:8}}>
              {ctx.client.name}<br/>
              {ctx.client.address}
            </div>
          </div>
          <div style={{padding:"var(--sp)", background:"var(--surface)", borderRadius:"var(--r)"}}>
            <strong style={{color:"var(--acc)"}}>From:</strong><br/>
            <div style={{marginTop:8}}>
              {ctx.company.name}<br/>
              {ctx.company.address}
            </div>
          </div>
        </div>
        
        <ItemsTable/>
        
        <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"var(--sp)", marginTop:"var(--sp)"}}>
          <div>
            <div style={{fontWeight:700, color:"var(--acc)"}}>{ctx.doc.type === "QUOTE" ? "QUOTE VALIDITY" : "PAYMENT TERMS"}</div>
            <p style={{margin:"8px 0", fontSize:"14px"}}>
              {ctx.doc.type === "QUOTE" 
                ? "This quote is valid for 30 days from the quote date." 
                : "Net 30 days. Payment due within 30 days of invoice date."}
            </p>
          </div>
          <TotalsCard/>
        </div>
        <FooterBar />
      </div>
    </section>
  );
}