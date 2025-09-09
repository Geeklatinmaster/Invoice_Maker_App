import { useState } from 'react'
import { useClients, useSelectedClient, type Client } from '@/store/clients'
import { useActiveBrand } from '@/store/brands'
import { GlassCard, Field, InputGlass, ButtonPrimary, ButtonGlass } from '@/ui/components/glass'
import { formatMoney } from '@/lib/format'

function ClientLine({ c, active, onClick, currency = 'USD' }: { c: Client; active: boolean; onClick: () => void; currency?: string }){
  return (
    <button onClick={onClick} className={`grid grid-cols-12 items-center px-2 py-2 text-left text-sm text-slate-800 dark:text-slate-200 w-full ${active ? 'bg-white/20 dark:bg-white/5' : ''}`}>
      <div className="col-span-5 font-medium">{c.name}</div>
      <div className="col-span-3 text-slate-600 dark:text-slate-400">{c.email}</div>
      <div className="col-span-2">{c.invoices ?? 0}</div>
      <div className="col-span-2 text-right font-medium">{formatMoney(c.balance ?? 0, currency)}</div>
    </button>
  )
}

function ClientDetails({ c }:{ c: Client }){
  const updateClient = useClients(s => s.updateClient)
  const activeBrand = useActiveBrand()
  
  const handleNewInvoice = () => {
    // Navigate to Invoices tab - using custom event to communicate with parent
    window.dispatchEvent(new CustomEvent('navigate-to-invoices'))
  }
  
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
      <div className="text-lg font-semibold">{c.name}</div>
      <div className="text-sm opacity-80">{c.email}</div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-white/20 bg-white/10 p-3"><div className="opacity-70">Invoices</div><div className="text-xl font-bold">{c.invoices ?? 0}</div></div>
        <div className="rounded-xl border border-white/20 bg-white/10 p-3"><div className="opacity-70">Balance</div><div className="text-xl font-bold">{formatMoney(c.balance ?? 0, activeBrand?.currency || 'USD')}</div></div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Field label="Phone"><InputGlass value={c.phone ?? ''} onChange={e=>updateClient(c.id,{ phone:(e.target as HTMLInputElement).value })} /></Field>
        <Field label="Tax ID"><InputGlass value={c.taxId ?? ''} onChange={e=>updateClient(c.id,{ taxId:(e.target as HTMLInputElement).value })} /></Field>
        <Field label="Address"><InputGlass value={c.address ?? ''} onChange={e=>updateClient(c.id,{ address:(e.target as HTMLInputElement).value })} /></Field>
        <Field label="Notes"><InputGlass value={c.notes ?? ''} onChange={e=>updateClient(c.id,{ notes:(e.target as HTMLInputElement).value })} /></Field>
      </div>
      <div className="mt-4 flex gap-2">
        <ButtonGlass onClick={handleNewInvoice}>New Invoice</ButtonGlass>
        <ButtonGlass>Message</ButtonGlass>
      </div>
    </div>
  )
}

function NewClientModal({ onClose }:{ onClose: ()=>void }){
  const addClient = useClients(s => s.addClient)
  const selectClient = useClients(s => s.selectClient)
  const [form, setForm] = useState<{name:string; email:string; phone?:string; taxId?:string; address?:string; notes?:string}>({ name:'', email:'' })

  function submit(){
    if(!form.name || !form.email) return
    const id = addClient({ ...form })
    selectClient(id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-3xl border border-white/20 bg-white/60 backdrop-blur-xl p-5 dark:bg-white/10 dark:border-white/20">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">New Client</h3>
          <button onClick={onClose} className="rounded-full px-3 py-1 text-sm border border-white/30 bg-white/40 dark:bg-white/10">Close</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name"><InputGlass value={form.name}  onChange={e=>setForm(f=>({ ...f, name:(e.target as HTMLInputElement).value }))} /></Field>
          <Field label="Email"><InputGlass value={form.email} onChange={e=>setForm(f=>({ ...f, email:(e.target as HTMLInputElement).value }))} /></Field>
          <Field label="Phone"><InputGlass value={form.phone||''} onChange={e=>setForm(f=>({ ...f, phone:(e.target as HTMLInputElement).value }))} /></Field>
          <Field label="Tax ID"><InputGlass value={form.taxId||''} onChange={e=>setForm(f=>({ ...f, taxId:(e.target as HTMLInputElement).value }))} /></Field>
          <div className="col-span-2"><Field label="Address"><InputGlass value={form.address||''} onChange={e=>setForm(f=>({ ...f, address:(e.target as HTMLInputElement).value }))} /></Field></div>
          <div className="col-span-2"><Field label="Notes"><InputGlass value={form.notes||''} onChange={e=>setForm(f=>({ ...f, notes:(e.target as HTMLInputElement).value }))} /></Field></div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <ButtonGlass onClick={onClose}>Cancel</ButtonGlass>
          <ButtonPrimary onClick={submit}>Add Client</ButtonPrimary>
        </div>
      </div>
    </div>
  )
}

export default function Clients(){
  const clients = useClients(s => s.clients)
  const selectedClientId = useClients(s => s.selectedClientId)
  const selectClient = useClients(s => s.selectClient)
  const selected = useSelectedClient()
  const activeBrand = useActiveBrand()
  const [open, setOpen] = useState(false)

  return (
    <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-8 space-y-4">
        <GlassCard>
          <div className="flex flex-wrap items-center gap-3">
            <InputGlass placeholder="Search clients…" className="flex-1" />
            <ButtonPrimary onClick={()=>setOpen(true)}>New Client</ButtonPrimary>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="grid grid-cols-12 px-2 py-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <div className="col-span-5">Client</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Invoices</div>
            <div className="col-span-2 text-right">Balance</div>
          </div>
          <div className="divide-y divide-white/20">
            {clients.map((c)=> (
              <ClientLine key={c.id} c={c} active={c.id===selectedClientId} onClick={()=>selectClient(c.id)} currency={activeBrand?.currency || 'USD'} />
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="xl:col-span-4 space-y-4">
        <GlassCard title="Client details">
          {selected ? (
            <ClientDetails c={selected} />
          ) : (
            <div className="text-sm text-slate-600 dark:text-slate-400">Select a client to view details.</div>
          )}
        </GlassCard>
      </div>

      {open && <NewClientModal onClose={()=>setOpen(false)} />}
    </section>
  )
}