import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInvoice } from "@/features/invoice/store/useInvoice";
import { GlassCard, SelectGlass, ButtonPrimary, Kpi, Chip } from "@/ui/components/glass";
import { Filters, filterDocs, kpis, statusBreakdown, byMonth, recentInvoices, recentClients, InvoiceLike, computeStatus } from "./analytics";
import { money } from "@/lib/format";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { initializeSampleData } from "./sample-data";

// Load invoices from localStorage (same storage key as Invoices page)
function loadInvoices() {
  try {
    const stored = localStorage.getItem('invoices_v1');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Convert current invoice format to analytics format
function convertToAnalyticsFormat(invoices: any[]): InvoiceLike[] {
  return invoices.map(inv => ({
    id: inv.id,
    docType: (inv.id?.includes('quote') || inv.code?.toLowerCase().includes('quote')) ? 'quote' : 'invoice',
    currency: inv.currency || 'USD',
    issueDate: inv.issueDate || new Date().toISOString().slice(0, 10),
    dueDate: inv.dueDate,
    // Status fields
    sentAt: inv.sentAt || (inv.status === 'Sent' ? inv.issueDate + 'T10:00:00Z' : undefined),
    viewedAt: inv.viewedAt || undefined, 
    paidAt: inv.paidAt || (inv.status === 'Paid' ? inv.issueDate + 'T10:00:00Z' : undefined),
    voidAt: inv.voidAt || undefined,
    client: {
      id: inv.clientId,
      name: inv.clientName || inv.client?.name
    },
    amounts: {
      subTotal: inv.subtotal || 0,
      discount: inv.discount || 0,
      tax: inv.tax || 0,
      retention: 0,
      total: inv.total || 0
    }
  }));
}

function getRangePresets(t: (key: string) => string) {
  return [
    { key: "30d", label: t("dashboard.filters.last30"), shift: (now: Date) => new Date(now.getTime() - 30 * 86400000) },
    { key: "thisMonth", label: t("dashboard.filters.thisMonth"), shift: (now: Date) => new Date(now.getFullYear(), now.getMonth(), 1) },
    { key: "ytd", label: t("dashboard.filters.ytd"), shift: (now: Date) => new Date(now.getFullYear(), 0, 1) },
    { key: "12m", label: t("dashboard.filters.last12"), shift: (now: Date) => new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()) },
  ];
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { t } = useTranslation();
  // Use profile from real useInvoice store
  const profile = useInvoice(s => s.selectActiveProfile()) || { currency: "USD", locale: "es-VE" };
  const [docType, setDocType] = useState<"both" | "invoice" | "quote">("both");
  const [rangeKey, setRangeKey] = useState("30d");
  
  // Initialize sample data on component mount
  useEffect(() => {
    initializeSampleData();
  }, []);
  
  const rawInvoices = useMemo(() => loadInvoices(), []);
  const invoices = useMemo(() => convertToAnalyticsFormat(rawInvoices), [rawInvoices]);
  const RANGE_PRESETS = useMemo(() => getRangePresets(t), [t]);

  const now = new Date();
  const start = RANGE_PRESETS.find(p => p.key === rangeKey)!.shift(now);
  const filters: Filters = { 
    docType, 
    start, 
    end: now, 
    currency: profile?.currency || "USD" 
  };

  const docs = useMemo(() => filterDocs(invoices, filters), [invoices, filters]);
  const K = useMemo(() => kpis(docs, now), [docs, now]);
  const SB = useMemo(() => statusBreakdown(docs, now), [docs, now]);
  const months = useMemo(() => byMonth(docs).map(([k, v]) => ({ month: k, total: v })), [docs]);
  const recents = useMemo(() => recentInvoices(docs, 8), [docs]);
  const clients = useMemo(() => recentClients(docs, 8), [docs]);

  const pieData = [
    { name: t("status.paid"), value: SB.paid.count, color: COLORS[0] },
    { name: t("status.pending"), value: SB.pending.count, color: COLORS[1] },
    { name: t("status.overdue"), value: SB.overdue.count, color: COLORS[2] },
    { name: t("status.draft"), value: SB.draft.count, color: COLORS[3] },
    { name: t("status.void"), value: SB.void.count, color: COLORS[4] },
  ].filter(item => item.value > 0);

  const handleNewInvoice = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-invoices'));
  };

  const locale = profile?.locale || "es-VE";
  const currency = profile?.currency || "USD";

  return (
    <>
      {/* Header with Filters */}
      <section className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("dashboard.overview")}</h2>
        <div className="flex gap-3">
          <SelectGlass
            options={[t("dashboard.filters.both"), t("dashboard.filters.invoice"), t("dashboard.filters.quote")]}
            value={docType === "both" ? t("dashboard.filters.both") : docType === "invoice" ? t("dashboard.filters.invoice") : t("dashboard.filters.quote")}
            onChange={(e) => {
              const val = e.target.value;
              setDocType(val === t("dashboard.filters.both") ? "both" : val === t("dashboard.filters.invoice") ? "invoice" : "quote");
            }}
          />
          <SelectGlass
            options={RANGE_PRESETS.map(p => p.label)}
            value={RANGE_PRESETS.find(p => p.key === rangeKey)?.label}
            onChange={(e) => {
              const preset = RANGE_PRESETS.find(p => p.label === e.target.value);
              if (preset) setRangeKey(preset.key);
            }}
          />
          <ButtonPrimary onClick={handleNewInvoice}>{t("actions.createInvoice")}</ButtonPrimary>
        </div>
      </section>

      {/* KPIs Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Kpi tone="indigo" title={t("dashboard.kpi.total")} value={money(K.total, currency, locale)} sub="Billed" />
        <Kpi tone="indigo" title={t("dashboard.kpi.paid")} value={money(K.paid, currency, locale)} sub="Received" />
        <Kpi tone="amber" title={t("dashboard.kpi.unpaid")} value={money(K.unpaid, currency, locale)} sub="Outstanding" />
        <Kpi tone="rose" title={t("dashboard.kpi.overdue")} value={money(K.overdue, currency, locale)} sub="Past Due" />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Kpi tone="indigo" title={t("dashboard.kpi.conv")} value={`${K.conv}%`} sub="Quote → Invoice" />
        <Kpi tone="amber" title={t("dashboard.kpi.invoices")} value={K.nInv.toString()} sub="Documents" />
        <Kpi tone="amber" title={t("dashboard.kpi.quotes")} value={K.nQuote.toString()} sub="Proposals" />
        <Kpi tone="indigo" title={t("dashboard.kpi.clients")} value={K.nClients.toString()} sub="Active" />
      </section>

      {/* Charts and Tables */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
        {/* Status Donut Chart */}
        <div className="xl:col-span-5">
          <GlassCard title={t("dashboard.invoiceStatus")}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Revenue by Month */}
        <div className="xl:col-span-7">
          <GlassCard title={t("dashboard.revenueByMonth")}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={months}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [money(value as number, currency, locale), "Revenue"]}
                  />
                  <Bar dataKey="total" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Tables */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Recent Invoices */}
        <div className="xl:col-span-8">
          <GlassCard title={t("dashboard.recentDocs")}>
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-2 py-1">
                <div className="col-span-2">{t("table.id")}</div>
                <div className="col-span-3">{t("table.client")}</div>
                <div className="col-span-2">{t("table.date")}</div>
                <div className="col-span-3">{t("table.amount")}</div>
                <div className="col-span-2">{t("table.status")}</div>
              </div>
              <div className="space-y-1">
                {recents.map(r => {
                  const status = computeStatus(r, now);
                  const statusLabel = status === 'paid' ? t("status.paid") : 
                    status === 'overdue' ? t("status.overdue") : 
                    status === 'pending' || status === 'sent' || status === 'viewed' ? t("status.pending") :
                    status === 'void' ? t("status.void") : t("status.draft");
                  
                  return (
                    <div key={r.id} className="grid grid-cols-12 gap-2 items-center px-2 py-2 text-sm hover:bg-white/20 dark:hover:bg-white/5 rounded-lg">
                      <div className="col-span-2 font-mono text-xs">{r.id.slice(0, 8)}...</div>
                      <div className="col-span-3">{r.client?.name || "—"}</div>
                      <div className="col-span-2 text-slate-600 dark:text-slate-400">
                        {new Date(r.issueDate).toLocaleDateString(locale)}
                      </div>
                      <div className="col-span-3 font-medium">
                        {money(r.amounts.total, currency, locale)}
                      </div>
                      <div className="col-span-2">
                        <Chip>{statusLabel}</Chip>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Recent Clients */}
        <div className="xl:col-span-4">
          <GlassCard title={t("dashboard.recentClients")}>
            <div className="space-y-3">
              {clients.map(c => (
                <div key={c.name} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{c.name}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {c.count} document{c.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{money(c.total, currency, locale)}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {new Date(c.last).toLocaleDateString(locale)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>
    </>
  );
}