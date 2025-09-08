import { GlassCard, InputGlass, ButtonPrimary, ClientLine } from "@/ui/components/glass";

export default function Clients(){
  const clients = [
    { name: "Geekatlantic LLC", email: "demo@email.com", invoices: 14, balance: "$445.00" },
    { name: "Acme Inc.",        email: "billing@acme.com", invoices: 8, balance: "$0.00" },
    { name: "John Doe",         email: "john@example.com",  invoices: 3, balance: "$120.00" },
    { name: "Sample Co.",       email: "ap@sample.co",      invoices: 5, balance: "$300.00" },
  ];
  return (
    <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-8 space-y-4">
        <GlassCard>
          <div className="flex flex-wrap items-center gap-3">
            <InputGlass placeholder="Search clients…" className="flex-1" />
            <ButtonPrimary>New Client</ButtonPrimary>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="grid grid-cols-12 px-2 py-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <div className="col-span-5">Client</div><div className="col-span-3">Email</div>
            <div className="col-span-2">Invoices</div><div className="col-span-2 text-right">Balance</div>
          </div>
          <div className="divide-y divide-white/20">
            {clients.map(c => <ClientLine key={c.email} {...c} />)}
          </div>
        </GlassCard>
      </div>

      <div className="xl:col-span-4 space-y-4">
        <GlassCard title="Client details">
          <div className="text-sm text-slate-600 dark:text-slate-400">Select a client to view details</div>
        </GlassCard>
      </div>
    </section>
  );
}