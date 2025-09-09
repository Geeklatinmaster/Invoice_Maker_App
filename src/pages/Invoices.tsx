import { useState, useMemo, useEffect, useCallback } from 'react'
import { useClients } from '@/store/clients'
import { GlassCard, InputGlass, SelectGlass, ButtonPrimary, ButtonGlass, Chip } from "@/ui/components/glass";

// ===== Invoices Types & Utils =====
type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";
type Currency = "USD" | "EUR" | "VES";

type InvoiceItem = {
  id: string;
  name: string;
  description?: string;
  qty: number;
  unitPrice: number;
  taxRate?: number;      // 0..100
  discountRate?: number; // 0..100
};

type Invoice = {
  id: string;
  code: string;
  clientId: string;
  issueDate: string; // yyyy-mm-dd
  dueDate?: string;
  currency: Currency;
  status: InvoiceStatus;
  notes?: string;
  items: InvoiceItem[];
  globalDiscountRate?: number;
  globalTaxRate?: number;
};

const uid = (p = "id") => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`;
const today = () => new Date().toISOString().slice(0,10);
const fmt = (n: number, cur: Currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(n);

function calcItemTotals(it: InvoiceItem){
  const base = it.qty * it.unitPrice;
  const disc = it.discountRate ? base * (it.discountRate/100) : 0;
  const afterD = base - disc;
  const tax = it.taxRate ? afterD * (it.taxRate/100) : 0;
  return { base, disc, tax, total: afterD + tax };
}

function calcTotals(inv: Invoice){
  const agg = inv.items.reduce((acc, it) => {
    const r = calcItemTotals(it);
    acc.subtotal += it.qty * it.unitPrice;
    acc.discount += r.disc;
    acc.tax += r.tax;
    return acc;
  }, { subtotal: 0, discount: 0, tax: 0 });
  let after = agg.subtotal - agg.discount;
  if (inv.globalDiscountRate) { const g = after * (inv.globalDiscountRate/100); agg.discount += g; after -= g; }
  const taxGlobal = inv.globalTaxRate ? after * (inv.globalTaxRate/100) : 0;
  return { ...agg, tax: agg.tax + taxGlobal, total: after + taxGlobal };
}

// ===== Persistence Utils =====
const INVOICES_STORAGE_KEY = "invoices_v1";

const loadInvoices = (): Invoice[] => {
  try {
    const stored = localStorage.getItem(INVOICES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading invoices:', e);
    return [];
  }
};

const saveInvoices = (invoices: Invoice[]): void => {
  try {
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
  } catch (e) {
    console.error('Error saving invoices:', e);
  }
};

export default function Invoices(){
  const clients = useClients(s => s.clients)

  // Estado local de Invoices con persistencia
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const stored = loadInvoices();
    if (stored.length > 0) return stored;
    
    // Seed data si no hay nada guardado
    return [
      {
        id: uid("inv"), code: "INV-0023", clientId: "c1", currency: "USD", status: "Draft",
        issueDate: today(),
        items: [
          { id: uid("it"), name: "Service", qty: 1, unitPrice: 200 },
          { id: uid("it"), name: "prueba",  qty: 1, unitPrice: 188 },
        ],
        notes: "Thanks for your business!",
      },
      {
        id: uid("inv"), code: "INV-0022", clientId: "c2", currency: "USD", status: "Paid",
        issueDate: today(), items: [{ id: uid("it"), name: "Consulting", qty: 5, unitPrice: 500 }],
      },
      {
        id: uid("inv"), code: "INV-0021", clientId: "c3", currency: "USD", status: "Paid",
        issueDate: today(), items: [{ id: uid("it"), name: "Design", qty: 8, unitPrice: 100 }],
      },
      {
        id: uid("inv"), code: "INV-0020", clientId: "c4", currency: "USD", status: "Overdue",
        issueDate: today(), items: [{ id: uid("it"), name: "Maintenance", qty: 3, unitPrice: 100 }],
      },
    ];
  });
  
  const [selectedId, setSelectedId] = useState<string>(() => {
    const stored = loadInvoices();
    return stored.length > 0 ? stored[0]?.id ?? "" : invoices[0]?.id ?? "";
  });
  
  // Estados de persistencia
  const [dirty, setDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Filtros locales
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<InvoiceStatus | "All">("All");
  const [clientFilter, setClientFilter] = useState<string | "Any">("Any");

  // Lista derivada — sin setState en render
  const rows = useMemo(() => invoices.filter(i => (
    (status==="All" || i.status===status) &&
    (clientFilter==="Any" || i.clientId===clientFilter) &&
    (q.trim()==="" || i.code.toLowerCase().includes(q.toLowerCase()))
  )), [invoices, q, status, clientFilter]);

  const selected = useMemo(() => invoices.find(i=>i.id===selectedId) || null, [invoices, selectedId]);

  // Función para marcar como dirty
  const markDirty = useCallback(() => {
    if (!dirty) setDirty(true);
  }, [dirty]);

  // Función de guardado
  const saveInvoice = useCallback(async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simular delay de red
      saveInvoices(invoices);
      setDirty(false);
      setSaveMessage("Invoice saved ✅");
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (e) {
      console.error('Error saving:', e);
      setSaveMessage("Error saving ❌");
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [invoices, isSaving]);

  // Atajo Cmd/Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (dirty && !isSaving) {
          saveInvoice();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dirty, isSaving, saveInvoice]);

  // CRUD — con guardas para evitar loops y marcado dirty
  function createInvoice(clientId?: string){
    const code = `INV-${new Date().getFullYear()}-${String(invoices.length+1).padStart(4,'0')}`;
    const inv: Invoice = {
      id: uid("inv"), code, clientId: clientId || "c1",
      issueDate: today(), currency: "USD", status: "Draft",
      items: [{ id: uid("it"), name: "Item", qty:1, unitPrice:0 }]
    };
    setInvoices(p => [inv, ...p]);
    setSelectedId(inv.id);
    markDirty();
  }
  function updateInvoice(id: string, patch: Partial<Invoice>){
    setInvoices(p => p.map(i => i.id===id ? { ...i, ...patch } : i));
    markDirty();
  }
  function addItem(id: string, item?: Partial<InvoiceItem>){
    setInvoices(p => p.map(i => i.id===id ? { ...i, items: [...i.items, { id: uid("it"), name: "Item", qty:1, unitPrice:0, ...item }] } : i));
    markDirty();
  }
  function updateItem(id: string, itemId: string, patch: Partial<InvoiceItem>){
    setInvoices(p => p.map(i => i.id===id ? { ...i, items: i.items.map(it => it.id===itemId ? { ...it, ...patch } : it) } : i));
    markDirty();
  }
  function removeItem(id: string, itemId: string){
    setInvoices(p => p.map(i => i.id===id ? { ...i, items: i.items.filter(it => it.id!==itemId) } : i));
    markDirty();
  }
  function duplicateInvoice(id: string){
    const src = invoices.find(i=>i.id===id); if(!src) return;
    const copy: Invoice = { ...src, id: uid("inv"), code: src.code+" (copy)", status: "Draft", items: src.items.map(it => ({ ...it, id: uid("it") })) };
    setInvoices(p => [copy, ...p]);
    setSelectedId(copy.id);
    markDirty();
  }
  function deleteInvoice(id: string){
    setInvoices(p => p.filter(i=>i.id!==id));
    if (selectedId === id) {
      const next = invoices.find(i=>i.id!==id);
      if (next && next.id !== selectedId) setSelectedId(next.id);
    }
    markDirty();
  }
  const safeSelect = (id: string) => { if (id !== selectedId) setSelectedId(id); };

  return (
    <>
      {/* Sticky Header con Save Button */}
      <div className="sticky top-0 z-50 mb-6 rounded-2xl border border-white/20 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 dark:border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Invoice Manager
            </h2>
            {dirty && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={saveInvoice}
              disabled={!dirty || isSaving}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                !dirty || isSaving
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Save Message Notification */}
      {saveMessage && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2">
          <div className="rounded-lg bg-white px-4 py-3 shadow-lg border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{saveMessage}</p>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Izquierda: listado */}
      <div className="xl:col-span-6 space-y-4">
        <GlassCard>
          <div className="flex flex-wrap items-center gap-3">
            <InputGlass value={q} onChange={(e:any)=>setQ(e.target.value)} placeholder="Search invoices…" className="flex-1" />
            <SelectGlass options={["All","Draft","Sent","Paid","Overdue"]} value={status} onChange={(e:any)=>setStatus(e.target.value)} />
            <select className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 shadow-sm outline-none backdrop-blur-md text-slate-900 dark:text-slate-100 dark:bg-white/10 dark:border-white/20" value={clientFilter} onChange={(e:any)=>setClientFilter(e.target.value)}>
              <option value="Any">Any client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ButtonPrimary onClick={()=>createInvoice()}>New Invoice</ButtonPrimary>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="grid grid-cols-12 px-2 py-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <div className="col-span-3">Invoice</div>
            <div className="col-span-4">Client</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          <div className="divide-y divide-white/20">
            {rows.map((inv)=> {
              const client = clients.find(c => c.id === inv.clientId);
              const clientName = client?.name || '—';
              const totals = calcTotals(inv);
              const isSelected = inv.id === selectedId;
              const pill = inv.status==='Paid' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                : inv.status==='Sent' ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300'
                : inv.status==='Overdue' ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
              return (
                <button 
                  key={inv.id} 
                  onClick={()=>safeSelect(inv.id)} 
                  className={`grid grid-cols-12 items-center px-2 py-2 text-left text-sm text-slate-800 dark:text-slate-200 w-full ${isSelected ? 'bg-white/20 dark:bg-white/5' : 'hover:bg-white/10 dark:hover:bg-white/3'}`}
                >
                  <div className="col-span-3 font-mono text-slate-600 dark:text-slate-400">{inv.code}</div>
                  <div className="col-span-4">{clientName}</div>
                  <div className="col-span-3 text-slate-600 dark:text-slate-400">{inv.issueDate}</div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className="font-medium">{fmt(totals.total, inv.currency)}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${pill}`}>{inv.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Showing {rows.length} of {invoices.length}</span>
            <div className="flex gap-2"><ButtonGlass>Prev</ButtonGlass><ButtonGlass>Next</ButtonGlass></div>
          </div>
        </GlassCard>
      </div>

      {/* Derecha: preview/editor */}
      <div className="xl:col-span-6 space-y-4">
        <GlassCard title="Invoice Editor">
          {!selected ? (
            <div className="text-sm text-slate-600 dark:text-slate-400">Select an invoice to edit</div>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">
                  {clients.find(c => c.id === selected.clientId)?.name || '—'}
                </div>
                <div className="opacity-70">{selected.code}</div>
              </div>

              {/* Editable items */}
              <div className="mt-3 space-y-2 text-sm">
                <div className="grid grid-cols-12 gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-1">Qty</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-1">Tax%</div>
                  <div className="col-span-1">Disc%</div>
                  <div className="col-span-1">Total</div>
                  <div className="col-span-1"></div>
                </div>
                {selected.items.map(it => (
                  <div key={it.id} className="grid grid-cols-12 gap-1 items-center">
                    <input 
                      className="col-span-5 rounded-md border border-white/20 bg-white/40 px-2 py-1 text-xs dark:bg-white/5" 
                      value={it.name} 
                      onChange={(e:any)=>updateItem(selected.id, it.id, { name: e.target.value })} 
                    />
                    <input 
                      type="number" 
                      min={0} 
                      className="col-span-1 rounded-md border border-white/20 bg-white/40 px-1 py-1 text-xs dark:bg-white/5" 
                      value={it.qty} 
                      onChange={(e:any)=>updateItem(selected.id, it.id, { qty: Number(e.target.value) })} 
                    />
                    <input 
                      type="number" 
                      min={0} 
                      className="col-span-2 rounded-md border border-white/20 bg-white/40 px-1 py-1 text-xs dark:bg-white/5" 
                      value={it.unitPrice} 
                      onChange={(e:any)=>updateItem(selected.id, it.id, { unitPrice: Number(e.target.value) })} 
                    />
                    <input 
                      type="number" 
                      min={0} 
                      max={100}
                      className="col-span-1 rounded-md border border-white/20 bg-white/40 px-1 py-1 text-xs dark:bg-white/5" 
                      placeholder="0" 
                      value={it.taxRate ?? 0} 
                      onChange={(e:any)=>updateItem(selected.id, it.id, { taxRate: Number(e.target.value) })} 
                    />
                    <input 
                      type="number" 
                      min={0} 
                      max={100}
                      className="col-span-1 rounded-md border border-white/20 bg-white/40 px-1 py-1 text-xs dark:bg-white/5" 
                      placeholder="0" 
                      value={it.discountRate ?? 0} 
                      onChange={(e:any)=>updateItem(selected.id, it.id, { discountRate: Number(e.target.value) })} 
                    />
                    <div className="col-span-1 text-right text-xs font-mono">{fmt(it.qty * it.unitPrice, selected.currency)}</div>
                    <button 
                      className="col-span-1 text-center text-rose-500 hover:text-rose-700" 
                      onClick={()=>removeItem(selected.id, it.id)}
                      disabled={selected.items.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="pt-2">
                  <ButtonGlass onClick={()=>addItem(selected.id, { name: "New Item", qty:1, unitPrice:0 })}>
                    + Add Item
                  </ButtonGlass>
                </div>
              </div>

              {/* Global adjustments */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Global Discount %</span>
                  <input 
                    type="number" 
                    min={0}
                    max={100}
                    className="rounded-md border border-white/20 bg-white/40 px-2 py-1 text-xs dark:bg-white/5" 
                    value={selected.globalDiscountRate ?? 0} 
                    onChange={(e:any)=>updateInvoice(selected.id, { globalDiscountRate: Number(e.target.value) })} 
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Global Tax %</span>
                  <input 
                    type="number" 
                    min={0}
                    max={100}
                    className="rounded-md border border-white/20 bg-white/40 px-2 py-1 text-xs dark:bg-white/5" 
                    value={selected.globalTaxRate ?? 0} 
                    onChange={(e:any)=>updateInvoice(selected.id, { globalTaxRate: Number(e.target.value) })} 
                  />
                </label>
              </div>

              {/* Notes */}
              <div className="mt-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Notes</span>
                  <textarea 
                    className="rounded-md border border-white/20 bg-white/40 px-2 py-1 text-xs dark:bg-white/5 min-h-[60px]" 
                    value={selected.notes ?? ''} 
                    onChange={(e:any)=>updateInvoice(selected.id, { notes: e.target.value })} 
                    placeholder="Add notes..."
                  />
                </label>
              </div>

              {/* Totals */}
              {(() => {
                const t = calcTotals(selected);
                return (
                  <div className="mt-3 border-t border-white/20 pt-2 text-sm space-y-1">
                    <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">{fmt(t.subtotal, selected.currency)}</span></div>
                    {t.discount > 0 && <div className="flex justify-between text-orange-600 dark:text-orange-400"><span>Discount</span><span className="font-mono">-{fmt(t.discount, selected.currency)}</span></div>}
                    {t.tax > 0 && <div className="flex justify-between text-blue-600 dark:text-blue-400"><span>Tax</span><span className="font-mono">{fmt(t.tax, selected.currency)}</span></div>}
                    <div className="flex justify-between font-semibold text-base border-t border-white/20 pt-1">
                      <span>Total</span>
                      <span className="font-mono">{fmt(t.total, selected.currency)}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonGlass onClick={()=>updateInvoice(selected.id, { status: selected.status==='Draft' ? 'Sent' : selected.status==='Sent' ? 'Paid' : 'Draft' })}>
                  {selected.status==='Draft' ? 'Mark as Sent' : selected.status==='Sent' ? 'Mark as Paid' : 'Mark as Draft'}
                </ButtonGlass>
                <ButtonGlass onClick={()=>duplicateInvoice(selected.id)}>Duplicate</ButtonGlass>
                <ButtonGlass onClick={()=>window.print()}>Export PDF</ButtonGlass>
                <ButtonGlass onClick={()=>{
                  const totals = calcTotals(selected);
                  const message = `${selected.code} Total ${fmt(totals.total, selected.currency)}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`,'_blank');
                }}>WhatsApp</ButtonGlass>
                <ButtonGlass onClick={()=>alert('Stripe Link integration - coming soon!')}>Stripe Link</ButtonGlass>
                <ButtonGlass onClick={()=>deleteInvoice(selected.id)}>Delete</ButtonGlass>
              </div>
            </>
          )}
        </GlassCard>

        <GlassCard title="Filters">
          <div className="flex flex-wrap gap-2">
            <Chip>Query: {q||"—"}</Chip>
            <Chip>Status: {status}</Chip>
            <Chip>Client: {clientFilter==="Any" ? "Any" : (clients.find(c => c.id === clientFilter)?.name || '—')}</Chip>
          </div>
        </GlassCard>
      </div>
    </section>
    </>
  );
}