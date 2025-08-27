import { useInvoice } from "../../store/useInvoice";
import { ItemsTable, TotalsCard, FooterBar } from "../parts";

export default function RedBadge(){
  const s = useInvoice(); 
  const iv = s.invoice;
  const profile = s.profiles.find(p=>p.id===s.selectedProfileId) ?? s.profiles[0];
  
  return (
    <section style={{background:"var(--bg)", color:"var(--txt)", fontFamily:"var(--body)",
      border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", overflow:"hidden", position:"relative"}}>
      <div style={{position:"absolute", left:-40, top:24, transform:"rotate(-8deg)", zIndex:10}}>
        <div style={{background:"#d61f1f", color:"#fff", padding:"6px 24px", fontWeight:800,
          borderRadius:"6px", boxShadow:"0 6px 18px rgba(214,31,31,.35)"}}>{iv.docType ?? "INVOICE"}</div>
      </div>
      
      <div style={{padding:"calc(var(--sp)*1.5) var(--sp) var(--sp) var(--sp)"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom:"var(--sp)"}}>
          <div style={{display:"flex", alignItems:"center", gap:"var(--sp)"}}>
            {profile?.logo?.logoUrl && <img src={profile.logo.logoUrl} alt="logo" style={{height:"var(--logoH)"}}/>}
            <div>
              <h2 style={{margin:0, fontFamily:"var(--heading)", fontWeight:"var(--hW)"}}>{profile?.businessName}</h2>
              <small>{profile?.address}</small>
            </div>
          </div>
          <div style={{textAlign:"right", background:"var(--surface)", padding:"var(--sp)", borderRadius:"var(--r)"}}>
            <div><strong>{iv.docType ?? "Invoice"} No:</strong> {iv.code ?? "0001"}</div>
            <div><strong>Date:</strong> {iv.issueDate ?? ""}</div>
          </div>
        </div>

        <div style={{marginBottom:"var(--sp)", padding:"var(--sp)", 
          background:"var(--surface)", borderRadius:"var(--r)", border:`var(--bw) solid var(--border)`}}>
          <strong style={{color:"var(--acc)"}}>Bill To:</strong><br/>
          <div style={{marginTop:8}}>
            {iv.customerName}<br/>
            {iv.customerEmail && <><small>{iv.customerEmail}</small><br/></>}
            {iv.customerAddress}
          </div>
        </div>
        
        <ItemsTable/>
        
        <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:"var(--sp)", marginTop:"var(--sp)"}}>
          <div>
            <div style={{fontWeight:700, color:"var(--acc)"}}>PAYMENT NOTES</div>
            <p style={{margin:"8px 0", fontSize:"14px", color:"var(--txtMuted)"}}>
              Please make payment within 30 days. Thank you for your business!
            </p>
          </div>
          <TotalsCard/>
        </div>
        <FooterBar />
      </div>
    </section>
  );
}