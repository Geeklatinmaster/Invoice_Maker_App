import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store/invoiceStore";
import { selectDashboardKPIs, selectRevenueByMonth, selectRecentInvoices, selectRecentClients } from "@/store/selectors/invoices";
import { AppState } from "@/types/invoice";
import { formatCurrency } from "@/utils/format";
import { useSettings } from "@/store/useSettings";
import { useActiveBrand } from "@/store/brands";
import { GlassCard, SelectGlass, ButtonPrimary, Kpi, Chip } from "@/ui/components/glass";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { initializeSampleData } from "./sample-data";
import { shallow } from "zustand/shallow";

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
  const activeBrand = useActiveBrand();
  
  const [docType, setDocType] = useState<"both" | "invoice" | "quote">("both");
  const [rangeKey, setRangeKey] = useState<"last30" | "last90" | "thisYear" | "all">("last30");
  
  // Initialize sample data on component mount (dev only)
  useEffect(() => {
    if (import.meta.env.DEV && import.meta.env.MODE !== 'production') {
      initializeSampleData();
    }
  }, []);

  // Filter options with stable values
  const docTypeOptions = [
    { value: 'both' as const, label: t('filters.both') },
    { value: 'invoice' as const, label: t('filters.invoice') },
    { value: 'quote' as const, label: t('filters.quote') },
  ];

  const rangeOptions = [
    { value: 'last30' as const, label: t('filters.last30') },
    { value: 'last90' as const, label: t('filters.last90') },
    { value: 'thisYear' as const, label: t('filters.thisYear') },
    { value: 'all' as const, label: t('filters.all') },
  ];

  // Memoized selectors with flattened KPI data (only primitives for shallow comparison)
  const kpiSelector = useMemo(() => {
    return (s: AppState) => {
      const k = selectDashboardKPIs(s, { range: rangeKey, docTypeFilter: docType });
      // IMPORTANT: only primitives so shallow comparison works
      return {
        totalBilled: k.totalBilled,
        paidAmount: k.paidAmount,
        unpaidAmount: k.unpaidAmount,
        overdueAmount: k.overdueAmount,
        activeClientsCount: k.activeClientsCount,
        invoiceCount: k.invoiceCount,
        // Flattened status counts (no nested objects):
        paidCount: k.statusCounts.paid || 0,
        sentPlusViewed: (k.statusCounts.sent || 0) + (k.statusCounts.viewed || 0),
        draftCount: k.statusCounts.draft || 0,
        overdueCount: k.statusCounts.overdue || 0,
      };
    };
  }, [rangeKey, docType]);

  const kpiData = useAppStore(kpiSelector, shallow);
  
  const revenueSelector = useMemo(() => {
    return (s: AppState) =>
      selectRevenueByMonth(s, { range: rangeKey, docTypeFilter: docType, monthsBack: 12 });
  }, [rangeKey, docType]);

  const revenueData = useAppStore(revenueSelector, shallow);
  
  const recentInvoicesSelector = useMemo(
    () => (s: AppState) => selectRecentInvoices(s, 8),
    []
  );
  const recentInvoices = useAppStore(recentInvoicesSelector, shallow);

  const recentClientsSelector = useMemo(
    () => (s: AppState) => selectRecentClients(s, 6),
    []
  );
  const recentClients = useAppStore(recentClientsSelector, shallow);

  // Get currency from active brand and clients lookup
  const currency = activeBrand?.currency || "USD";
  const clientsSelector = useMemo(() => (s: AppState) => s.clients, []);
  const clients = useAppStore(clientsSelector, shallow);

  const pieData = useMemo(() => ([
    { name: t("status.paid"), value: kpiData.paidCount, color: COLORS[0] },
    { name: t("status.sent"), value: kpiData.sentPlusViewed, color: COLORS[1] },
    { name: t("status.overdue"), value: kpiData.overdueCount, color: COLORS[2] },
    { name: t("status.draft"), value: kpiData.draftCount, color: COLORS[3] },
  ]).filter(item => item.value > 0), [kpiData, t]);

  const handleNewInvoice = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-invoices'));
  };

  return (
    <>
      {/* Header with Filters */}
      <section className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("overview")}</h2>
        <div className="flex gap-3">
          <SelectGlass
            options={docTypeOptions.map(opt => opt.label)}
            value={docTypeOptions.find(opt => opt.value === docType)!.label}
            onChange={(e) => {
              const option = docTypeOptions.find(opt => opt.label === e.target.value);
              if (option) setDocType(option.value);
            }}
          />
          <SelectGlass
            options={rangeOptions.map(opt => opt.label)}
            value={rangeOptions.find(opt => opt.value === rangeKey)!.label}
            onChange={(e) => {
              const option = rangeOptions.find(opt => opt.label === e.target.value);
              if (option) setRangeKey(option.value);
            }}
          />
          <ButtonPrimary onClick={handleNewInvoice}>{t("actions.createInvoice")}</ButtonPrimary>
        </div>
      </section>

      {/* KPIs Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Kpi tone="indigo" title={t("kpi.total")} value={formatCurrency(kpiData.totalBilled, currency, locale)} sub={t("kpiSub.billed")} />
        <Kpi tone="indigo" title={t("kpi.paid")} value={formatCurrency(kpiData.paidAmount, currency, locale)} sub={t("kpiSub.received")} />
        <Kpi tone="amber" title={t("kpi.unpaid")} value={formatCurrency(kpiData.unpaidAmount, currency, locale)} sub={t("kpiSub.outstanding")} />
        <Kpi tone="rose" title={t("kpi.overdue")} value={formatCurrency(kpiData.overdueAmount, currency, locale)} sub={t("kpiSub.pastDue")} />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Kpi tone="indigo" title={t("kpi.clients")} value={kpiData.activeClientsCount.toString()} sub={t("kpiSub.active")} />
        <Kpi tone="amber" title={t("status.paid")} value={kpiData.paidCount.toString()} sub={t("status.paid")} />
        <Kpi tone="green" title={t("status.sent")} value={kpiData.sentPlusViewed.toString()} sub={t("status.sent")} />
        <Kpi tone="slate" title={t("status.draft")} value={kpiData.draftCount.toString()} sub={t("status.draft")} />
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
                    formatter={(value) => [formatCurrency(value as number, currency, locale), "Revenue"]}
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
        <div className="xl:col-span-8">
          <GlassCard title={t("tables.recentInvoices")}>
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-2 py-1">
                <div className="col-span-2">{t("tables.headers.id")}</div>
                <div className="col-span-2">{t("tables.headers.type")}</div>
                <div className="col-span-3">{t("tables.headers.client")}</div>
                <div className="col-span-2">{t("tables.headers.date")}</div>
                <div className="col-span-2">{t("tables.headers.amount")}</div>
                <div className="col-span-1">{t("tables.headers.status")}</div>
              </div>
              <div className="space-y-1">
                {recentInvoices.map(invoice => {
                  return (
                    <div key={invoice.id} className="grid grid-cols-12 gap-2 items-center px-2 py-2 text-sm hover:bg-white/20 dark:hover:bg-white/5 rounded-lg">
                      <div className="col-span-2 font-mono text-xs">{invoice.code || invoice.id.slice(0, 8)}</div>
                      <div className="col-span-2">{t(`docTypes.${invoice.docType}`)}</div>
                      <div className="col-span-3">
                        {clients[invoice.clientId]?.name || t("tables.unknownClient")}
                      </div>
                      <div className="col-span-2 text-slate-600 dark:text-slate-400">
                        {new Date(invoice.issueDate).toLocaleDateString(locale)}
                      </div>
                      <div className="col-span-2 font-medium">
                        {formatCurrency(invoice.totals.grandTotal, currency, locale)}
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

        {/* Recent Clients */}
        <div className="xl:col-span-4">
          <GlassCard title={t("tables.recentClients")}>
            <div className="space-y-3">
              {recentClients.map(client => (
                <div key={client.name} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{client.name}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {client.count} {t("tables.headers.documents").toLowerCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(client.total, currency, locale)}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {new Date(client.last).toLocaleDateString(locale)}
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