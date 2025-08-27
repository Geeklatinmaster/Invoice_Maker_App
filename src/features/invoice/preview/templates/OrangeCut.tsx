import { useInvoice } from "../../store/useInvoice";
import { ItemsTable, TotalsCard, FooterBar } from "../parts";

export default function OrangeCut(){
  const s = useInvoice();
  const iv = s.invoice;
  const profile = s.profiles.find(p=>p.id===s.selectedProfileId) ?? s.profiles[0];
  
  return (
    <section style={{background:"var(--bg)", color:"var(--txt)", fontFamily:"var(--body)",
      border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", overflow:"hidden"}}>
      <div style={{height:90, background:"linear-gradient(135deg,#ff7a18,#ffb800)",
        clipPath:"polygon(0 0, 100% 0, 100% 65%, 0 100%)", color:"#fff", display:"flex",
        alignItems:"flex-end", padding:"0 var(--sp) 10px", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:"var(--sp)"}}>
          {profile?.logo?.logoUrl && <img src={profile.logo.logoUrl} alt="logo" style={{height:"var(--logoH)", filter:"brightness(0) invert(1)"}}/>}
          <h1 style={{margin:0, color:"#fff", fontFamily:"var(--heading)", fontWeight:"var(--hW)"}}>{iv.docType ?? "INVOICE"}</h1>
        </div>
        <div style={{textAlign:"right"}}>
          <small>No: {iv.code ?? "0001"} • Date: {iv.issueDate ?? ""}</small>
        </div>
      </div>
      
      <div style={{padding:"var(--sp)"}}>
        <div style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:"var(--sp)", marginBottom:"var(--sp)"}}>
          <div>
            <div style={{padding:"var(--sp)", background:"var(--surface)", borderRadius:"var(--r)", border:`var(--bw) solid var(--border)`}}>
              <strong style={{color:"var(--acc)"}}>Invoice From:</strong><br/>
              <div style={{marginTop:8}}>
                <strong>{profile?.businessName}</strong><br/>
                {profile?.address}<br/>
                {profile?.email} • {profile?.phone}
              </div>
            </div>
          </div>
          <div>
            <div style={{padding:"var(--sp)", background:"var(--surface)", borderRadius:"var(--r)", border:`var(--bw) solid var(--border)`}}>
              <strong style={{color:"var(--acc)"}}>{iv.docType === "QUOTE" ? "Quote To:" : "Bill To:"}</strong><br/>
              <div style={{marginTop:8}}>
                {iv.customerName}<br/>
                {iv.customerAddress}
              </div>
            </div>
          </div>
        </div>
        
        <ItemsTable/>
        
        <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"var(--sp)", marginTop:"var(--sp)"}}>
          <div>
            <div style={{fontWeight:700, color:"var(--acc)"}}>{iv.docType === "QUOTE" ? "QUOTE CONDITIONS" : "PAYMENT CONDITIONS"}</div>
            <ul style={{margin:"8px 0", paddingLeft:"20px", fontSize:"14px"}}>
              {iv.docType === "QUOTE" ? (
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
              <li>All prices in {profile?.currency || 'USD'}</li>
            </ul>
          </div>
          <TotalsCard/>
        </div>
        <FooterBar />
      </div>
    </section>
  );
}