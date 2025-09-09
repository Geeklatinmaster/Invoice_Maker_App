import { useAppStore } from '@/store/invoiceStore';
import { mapToTemplateProps } from '@/mappers/mapToTemplateProps';
import LiveCustomizer from '@/features/customizer/LiveCustomizer';

export default function InvoicePreviewPage() {
  const inv     = useAppStore(s => s.selectedInvoiceId ? s.invoices[s.selectedInvoiceId] : undefined);
  const client  = useAppStore(s => inv?.clientId ? s.clients[inv!.clientId] : undefined);
  const profile = useAppStore(s => inv?.brandProfileId ? s.brandProfiles[inv!.brandProfileId] : undefined);

  if (!inv || !client || !profile) {
    return <div className="p-8">Select an invoice in "Invoices" first.</div>;
  }

  const props = mapToTemplateProps(inv, profile, client.name);
  const payUrl = `https://pay.example.com/${inv.id}`; // stub

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 px-6 py-4">
      {/* Left: Preview */}
      <div className="flex-1 overflow-auto">
        <PreviewPaper {...props} />

        {/* Share actions SOLO aquí */}
        <div className="mt-4 flex flex-wrap gap-10">
          <button onClick={()=>sendEmail(inv.id)} className="btn">Enviar</button>
          <button onClick={()=>shareWhatsApp(payUrl)} className="btn">Compartir</button>
          <button onClick={()=>window.print()} className="btn">Descargar PDF</button>
        </div>
      </div>

      {/* Right: Customizer */}
      <div className="w-[420px] border-l pl-6">
        <LiveCustomizer />
      </div>
    </div>
  );
}

// —— Wrapper mínimo (si aún no conectas tu template "Liquid Glass" directamente)
function PreviewPaper(p:any){
  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 min-w-[820px]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{p.brandName}</h2>
          <div className="text-sm opacity-70">Bill To: {p.clientName}</div>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-70">{p.docType.toUpperCase()}</div>
          <div className="font-semibold">{p.code}</div>
          <div className="text-sm">{p.issueDate}{p.dueDate ? ` · Due ${p.dueDate}` : ''}</div>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr><th className="text-left">Item</th><th>Qty</th><th>Price</th><th className="text-right">Line</th></tr>
        </thead>
        <tbody>
          {p.items.map((it:any, i:number)=>(
            <tr key={i}>
              <td className="py-1">{it.title}</td>
              <td className="text-center">{it.qty}</td>
              <td className="text-center">{it.unitPrice.toFixed(2)}</td>
              <td className="text-right">{it.lineTotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 ml-auto w-64 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>{p.totals.subtotal.toFixed(2)}</span></div>
        {p.totals.discount>0 && <div className="flex justify-between"><span>Discount</span><span>-{p.totals.discount.toFixed(2)}</span></div>}
        {p.totals.tax>0 && <div className="flex justify-between"><span>Tax</span><span>{p.totals.tax.toFixed(2)}</span></div>}
        {p.totals.retention>0 && <div className="flex justify-between"><span>Retention</span><span>-{p.totals.retention.toFixed(2)}</span></div>}
        <div className="flex justify-between font-semibold border-t mt-2 pt-2">
          <span>Total</span><span>{p.totals.grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {p.notes && <div className="mt-6 text-sm"><strong>Notes:</strong> {p.notes}</div>}
      {p.legalText && <div className="mt-2 text-xs opacity-70">{p.legalText}</div>}
    </div>
  );
}

async function sendEmail(_id:string){ /* integrate provider later */ return true; }
function shareWhatsApp(url:string){ window.open(`https://wa.me/?text=${encodeURIComponent(url)}`,'_blank'); }