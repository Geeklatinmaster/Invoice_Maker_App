import { useInvoice } from "@/features/invoice/store/useInvoice";
import type { ShowOn } from "@/features/invoice/store/useInvoice";

const ShowOnSelect = ({ value, onChange }: { value: ShowOn; onChange: (v: ShowOn)=>void }) => (
  <select value={value} onChange={(e)=>onChange(e.target.value as ShowOn)}>
    <option value="BOTH">Both (Invoice & Quote)</option>
    <option value="INVOICE">Invoice only</option>
    <option value="QUOTE">Quote only</option>
  </select>
);

export default function FooterControls() {
  const s = useInvoice();
  const f = s.footerState;

  return (
    <div className="footer-controls" style={{ display:"grid", gap:12 }}>
      {/* NOTES */}
      <section style={{ border:"1px solid #e5e5e5", padding:12, borderRadius:8 }}>
        <header style={{display:"flex", gap:12, alignItems:"center"}}>
          <input type="checkbox" checked={f.notes.enabled}
                 onChange={(e)=>s.setFooterEnabled("notes", e.target.checked)} />
          <strong>Notes</strong>
          <span style={{marginLeft:"auto"}}>Show on:</span>
          <ShowOnSelect value={f.notes.showOn} onChange={(v)=>s.setFooterShowOn("notes", v)} />
        </header>
        <textarea
          rows={3}
          value={f.notes.text}
          onChange={(e)=>s.setFooterText("notes", e.target.value)}
          placeholder="Write a short note to your client…"
          style={{ width:"100%", marginTop:8 }}
        />
      </section>

      {/* TERMS */}
      <section style={{ border:"1px solid #e5e5e5", padding:12, borderRadius:8 }}>
        <header style={{display:"flex", gap:12, alignItems:"center"}}>
          <input type="checkbox" checked={f.terms.enabled}
                 onChange={(e)=>s.setFooterEnabled("terms", e.target.checked)} />
          <strong>Terms & Conditions</strong>
          <span style={{marginLeft:"auto"}}>Show on:</span>
          <ShowOnSelect value={f.terms.showOn} onChange={(v)=>s.setFooterShowOn("terms", v)} />
        </header>
        <textarea
          rows={3}
          value={f.terms.text}
          onChange={(e)=>s.setFooterText("terms", e.target.value)}
          placeholder="Payment terms, late fees, warranties…"
          style={{ width:"100%", marginTop:8 }}
        />
      </section>

      {/* PAYMENT CONDITIONS */}
      <section style={{ border:"1px solid #e5e5e5", padding:12, borderRadius:8 }}>
        <header style={{display:"flex", gap:12, alignItems:"center"}}>
          <input type="checkbox" checked={f.payment.enabled}
                 onChange={(e)=>s.setFooterEnabled("payment", e.target.checked)} />
          <strong>Payment Conditions</strong>
          <span style={{marginLeft:"auto"}}>Show on:</span>
          <ShowOnSelect value={f.payment.showOn} onChange={(v)=>s.setFooterShowOn("payment", v)} />
        </header>

        <ul style={{marginTop:8}}>
          {f.payment.items.map((t, i) => (
            <li key={i} style={{display:"flex", alignItems:"center", gap:8, marginBottom:6}}>
              <input
                style={{flex:1}}
                value={t}
                onChange={(e)=>s.updatePaymentCondition(i, e.target.value)}
              />
              <button type="button" onClick={()=>s.removePaymentCondition(i)}>✕</button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={()=>s.addPaymentCondition("New condition")}>+ Add condition</button>
      </section>
    </div>
  );
}