import { useTheme } from "../../../../theme/useTheme";
import { ItemsTable, TotalsCard, FooterBar } from "../parts";
import type { TemplateVM } from "./types";

export default function NavyWave({ ctx }: { ctx: TemplateVM }){
  const wave = encodeURIComponent(`<svg width="1200" height="80" viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg"><path d="M0,40 C200,0 400,80 600,40 C800,0 1000,80 1200,40 L1200,80 L0,80 Z" fill="var(--bg)"/></svg>`);
  
  // Safety check - return early if context is not ready
  if (!ctx || !ctx.client || !ctx.company || !ctx.doc) {
    return <div>Loading...</div>;
  }
  
  return (
    <section style={{background:"var(--bg)", color:"var(--txt)", fontFamily:"var(--body)",
      border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", overflow:"hidden"}}>
      <div style={{background:"#0b1220", color:"#fff", padding:"calc(var(--sp)*1.25) var(--sp)"}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:12}}>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            {ctx.company.logoUrl && <img src={ctx.company.logoUrl} alt="logo" style={{height:"var(--logoH)"}}/>}
            <h1 style={{margin:0, fontFamily:"var(--heading)", fontWeight:"var(--hW)"}}>{ctx.doc.type ?? "INVOICE"}</h1>
          </div>
          <div style={{textAlign:"right"}}>
            <small>{ctx.doc.type ?? "Invoice"} No: {ctx.doc.code ?? "0001"}</small><br/>
            <small>Date: {ctx.doc.dateISO ?? ""}</small>
          </div>
        </div>
        <div style={{
          height:80, backgroundImage:`url("data:image/svg+xml;utf8,${wave}")`,
          backgroundRepeat:"repeat-x", backgroundPosition:"bottom center"}}/>
      </div>

      <div style={{padding:"var(--sp)"}}>
        <div style={{marginBottom:"var(--sp)", padding:"var(--sp)", background:"var(--surface)", borderRadius:"var(--r)"}}>
          <strong>{ctx.doc.type === "QUOTE" ? "Quote To:" : "Bill To:"}</strong><br/>
          {ctx.client.name}<br/>
          {ctx.client.address}
        </div>
        
        <ItemsTable/>
        
        <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"var(--sp)", marginTop:"var(--sp)"}}>
          <div>
            <div style={{fontWeight:700, color:"var(--acc)"}}>{ctx.doc.type === "QUOTE" ? "QUOTE VALIDITY" : "TERMS & CONDITIONS"}</div>
            <p style={{margin:"8px 0"}}>
              {ctx.doc.type === "QUOTE" 
                ? "This quote is valid for 30 days from the quote date." 
                : "Payment is due within 30 days of invoice date. Late payments may incur additional fees."}
            </p>
          </div>
          <TotalsCard/>
        </div>
        <FooterBar />
      </div>
    </section>
  );
}