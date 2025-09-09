import { useCallback } from 'react'
import { useClients, useSelectedClient } from '@/store/clients'
import { GlassCard, Field, InputGlass, SelectGlass, ButtonPrimary, ButtonGlass, ButtonGhost, Kpi, Chip, InvoicePreview } from "@/ui/components/glass";

export default function Dashboard(){
  const clients = useClients(s => s.clients)
  const selectedClientId = useClients(s => s.selectedClientId)
  const selectClient = useClients(s => s.selectClient)
  const selected = useSelectedClient()
  
  // Static KPI data for demo
  const kpiData = {
    totalPaid: "$9,250",
    pendingCount: 12,
    overdueCount: 3
  }

  const handleClientChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value
    const match = clients.find(c => c.name === name)
    if (match) selectClient(match.id)
  }, [clients, selectClient])
  
  const handleNewInvoice = useCallback(() => {
    window.dispatchEvent(new CustomEvent('navigate-to-invoices'))
  }, [])

  return (
    <>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* LEFT: FORM */}
        <div className="xl:col-span-5 space-y-6">
          <GlassCard title="Live Customizer">
            <div className="grid grid-cols-1 gap-4">
              <Field label="Brand name"><InputGlass placeholder="JEGS" defaultValue="JEGS" /></Field>
              <Field label="Logo">
                <div className="flex gap-3">
                  <InputGlass placeholder="https://logo.png" className="flex-1" />
                  <ButtonGlass>Change</ButtonGlass>
                </div>
              </Field>
              <Field label="Customer">
                <SelectGlass
                  options={clients.map(c=>c.name)}
                  value={selected?.name}
                  onChange={handleClientChange}
                />
              </Field>
              <Field label="Template"><SelectGlass options={["Modern","Minimal","Bento"]} defaultValue="Modern" /></Field>
              <Field label="Issue Date"><InputGlass type="date" defaultValue="2025-08-14" /></Field>
            </div>
            <div className="mt-5 flex gap-3">
              <ButtonPrimary onClick={handleNewInvoice}>New Invoice</ButtonPrimary>
              <ButtonGlass>Save Template</ButtonGlass>
              <ButtonGhost>Import</ButtonGhost>
            </div>
          </GlassCard>

          <div className="grid grid-cols-3 gap-4">
            <Kpi tone="indigo" title="Total" value={kpiData.totalPaid} sub="Paid" />
            <Kpi tone="amber" title="Pending" value={kpiData.pendingCount.toString()} sub="Invoices" />
            <Kpi tone="rose"  title="Overdue" value={kpiData.overdueCount.toString()}  sub="Review" />
          </div>
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="xl:col-span-7">
          <GlassCard title="Preview"><InvoicePreview customerName={selected?.name} /></GlassCard>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard title="Shortcuts"><div className="flex flex-wrap gap-2"><Chip>Export PDF</Chip><Chip>Send via WhatsApp</Chip><Chip>Stripe Link</Chip><Chip>Duplicate</Chip></div></GlassCard>
            <GlassCard title="Tips"><p className="text-sm text-slate-700 dark:text-slate-300">Enable automatic reminders to reduce overdue invoices by up to 30%.</p></GlassCard>
          </div>
        </div>
      </section>

      {/* Extras de dashboard */}
      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard title="Invoices (list view)">
          <div className="text-sm text-slate-600 dark:text-slate-400">Recent invoices overview</div>
        </GlassCard>
        <GlassCard title="Clients">
          <div className="text-sm text-slate-600 dark:text-slate-400">Top clients summary</div>
        </GlassCard>
      </section>
    </>
  );
}