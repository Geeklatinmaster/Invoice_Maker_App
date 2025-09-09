import { useAppStore } from '@/store/invoiceStore';

export default function LiveCustomizer(){
  const inv    = useAppStore(s => s.selectedInvoiceId ? s.invoices[s.selectedInvoiceId] : undefined);
  const update = useAppStore(s => s.updateCurrentInvoice);
  if(!inv) return <div className="p-4 text-gray-500">No invoice selected</div>;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Live Customizer</h3>

      <section>
        <div className="text-sm text-gray-600 space-y-1">
          <div>Code: {inv.code}</div>
          <div>Type: {inv.docType}</div>
        </div>
      </section>

      <label className="block">
        <span className="text-sm font-medium">Notes</span>
        <textarea
          className="w-full mt-1 p-2 border rounded"
          value={inv.notes ?? ''}
          onChange={e=>update({notes:e.target.value})}
          rows={3}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Legal Text</span>
        <textarea
          className="w-full mt-1 p-2 border rounded"
          value={inv.legalText ?? ''}
          onChange={e=>update({legalText:e.target.value})}
          rows={2}
        />
      </label>

      <section>
        <h4 className="font-medium">Totals Preview</h4>
        <div className="text-sm space-y-1">
          <div className="flex justify-between"><span>Subtotal:</span><span>${inv.totals.subtotal.toFixed(2)}</span></div>
          {inv.totals.discount>0 && <div className="flex justify-between text-orange-600"><span>Discount:</span><span>-${inv.totals.discount.toFixed(2)}</span></div>}
          {inv.totals.tax>0 && <div className="flex justify-between text-green-600"><span>Tax:</span><span>${inv.totals.tax.toFixed(2)}</span></div>}
          {inv.totals.retention>0 && <div className="flex justify-between text-red-600"><span>Retention:</span><span>-${inv.totals.retention.toFixed(2)}</span></div>}
          <div className="flex justify-between font-semibold border-t pt-1"><span>Total:</span><span>${inv.totals.grandTotal.toFixed(2)}</span></div>
        </div>
      </section>
    </div>
  );
}