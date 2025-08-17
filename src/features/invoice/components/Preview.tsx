import { useInvoice } from "@/features/invoice/store/useInvoice";
import Footer from "./Footers";
import { fmtCurrency } from "../lib/format";

export default function Preview() {
  const s = useInvoice();
  const iv = s.invoice;
  const profile = s.profiles.find(p=>p.id===s.selectedProfileId) ?? s.profiles[0];

  return (
    <section style={{border:"1px solid #ddd", padding:12}}>
      <h3>{profile.businessName}</h3>
      <p>{iv.docType} • {iv.code}</p>
      <p>Customer: {iv.customerName || "(sin nombre)"}</p>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead><tr><th align="left">Item</th><th>Qty</th><th>Unit</th><th align="right">Amount</th></tr></thead>
        <tbody>
          {iv.items.map(it=>(
            <tr key={it.id}>
              <td>{it.title}</td>
              <td align="center">{it.qty}</td>
              <td align="center">{fmtCurrency(it.unitPrice, profile.currency, profile.locale)}</td>
              <td align="right">{fmtCurrency(it.qty*it.unitPrice, profile.currency, profile.locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr/>
      <p>Totals (recalc antes de exportar): {fmtCurrency(s.totals.total, profile.currency, profile.locale)}</p>
      <div style={{marginTop:12, fontSize:12, color:"#444"}}>
        <Footer id={iv.footerId}/>
      </div>
    </section>
  );
}
