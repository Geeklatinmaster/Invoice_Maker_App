import { ItemsTable, TotalsCard, FooterBar } from "../parts";
import type { TemplateVM } from "./types";

export default function YellowArc({ ctx }: { ctx: TemplateVM }){
  
  // Safety check - return early if context is not ready
  if (!ctx || !ctx.client || !ctx.company || !ctx.doc) {
    return <div>Loading...</div>;
  }
  
  return (
    <section style={{background:"var(--bg)", color:"var(--txt)", fontFamily:"var(--body)",
      border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", overflow:"hidden"}}>
      <div style={{position:"relative", padding:"36px var(--sp) var(--sp)", textAlign:"center"}}>
        <div style={{position:"absolute", inset:"-120px -60px auto -60px", height:240, borderRadius:"50%",
          background:"radial-gradient(circle at center, #ffd000, #ff9f00)", filter:"blur(8px)", opacity:.85}}/>
        <div style={{position:"relative", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{display:"flex", alignItems:"center", gap:"var(--sp)"}}>
            {ctx.company.logoUrl && <img src={ctx.company.logoUrl} alt="logo" style={{height:"var(--logoH)"}}/>}
            <div style={{textAlign:"left"}}>
              <h1 style={{margin:0, fontFamily:"var(--heading)", fontWeight:"var(--hW)"}}>{ctx.doc.type ?? "INVOICE"}</h1>
              <div style={{fontSize:"14px", color:"var(--txtMuted)"}}>
                {ctx.company.name}
              </div>
            </div>
          </div>
          <div style={{textAlign:"right", background:"rgba(255,255,255,0.9)", padding:"var(--sp)", borderRadius:"var(--r)"}}>
            <div><strong>No:</strong> {ctx.doc.code ?? "0001"}</div>
            <div><strong>Date:</strong> {ctx.doc.dateISO ?? ""}</div>
          </div>
        </div>
      </div>
      
      <div style={{padding:"var(--sp)"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp)", marginBottom:"var(--sp)"}}>
          <div style={{padding:"var(--sp)", background:"var(--surface)", borderRadius:"var(--r)", 
            border:`var(--bw) solid var(--border)`, boxShadow:"0 2px 4px rgba(0,0,0,0.1)"}}>
            <strong style={{color:"var(--acc)"}}>Billed From:</strong><br/>
            <div style={{marginTop:8}}>
              <strong>{ctx.company.name}</strong><br/>
              {ctx.company.address}<br/>
              <small>{ctx.company.email}</small>
            </div>
          </div>
          <div style={{padding:"var(--sp)", background:"var(--surface)", borderRadius:"var(--r)", 
            border:`var(--bw) solid var(--border)`, boxShadow:"0 2px 4px rgba(0,0,0,0.1)"}}>
            <strong style={{color:"var(--acc)"}}>{ctx.doc.type === "QUOTE" ? "Quote To:" : "Billed To:"}</strong><br/>
            <div style={{marginTop:8}}>
              <strong>{ctx.client.name}</strong><br/>
              {ctx.client.address}<br/>
              {ctx.client.email && <small>{ctx.client.email}</small>}
            </div>
          </div>
        </div>
        
        <ItemsTable/>
        
        <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"var(--sp)", marginTop:"var(--sp)"}}>
          <div>
            <div style={{fontWeight:700, color:"var(--acc)"}}>NOTES</div>
            <div style={{margin:"8px 0", padding:"var(--sp)", background:"var(--surface)", borderRadius:"var(--r)", 
              border:`var(--bw) solid var(--border)`, fontSize:"14px"}}>
              Thank you for choosing our services. Payment is due within 30 days of invoice date.
              For any questions, please contact us at {ctx.company.email}.
            </div>
          </div>
          <TotalsCard/>
        </div>
        <FooterBar />
      </div>
    </section>
  );
}