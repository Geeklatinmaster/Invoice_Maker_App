import { useInvoice } from "@/features/invoice/store/useInvoice";
import { exportInvoicePdf } from "@/features/invoice/pdf/exportPdf";

export default function InvoiceForm() {
  const s = useInvoice();
  const iv = s.invoice;
  const profile = s.profiles.find(p=>p.id===s.selectedProfileId) ?? s.profiles[0];

  const validateUSA = () => {
    const errs:string[]=[];
    if(!profile?.businessName) errs.push("Business Name es obligatorio (perfil).");
    if(!iv.customerName) errs.push("Customer Name es obligatorio.");
    if(!iv.issueDate) errs.push("Issue Date es obligatorio.");
    if(iv.items.length===0) errs.push("Al menos 1 ítem.");
    if(errs.length){ alert(errs.join("\n")); return false; }
    return true;
  };

  const handleExportPdf = async () => {
    try {
      // Ensure totals are computed
      s.compute();
      
      // Prepare logo data URL if available
      let logoDataUrl: string | undefined;
      if (profile?.logoUrl) {
        try {
          const response = await fetch(profile.logoUrl);
          const blob = await response.blob();
          logoDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.warn("Failed to load logo for PDF:", e);
        }
      }
      
      // Export PDF
      await exportInvoicePdf(iv, {
        profile,
        totals: s.totals,
        logoDataUrl
      });
    } catch (error) {
      console.error("Failed to export PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  return (
    <section style={{display:"grid", gap:8}}>
      <div style={{display:"flex", gap:8, alignItems:"center"}}>
        <label>Doc:
          <select value={iv.docType} onChange={e=>s.setDocType(e.target.value as any)}>
            <option>INVOICE</option>
            <option>QUOTE</option>
          </select>
        </label>
        <span>Code: {iv.code} <button onClick={s.regenerateCode} title="Generate new code">🔄 Regenerate</button></span>
        <label>Issue Date: <input type="date" value={iv.issueDate} onChange={e=>s.patchInvoice({issueDate: e.target.value})}/></label>
      </div>

      <label>Customer Name: <input value={iv.customerName} onChange={e=>s.patchInvoice({customerName: e.target.value})}/></label>

      <div>
        <h4>Items</h4>
        {iv.items.map(it=>(
          <div key={it.id} style={{display:"grid", gridTemplateColumns:"1fr 2fr 80px 120px 80px 80px auto", gap:6, alignItems:"center"}}>
            <input placeholder="Title" value={it.title} onChange={e=>s.updateItem(it.id,{title:e.target.value})}/>
            <input placeholder="Description" value={it.description||""} onChange={e=>s.updateItem(it.id,{description:e.target.value})}/>
            <input type="number" placeholder="Qty" value={it.qty} onChange={e=>s.updateItem(it.id,{qty:+e.target.value})}/>
            <input type="number" placeholder="Unit $" value={it.unitPrice} onChange={e=>s.updateItem(it.id,{unitPrice:+e.target.value})}/>
            <input type="number" placeholder="Tax %" value={it.taxRate ?? ""} onChange={e=>s.updateItem(it.id,{taxRate:e.target.value===""?undefined:+e.target.value})}/>
            <input type="number" placeholder="Desc %" value={it.discount ?? ""} onChange={e=>s.updateItem(it.id,{discount:e.target.value===""?undefined:+e.target.value})}/>
            <button onClick={()=>s.removeItem(it.id)}>x</button>
          </div>
        ))}
        <button onClick={s.addItem}>+ Item</button>
      </div>

      <div style={{display:"flex", gap:8}}>
        <label>Discount global % <input type="number" value={iv.globalDiscount ?? 0} onChange={e=>s.setGlobalDiscount(+e.target.value)}/></label>
        <label>Tax global % <input type="number" value={iv.globalTaxRate ?? 0} onChange={e=>s.setGlobalTax(+e.target.value)}/></label>
        <label>Retención
          <select value={iv.retentionPreset} onChange={e=>s.setRetentionPreset(e.target.value as any)}>
            <option value="NO_AGENTE">No agente</option>
            <option value="AGENTE_RETENCION">Agente de Retención (2%)</option>
            <option value="NONE">Ninguna</option>
          </select>
        </label>
      </div>

      <div style={{display:"flex", gap:8}}>
        <button 
          onClick={handleExportPdf}
          disabled={iv.items.length === 0}
          title={iv.items.length === 0 ? "Add items to export PDF" : "Export as PDF"}
          style={{
            opacity: iv.items.length === 0 ? 0.5 : 1,
            cursor: iv.items.length === 0 ? "not-allowed" : "pointer"
          }}
        >
          📄 Export PDF
        </button>
        <button onClick={()=>{ if (validateUSA()) { s.compute(); window.open("/print.html","_blank"); } }}>Exportar PDF (print)</button>
        <button onClick={()=>{ alert(JSON.stringify(s.totals, null, 2)); }}>View Totals (Debug)</button>
      </div>
    </section>
  );
}
