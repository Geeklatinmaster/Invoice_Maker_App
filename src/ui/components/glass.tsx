import React from "react";

/* Card translúcida */
export function GlassCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/30 bg-white/50 p-5 shadow-[0_10px_30px_rgba(2,8,23,0.08)] backdrop-blur-xl dark:bg-white/10 dark:border-white/15 glass-fallback">
      {title && <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>}
      {children}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
      {children}
    </label>
  );
}

export function InputGlass(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      className={`rounded-xl border border-white/30 bg-white/60 px-3 py-2 shadow-sm outline-none backdrop-blur-md
                  placeholder:text-slate-400 text-slate-900 dark:text-slate-100 dark:bg-white/10 dark:border-white/20 ${props.className||""}`} />
  );
}

export function SelectGlass({ options, defaultValue }:{ options:string[]; defaultValue?:string }) {
  return (
    <select defaultValue={defaultValue}
      className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 shadow-sm outline-none backdrop-blur-md
                 text-slate-900 dark:text-slate-100 dark:bg-white/10 dark:border-white/20">
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

export function ButtonPrimary({ children }:{ children:React.ReactNode }) {
  return <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 font-medium text-white shadow">{children}</button>;
}
export function ButtonGlass({ children }:{ children:React.ReactNode }) {
  return <button className="rounded-xl border border-white/30 bg-white/50 px-4 py-2 font-medium text-slate-800 shadow-sm backdrop-blur-md hover:bg-white/60 dark:text-slate-100 dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/15">{children}</button>;
}
export function ButtonGhost({ children }:{ children:React.ReactNode }) {
  return <button className="rounded-xl px-4 py-2 font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">{children}</button>;
}

export function Kpi({ title, value, sub, tone }:{ title:string; value:string; sub:string; tone:"indigo"|"amber"|"rose" }) {
  const map = {
    indigo: "from-indigo-500/20 to-indigo-300/10 text-indigo-900 dark:text-indigo-200",
    amber:  "from-amber-500/20  to-amber-300/10  text-amber-900  dark:text-amber-200",
    rose:   "from-rose-500/20   to-rose-300/10   text-rose-900   dark:text-rose-200",
  } as const;
  return (
    <div className={`rounded-2xl border border-white/30 bg-gradient-to-br p-4 backdrop-blur-md shadow-sm dark:border-white/15 ${map[tone]}`}>
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-2xl font-bold leading-tight">{value}</div>
      <div className="text-xs opacity-70">{sub}</div>
    </div>
  );
}

export function Chip({ children }:{ children:React.ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/40 px-3 py-1 text-xs text-slate-800 shadow-sm backdrop-blur-md dark:text-slate-100 dark:bg-white/10 dark:border-white/20">{children}</span>;
}

export function ModeSwitch({ mode, onToggle }:{ mode:"light"|"dark"; onToggle:()=>void }) {
  return (
    <button onClick={onToggle}
      className="rounded-2xl border border-white/30 bg-white/50 backdrop-blur-md px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-white/60 dark:text-slate-100 dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/15">
      {mode === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

export function NavTabs({ tabs, active, onChange }:{ tabs:string[]; active:string; onChange:(t:string)=>void }) {
  return (
    <nav className="flex gap-2">
      {tabs.map(t => (
        <button key={t} onClick={()=>onChange(t)}
          className={`select-none rounded-full border px-3 py-1 text-sm backdrop-blur-md transition ${
            t===active
            ? "border-white/40 bg-white/60 text-slate-900 shadow-sm dark:bg-white/15 dark:text-slate-100 dark:border-white/20"
            : "border-white/30 bg-white/30 text-slate-700 hover:bg-white/50 dark:text-slate-300 dark:bg-white/5 dark:hover:bg-white/10"}`}>
          {t}
        </button>
      ))}
    </nav>
  );
}

/* Bloques de lista y preview (compartidos) */
export function InvoicePreview() {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/60 p-4 backdrop-blur-md dark:bg-white/10 dark:border-white/20">
      <div className="flex items-center justify-between">
        <div className="font-medium text-slate-900 dark:text-slate-100">Geeklatinmaster LLC</div>
        <div className="text-xs text-slate-600 dark:text-slate-300">INV-202508-002</div>
      </div>
      <div className="mt-3 text-sm text-slate-800 dark:text-slate-200">
        <div className="flex justify-between py-1"><span>Service</span><span>USD 200</span></div>
        <div className="flex justify-between py-1"><span>prueba</span><span>USD 188</span></div>
        <div className="mt-2 border-t border-white/30 pt-2 flex justify-between font-semibold"><span>Total</span><span>USD 388</span></div>
      </div>
      <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">Footer style: minimal</div>
    </div>
  );
}

export function InvoiceLine({ id, client, date, amount, status }:{
  id:string; client:string; date:string; amount:string; status:"Paid"|"Pending"|"Overdue"
}) {
  const tone = status==="Paid"
    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
    : status==="Pending"
    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
    : "bg-rose-500/15 text-rose-700 dark:text-rose-300";
  return (
    <div className="grid grid-cols-12 items-center px-2 py-2 text-sm text-slate-800 dark:text-slate-200">
      <div className="col-span-3 font-mono text-slate-600 dark:text-slate-400">{id}</div>
      <div className="col-span-4">{client}</div>
      <div className="col-span-3 text-slate-600 dark:text-slate-400">{date}</div>
      <div className="col-span-2 flex items-center justify-end gap-2">
        <span className="font-medium">{amount}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs ${tone}`}>{status}</span>
      </div>
    </div>
  );
}

export function ClientLine({ name, email, invoices, balance }:{
  name:string; email:string; invoices:number; balance:string
}) {
  return (
    <div className="grid grid-cols-12 items-center px-2 py-2 text-sm text-slate-800 dark:text-slate-200">
      <div className="col-span-5 font-medium">{name}</div>
      <div className="col-span-3 text-slate-600 dark:text-slate-400">{email}</div>
      <div className="col-span-2">{invoices}</div>
      <div className="col-span-2 text-right font-medium">{balance}</div>
    </div>
  );
}