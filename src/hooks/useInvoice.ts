// src/hooks/useInvoice.ts
import { useAppStore, selectSelectedInvoice, selectTotals } from '@/store/invoiceStore';

export function useCurrentInvoice() {
  const invoice = useAppStore(selectSelectedInvoice);
  const totals = useAppStore(selectTotals);
  const updateCurrentInvoice = useAppStore((s) => s.updateCurrentInvoice);
  const addLineItem = useAppStore((s) => s.addLineItem);
  const removeLineItem = useAppStore((s) => s.removeLineItem);

  return { invoice, totals, updateCurrentInvoice, addLineItem, removeLineItem };
}