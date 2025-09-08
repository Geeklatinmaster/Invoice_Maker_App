import { useSelectedClient } from '@/store/clients'
import { GlassCard, InputGlass, SelectGlass, ButtonPrimary, ButtonGlass, InvoicePreview, InvoiceLine, Chip } from "@/ui/components/glass";

export default function Invoices(){
  const selected = useSelectedClient()
  const rows = [
    { id: "INV-0023", client: "Geekatlantic LLC", date: "Sep 05, 2025", amount: "$445.00", status: "Pending" as const },
    { id: "INV-0022", client: "Acme Inc.",        date: "Sep 04, 2025", amount: "$2,500.00", status: "Paid"    as const },
    { id: "INV-0021", client: "John Doe",         date: "Sep 03, 2025", amount: "$800.00",   status: "Paid"    as const },
    { id: "INV-0020", client: "Sample Co.",       date: "Aug 29, 2025", amount: "$300.00",   status: "Overdue" as const },
  ];
  return (
    <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-8 space-y-4">
        <GlassCard>
          <div className="flex flex-wrap items-center gap-3">
            <InputGlass placeholder="Search invoices…" className="flex-1" />
            <SelectGlass options={["All","Paid","Pending","Overdue"]} defaultValue="All" />
            <ButtonPrimary>New Invoice</ButtonPrimary>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="grid grid-cols-12 px-2 py-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <div className="col-span-3">Invoice</div><div className="col-span-4">Client</div>
            <div className="col-span-3">Date</div><div className="col-span-2 text-right">Amount</div>
          </div>
          <div className="divide-y divide-white/20">{rows.map(r => <InvoiceLine key={r.id} {...r} />)}</div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Showing 1–4 of 24</span><div className="flex gap-2"><ButtonGlass>Prev</ButtonGlass><ButtonGlass>Next</ButtonGlass></div>
          </div>
        </GlassCard>
      </div>

      <div className="xl:col-span-4 space-y-4">
        <GlassCard title="Preview"><InvoicePreview customerName={selected?.name} /><div className="mt-4 flex gap-2"><ButtonGlass>Edit</ButtonGlass><ButtonGlass>Duplicate</ButtonGlass><ButtonPrimary>Export PDF</ButtonPrimary></div></GlassCard>
        <GlassCard title="Filters"><div className="flex flex-wrap gap-2"><Chip>Last 30 days</Chip><Chip>Status: Pending</Chip><Chip>{selected ? `Client: ${selected.name}` : "Client: Any"}</Chip></div></GlassCard>
      </div>
    </section>
  );
}