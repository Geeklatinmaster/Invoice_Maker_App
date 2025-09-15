import { AppState, InvoiceDoc, InvoiceStatus } from '@/types/invoice';

export type DateRange = 'last30' | 'last90' | 'thisYear' | 'all';
export type DocTypeFilter = 'invoice' | 'quote' | 'both';

/**
 * Select invoice totals by ID
 */
export function selectInvoiceTotalsById(state: AppState, id: string) {
  const invoice = state.invoices[id];
  return invoice?.totals;
}

/**
 * Filter invoices by date range
 */
function filterInvoicesByDateRange(invoices: InvoiceDoc[], range: DateRange): InvoiceDoc[] {
  if (range === 'all') return invoices;
  
  const now = new Date();
  const cutoffDate = new Date();
  
  switch (range) {
    case 'last30':
      cutoffDate.setDate(now.getDate() - 30);
      break;
    case 'last90':
      cutoffDate.setDate(now.getDate() - 90);
      break;
    case 'thisYear':
      cutoffDate.setFullYear(now.getFullYear(), 0, 1);
      break;
  }
  
  return invoices.filter(inv => new Date(inv.issueDate) >= cutoffDate);
}

/**
 * Filter invoices by document type
 */
function filterInvoicesByDocType(invoices: InvoiceDoc[], filter: DocTypeFilter): InvoiceDoc[] {
  if (filter === 'both') return invoices;
  return invoices.filter(inv => inv.docType === filter);
}

/**
 * Check if invoice is overdue
 */
function isInvoiceOverdue(invoice: InvoiceDoc): boolean {
  if (invoice.docType !== 'invoice' || invoice.status === 'paid') return false;
  if (!invoice.dueDate) return false;
  
  const now = new Date();
  const dueDate = new Date(invoice.dueDate);
  return now > dueDate;
}

/**
 * Select dashboard KPIs with filters
 */
export function selectDashboardKPIs(
  state: AppState,
  options: {
    range?: DateRange;
    docTypeFilter?: DocTypeFilter;
  } = {}
) {
  const { range = 'all', docTypeFilter = 'both' } = options;
  
  let invoices = Object.values(state.invoices);
  
  // Apply filters
  invoices = filterInvoicesByDateRange(invoices, range);
  invoices = filterInvoicesByDocType(invoices, docTypeFilter);
  
  // Calculate KPIs
  let totalBilled = 0;
  let paidAmount = 0;
  let unpaidAmount = 0;
  let overdueAmount = 0;
  
  const statusCounts: Record<InvoiceStatus, number> = {
    draft: 0,
    sent: 0,
    viewed: 0,
    paid: 0,
    overdue: 0
  };
  
  invoices.forEach(invoice => {
    const total = invoice.totals.grandTotal;
    totalBilled += total;
    
    // Determine effective status
    let effectiveStatus = invoice.status;
    if (isInvoiceOverdue(invoice)) {
      effectiveStatus = 'overdue';
      overdueAmount += total;
    }
    
    statusCounts[effectiveStatus]++;
    
    if (effectiveStatus === 'paid') {
      paidAmount += total;
    } else if (effectiveStatus !== 'draft') {
      unpaidAmount += total;
    }
  });
  
  // Count active clients (clients with invoices in the filtered period)
  const activeClientIds = new Set(invoices.map(inv => inv.clientId));
  const activeClientsCount = activeClientIds.size;
  
  return {
    totalBilled,
    paidAmount,
    unpaidAmount,
    overdueAmount,
    activeClientsCount,
    statusCounts,
    invoiceCount: invoices.length
  };
}

/**
 * Select revenue by month for the last N months
 */
export function selectRevenueByMonth(
  state: AppState,
  options: { 
    monthsBack?: number;
    range?: DateRange;
    docTypeFilter?: DocTypeFilter;
  } = {}
) {
  const { monthsBack = 12, range = 'all', docTypeFilter = 'both' } = options;
  
  const now = new Date();
  const months: Array<{ month: string; revenue: number; invoiceCount: number }> = [];
  
  // Generate month labels
  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.push({
      month: monthKey,
      revenue: 0,
      invoiceCount: 0
    });
  }
  
  // Get filtered invoices
  let invoices = Object.values(state.invoices);
  invoices = filterInvoicesByDateRange(invoices, range);
  invoices = filterInvoicesByDocType(invoices, docTypeFilter);
  
  // Aggregate paid invoices by month
  invoices.forEach(invoice => {
    if (invoice.status !== 'paid') return;
    
    const issueDate = new Date(invoice.issueDate);
    const monthKey = `${issueDate.getFullYear()}-${String(issueDate.getMonth() + 1).padStart(2, '0')}`;
    
    const monthData = months.find(m => m.month === monthKey);
    if (monthData) {
      monthData.revenue += invoice.totals.grandTotal;
      monthData.invoiceCount += 1;
    }
  });
  
  return months;
}

/**
 * Select recent invoices (last 10)
 */
export function selectRecentInvoices(state: AppState, limit: number = 10) {
  return Object.values(state.invoices)
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, limit);
}

/**
 * Select invoices by status
 */
export function selectInvoicesByStatus(state: AppState, status: InvoiceStatus) {
  return Object.values(state.invoices).filter(invoice => {
    if (status === 'overdue') {
      return isInvoiceOverdue(invoice);
    }
    return invoice.status === status;
  });
}

/**
 * Select invoices by client ID
 */
export function selectInvoicesByClient(state: AppState, clientId: string) {
  return Object.values(state.invoices).filter(invoice => invoice.clientId === clientId);
}

/**
 * Select recent clients with activity
 */
export function selectRecentClients(state: AppState, limit: number = 10) {
  const clientActivity: Record<string, { 
    name: string; 
    count: number; 
    total: number; 
    last: string;
  }> = {};
  
  // Aggregate activity by client
  Object.values(state.invoices).forEach(invoice => {
    const client = state.clients[invoice.clientId];
    if (!client) return;
    
    if (!clientActivity[invoice.clientId]) {
      clientActivity[invoice.clientId] = {
        name: client.name,
        count: 0,
        total: 0,
        last: invoice.issueDate
      };
    }
    
    const activity = clientActivity[invoice.clientId];
    activity.count += 1;
    activity.total += invoice.totals.grandTotal;
    
    // Update last activity date
    if (new Date(invoice.issueDate) > new Date(activity.last)) {
      activity.last = invoice.issueDate;
    }
  });
  
  // Sort by last activity and return top N
  return Object.values(clientActivity)
    .sort((a, b) => new Date(b.last).getTime() - new Date(a.last).getTime())
    .slice(0, limit);
}

/**
 * Select client statistics
 */
export function selectClientStats(state: AppState, clientId: string) {
  const invoices = selectInvoicesByClient(state, clientId);
  
  let totalBilled = 0;
  let paidAmount = 0;
  let unpaidAmount = 0;
  
  invoices.forEach(invoice => {
    const total = invoice.totals.grandTotal;
    totalBilled += total;
    
    if (invoice.status === 'paid') {
      paidAmount += total;
    } else {
      unpaidAmount += total;
    }
  });
  
  return {
    totalBilled,
    paidAmount,
    unpaidAmount,
    invoiceCount: invoices.length,
    lastInvoiceDate: invoices.length > 0 
      ? invoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())[0].issueDate
      : null
  };
}