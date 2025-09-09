import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store/invoiceStore";
import { selectDashboardKPIs, selectRevenueByMonth, selectRecentInvoices } from "@/store/selectors/invoices";
import { formatCurrency } from "@/utils/format";
import { useSettings } from "@/store/useSettings";
import { GlassCard, SelectGlass, ButtonPrimary, Kpi, Chip } from "@/ui/components/glass";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { initializeSampleData } from "./sample-data";

// Status label helper
function getStatusLabel(status: string, t: any) {
  switch (status) {
    case 'paid': return t('status.paid');
    case 'sent': return t('status.sent');
    case 'overdue': return t('status.overdue');
    case 'draft': return t('status.draft');
    case 'cancelled': return t('status.cancelled');
    default: return status;
  }
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { t } = useTranslation('dashboard');
  const { locale } = useSettings();
  
  const [docType, setDocType] = useState<"both" | "invoice" | "quote">("both");
  const [rangeKey, setRangeKey] = useState("last30");
  
  // Initialize sample data on component mount
  useEffect(() => {
    initializeSampleData();
  }, []);

  // Get KPI data using new selectors
  const kpiData = useAppStore(state => selectDashboardKPIs(state, {
    range: rangeKey as any,
    docTypeFilter: docType
  }));
  
  // Get revenue by month
  const revenueData = useAppStore(state => selectRevenueByMonth(state, {
    monthsBack: 12
  }));
  
  // Get recent invoices
  const recentInvoices = useAppStore(state => selectRecentInvoices(state, 8));
  
  // Get clients for lookup
  const clients = useAppStore(state => state.clients);

  const pieData = [
    { name: t("status.paid"), value: kpiData.statusCounts.paid, color: COLORS[0] },
    { name: t("status.sent"), value: kpiData.statusCounts.sent + kpiData.statusCounts.viewed, color: COLORS[1] },
    { name: t("status.overdue"), value: kpiData.statusCounts.overdue, color: COLORS[2] },
    { name: t("status.draft"), value: kpiData.statusCounts.draft, color: COLORS[3] },
  ].filter(item => item.value > 0);

  const handleNewInvoice = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-invoices'));
  };

  const currency = "USD"; // TODO: get from settings

  return (
    <>
      {/* Header with Filters */}
      <section className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("overview")}</h2>
        <div className="flex gap-3">
          <SelectGlass
            options={[t("filters.both"), "Invoice", "Quote"]}
            value={docType === "both" ? t("filters.both") : docType === "invoice" ? "Invoice" : "Quote"}
            onChange={(e) => {
              const val = e.target.value;
              setDocType(val === t("filters.both") ? "both" : val === "Invoice" ? "invoice" : "quote");
            }}
          />
          <SelectGlass
            options={[t("filters.last30"), t("filters.last90"), t("filters.thisYear"), t("filters.all")]}
            value={rangeKey === "last30" ? t("filters.last30") : rangeKey === "last90" ? t("filters.last90") : rangeKey === "thisYear" ? t("filters.thisYear") : t("filters.all")}
            onChange={(e) => {
              const val = e.target.value;
              if (val === t("filters.last30")) setRangeKey("last30");
              else if (val === t("filters.last90")) setRangeKey("last90");
              else if (val === t("filters.thisYear")) setRangeKey("thisYear");
              else setRangeKey("all");
            }}
          />
          <ButtonPrimary onClick={handleNewInvoice}>{t("actions.createInvoice")}</ButtonPrimary>
        </div>
      </section>

      {/* KPIs Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Kpi tone="indigo" title={t("kpi.total")} value={formatCurrency(kpiData.totalBilled, locale, currency)} sub="Billed" />
        <Kpi tone="indigo" title={t("kpi.paid")} value={formatCurrency(kpiData.paidAmount, locale, currency)} sub="Received" />
        <Kpi tone="amber" title={t("kpi.unpaid")} value={formatCurrency(kpiData.unpaidAmount, locale, currency)} sub="Outstanding" />
        <Kpi tone="rose" title={t("kpi.overdue")} value={formatCurrency(kpiData.overdueAmount, locale, currency)} sub="Past Due" />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Kpi tone="indigo" title={t("kpi.clients")} value={kpiData.activeClientsCount.toString()} sub={t("kpi.clients")} />
        <Kpi tone="amber" title="Invoices" value={kpiData.invoiceCount.toString()} sub="Documents" />
        <Kpi tone="amber" title="Status" value={kpiData.statusCounts.paid.toString()} sub="Paid" />
        <Kpi tone="indigo" title="Total" value={kpiData.invoiceCount.toString()} sub="Total" />
      </section>

      {/* Charts and Tables */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
        {/* Status Donut Chart */}
        <div className="xl:col-span-5">
          <GlassCard title={t("charts.statusDistribution")}>
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
          <GlassCard title={t("charts.revenueByMonth")}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number, locale, currency), "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Tables */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Recent Invoices */}
        <div className="xl:col-span-12">
          <GlassCard title="Recent Invoices">
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-2 py-1">
                <div className="col-span-2">ID</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-3">Client</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-1">Status</div>
              </div>
              <div className="space-y-1">
                {recentInvoices.map(invoice => {
                  const clientName = clients[invoice.clientId]?.name || "Unknown Client";
                  return (
                    <div key={invoice.id} className="grid grid-cols-12 gap-2 items-center px-2 py-2 text-sm hover:bg-white/20 dark:hover:bg-white/5 rounded-lg">
                      <div className="col-span-2 font-mono text-xs">{invoice.code || invoice.id.slice(0, 8)}</div>
                      <div className="col-span-2">{invoice.docType}</div>
                      <div className="col-span-3">{clientName}</div>
                      <div className="col-span-2 text-slate-600 dark:text-slate-400">
                        {new Date(invoice.issueDate).toLocaleDateString(locale)}
                      </div>
                      <div className="col-span-2 font-medium">
                        {formatCurrency(invoice.totals.grandTotal, locale, currency)}
                      </div>
                      <div className="col-span-1">
                        <Chip>{getStatusLabel(invoice.status, t)}</Chip>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    </>
  );
}