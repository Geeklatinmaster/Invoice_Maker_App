import { GlassCard, Field, InputGlass, SelectGlass, ButtonPrimary, ButtonGlass, ButtonGhost, Kpi, Chip, InvoicePreview } from "@/ui/components/glass";

export default function Dashboard(){
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
              <Field label="Customer"><InputGlass placeholder="John Doe" defaultValue="John Doe" /></Field>
              <Field label="Template"><SelectGlass options={["Modern","Minimal","Bento"]} defaultValue="Modern" /></Field>
              <Field label="Issue Date"><InputGlass type="date" defaultValue="2025-08-14" /></Field>
            </div>
            <div className="mt-5 flex gap-3">
              <ButtonPrimary>Save</ButtonPrimary><ButtonGlass>New</ButtonGlass><ButtonGhost>Import</ButtonGhost>
            </div>
          </GlassCard>

          <div className="grid grid-cols-3 gap-4">
            <Kpi tone="indigo" title="Total" value="$9,250" sub="Paid" />
            <Kpi tone="amber" title="Pending" value="12" sub="Invoices" />
            <Kpi tone="rose"  title="Overdue" value="3"  sub="Review" />
          </div>
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="xl:col-span-7">
          <GlassCard title="Preview"><InvoicePreview /></GlassCard>
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