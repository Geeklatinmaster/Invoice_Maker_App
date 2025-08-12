import { useInvoice } from "../store/useInvoice";

export default function InvoiceForm() {
  const s = useInvoice();
  const iv = s.invoice;

  return (
    <section style={{display:"grid", gap:8}}>
      <label>Customer Name:
        <input value={iv.customerName} onChange={e=>s.patchInvoice({customerName:e.target.value})}/>
      </label>

      <div>
        <h4>Items</h4>
        {iv.items.map(it=>(
          <div key={it.id} style={{display:"grid", gridTemplateColumns:"1fr 80px 120px auto", gap:6}}>
            <input placeholder="Title" value={it.title} onChange={e=>s.updateItem(it.id,{title:e.target.value})}/>
            <input type="number" placeholder="Qty" value={it.qty} onChange={e=>s.updateItem(it.id,{qty:+e.target.value})}/>
            <input type="number" placeholder="Unit" value={it.unitPrice} onChange={e=>s.updateItem(it.id,{unitPrice:+e.target.value})}/>
            <button onClick={()=>s.removeItem(it.id)}>x</button>
          </div>
        ))}
        <button onClick={s.addItem}>+ Item</button>
      </div>

      <div style={{display:"flex", gap:8}}>
        <label>Discount % <input type="number" value={iv.globalDiscount ?? 0} onChange={e=>s.patchInvoice({globalDiscount:+e.target.value})}/></label>
        <label>Tax % <input type="number" value={iv.globalTaxRate ?? 0} onChange={e=>s.patchInvoice({globalTaxRate:+e.target.value})}/></label>
      </div>

      
    </section>
  );
}
