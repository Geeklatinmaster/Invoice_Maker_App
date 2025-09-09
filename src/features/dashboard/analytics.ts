import { differenceInCalendarDays, parseISO, formatISO } from "date-fns";

export type DocType = "invoice" | "quote";
export type Status = "draft"|"sent"|"viewed"|"pending"|"overdue"|"paid"|"void";

export type MoneyParts = { subTotal:number; discount:number; tax:number; retention:number; total:number };
export type InvoiceLike = {
  id: string; 
  docType: DocType; 
  currency: string;
  issueDate: string; 
  dueDate?: string;
  sentAt?: string; 
  viewedAt?: string; 
  paidAt?: string; 
  voidAt?: string;
  client?: { id?: string; name?: string };
  amounts: MoneyParts;
};

export const computeStatus = (d: InvoiceLike, now = new Date()): Status => {
  if (d.voidAt) return "void";
  if (d.paidAt) return "paid";
  const due = d.dueDate ? parseISO(d.dueDate) : undefined;
  if (due && due.getTime() < now.getTime()) return "overdue";
  if (d.viewedAt) return "viewed";
  if (d.sentAt) return "sent";
  return "draft";
};

export const inRange = (iso: string, start: Date, end: Date) => {
  const t = parseISO(iso).getTime();
  return t >= start.getTime() && t <= end.getTime();
};

export const monthKey = (iso: string) => {
  const d = parseISO(iso);
  const y = d.getFullYear(), m = d.getMonth()+1;
  return `${y}-${String(m).padStart(2,"0")}`; // 2025-09
};

export type Filters = { docType: "both"|DocType; start: Date; end: Date; currency: string };

export function filterDocs(all: InvoiceLike[], f: Filters) {
  return all.filter(d => {
    const typeOk = f.docType === "both" || d.docType === f.docType;
    const dateOk = inRange(d.issueDate, f.start, f.end);
    const currOk = d.currency === f.currency; // v1: una moneda a la vez
    return typeOk && dateOk && currOk;
  });
}

export function kpis(docs: InvoiceLike[], now = new Date()) {
  let total=0, paid=0, unpaid=0, overdue=0, nInv=0, nQuote=0, nClients=0;
  const clients = new Set<string>();
  for (const d of docs) {
    const st = computeStatus(d, now);
    const amt = d.amounts.total || 0;
    total += amt;
    if (d.docType === "invoice") nInv++; else nQuote++;
    if (d.client?.name) clients.add(d.client.name);
    if (st === "paid") paid += amt;
    else if (st === "overdue" || st === "pending" || st === "sent" || st === "viewed" || st === "draft") unpaid += amt;
    if (st === "overdue") overdue += amt;
  }
  nClients = clients.size;
  const conv = nQuote ? Math.round((nInv / nQuote) * 100) : 0;
  return { total, paid, unpaid, overdue, nInv, nQuote, nClients, conv };
}

export function statusBreakdown(docs: InvoiceLike[], now = new Date()) {
  const buckets: Record<Status, {count:number, amount:number}> = {
    draft:{count:0,amount:0}, sent:{count:0,amount:0}, viewed:{count:0,amount:0},
    pending:{count:0,amount:0}, overdue:{count:0,amount:0}, paid:{count:0,amount:0}, void:{count:0,amount:0}
  };
  for (const d of docs) {
    let st = computeStatus(d, now);
    if (st==="sent"||st==="viewed") st = "pending"; // donut más simple: Pending agrupa
    buckets[st].count++; buckets[st].amount += d.amounts.total||0;
  }
  return buckets;
}

export function byMonth(docs: InvoiceLike[]) {
  const map = new Map<string, number>();
  for (const d of docs) {
    const k = monthKey(d.issueDate);
    map.set(k, (map.get(k) || 0) + (d.amounts.total || 0));
  }
  // devuelve últimos 12 meses si existen
  return Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b));
}

export function recentInvoices(docs: InvoiceLike[], limit=10) {
  return [...docs].sort((a,b) => parseISO(b.issueDate).getTime() - parseISO(a.issueDate).getTime()).slice(0, limit);
}

export function recentClients(docs: InvoiceLike[], limit=8) {
  const map = new Map<string, {name:string; count:number; total:number; last:string}>();
  for (const d of docs) {
    const name = d.client?.name || "—";
    const ent = map.get(name) || { name, count:0, total:0, last: "1970-01-01T00:00:00.000Z" };
    ent.count++; ent.total += d.amounts.total||0;
    if (ent.last < d.issueDate) ent.last = d.issueDate;
    map.set(name, ent);
  }
  return Array.from(map.values()).sort((a,b)=>parseISO(b.last).getTime()-parseISO(a.last).getTime()).slice(0,limit);
}