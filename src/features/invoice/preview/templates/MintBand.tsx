import { ItemsTable, TotalsCard, FooterBar } from "../parts";
import type { TemplateVM } from "./types";

export function MintBand({ ctx }: { ctx: TemplateVM }){
  
  // Safety check - return early if context is not ready
  if (!ctx || !ctx.client || !ctx.company || !ctx.doc) {
    return <div>Loading...</div>;
  }
  
  return <section style={{
    border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", overflow:"hidden",
    fontFamily:"var(--body)", color:"var(--txt)", background:"var(--bg)"
  }}>
    <div style={{height:64, background:"var(--acc)", display:"flex", alignItems:"center", padding:"0 var(--sp)", color:"white"}}>
      <h1 style={{margin:0, fontFamily:"var(--heading)", fontWeight:"var(--hW)"}}>{ctx.doc.type ?? "INVOICE"}</h1>
      <div style={{marginLeft:"auto", textAlign:"right"}}>
        <div>No: {ctx.doc.code ?? "0001"}</div>
        <div>Date: {ctx.doc.dateISO ?? ""}</div>
      </div>
    </div>
    <div style={{padding:"var(--sp)"}}>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp)", marginBottom:"var(--sp)"}}>
        <div>
          <strong>From:</strong><br/>
          {ctx.company.name}<br/>
          {ctx.company.address}
        </div>
        <div>
          <strong>To:</strong><br/>
          {ctx.client.name}<br/>
          {ctx.client.address}
        </div>
      </div>
      <ItemsTable/>
      <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"var(--sp)", marginTop:"var(--sp)"}}>
        <div>
          <div style={{fontWeight:700, color:"var(--acc)"}}>Terms</div>
          <p>Payment due within 30 days.</p>
        </div>
        <TotalsCard/>
      </div>
      <FooterBar />
    </div>
  </section>;
}
export default MintBand;