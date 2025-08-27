import { useInvoice } from "../../store/useInvoice";
import { ItemsTable, TotalsCard, FooterBar } from "../parts";

export default function YellowArc(){
  const s = useInvoice();
  const iv = s.invoice;
  const profile = s.profiles.find(p=>p.id===s.selectedProfileId) ?? s.profiles[0];
  
  return (
    <section style={{background:"var(--bg)", color:"var(--txt)", fontFamily:"var(--body)",
      border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", overflow:"hidden"}}>
      <div style={{position:"relative", padding:"36px var(--sp) var(--sp)", textAlign:"center"}}>
        <div style={{position:"absolute", inset:"-120px -60px auto -60px", height:240, borderRadius:"50%",
          background:"radial-gradient(circle at center, #ffd000, #ff9f00)", filter:"blur(8px)", opacity:.85}}/>
        <div style={{position:"relative", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{display:"flex", alignItems:"center", gap:"var(--sp)"}}>
            {profile?.logo?.logoUrl && <img src={profile.logo.logoUrl} alt="logo" style={{height:"var(--logoH)"}}/>}
            <div style={{textAlign:"left"}}>
              <h1 style={{margin:0, fontFamily:"var(--heading)", fontWeight:"var(--hW)"}}>{iv.docType ?? "INVOICE"}</h1>
              <div style={{fontSize:"14px", color:"var(--txtMuted)"}}>
                {profile?.businessName}
              </div>
            </div>
          </div>
          <div style={{textAlign:"right", background:"rgba(255,255,255,0.9)", padding:"var(--sp)", borderRadius:"var(--r)"}}>
            <div><strong>No:</strong> {iv.code ?? "0001"}</div>
            <div><strong>Date:</strong> {iv.issueDate ?? ""}</div>
          </div>
        </div>
      </div>
      
      <div style={{padding:"var(--sp)"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp)", marginBottom:"var(--sp)"}}>
          <div style={{padding:"var(--sp)", background:"var(--surface)", borderRadius:"var(--r)", 
            border:`var(--bw) solid var(--border)`, boxShadow:"0 2px 4px rgba(0,0,0,0.1)"}}>
            <strong style={{color:"var(--acc)"}}>Billed From:</strong><br/>
            <div style={{marginTop:8}}>
              <strong>{profile?.businessName}</strong><br/>
              {profile?.address}<br/>
              <small>{profile?.email}</small>
            </div>
          </div>
          <div style={{padding:"var(--sp)", background:"var(--surface)", borderRadius:"var(--r)", 
            border:`var(--bw) solid var(--border)`, boxShadow:"0 2px 4px rgba(0,0,0,0.1)"}}>
            <strong style={{color:"var(--acc)"}}>Billed To:</strong><br/>
            <div style={{marginTop:8}}>
              <strong>{iv.customerName}</strong><br/>
              {iv.customerAddress}<br/>
              {iv.customerEmail && <small>{iv.customerEmail}</small>}
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
              For any questions, please contact us at {profile?.email}.
            </div>
          </div>
          <TotalsCard/>
        </div>
        <FooterBar />
      </div>
    </section>
  );
}