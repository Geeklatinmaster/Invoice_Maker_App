import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { DocType, FooterState, FooterVisibility } from '@/types/invoice';

type InvoiceStore = {
  docType: DocType;
  footerState: FooterState;
  // Acciones
  setDocType: (docType: DocType) => void;
  setFooterEnabled: (key: keyof FooterState, enabled: boolean) => void;
  setFooterText: (key: 'notes' | 'terms', text: string) => void;
  setFooterVisibility: (key: keyof FooterState, visibility: FooterVisibility) => void;
  addPaymentCondition: (item: string) => void;
  updatePaymentCondition: (index: number, item: string) => void;
  removePaymentCondition: (index: number) => void;
};

const initialFooterState: FooterState = {
  notes: {
    enabled: true,
    text: 'Thank you for your business!',
    visibility: { showOnInvoice: true, showOnQuote: true },
  },
  terms: {
    enabled: false,
    text: 'Payment is due within 30 days of receipt.',
    visibility: { showOnInvoice: true, showOnQuote: true },
  },
  payment: {
    enabled: false,
    items: ['Bank Transfer', 'Credit Card (3% fee)'],
    visibility: { showOnInvoice: true, showOnQuote: false },
  },
};

export const useInvoice = create<InvoiceStore>()(
  immer((set) => ({
    // --- ESTADO ---
    docType: 'invoice',
    footerState: initialFooterState,

    // --- ACCIONES ---
    setDocType: (docType) => set({ docType }),

    setFooterEnabled: (key, enabled) => {
      set((state) => {
        state.footerState[key].enabled = enabled;
      });
    },

    setFooterText: (key, text) => {
      set((state) => {
        if (key === 'notes' || key === 'terms') {
          state.footerState[key].text = text;
        }
      });
    },

    setFooterVisibility: (key, visibility) => {
      set((state) => {
        state.footerState[key].visibility = visibility;
      });
    },

    addPaymentCondition: (item) => {
      set((state) => {
        state.footerState.payment.items.push(item);
      });
    },

    updatePaymentCondition: (index, item) => {
      set((state) => {
        if (index >= 0 && index < state.footerState.payment.items.length) {
          state.footerState.payment.items[index] = item;
        }
      });
    },

    removePaymentCondition: (index) => {
      set((state) => {
        if (index >= 0 && index < state.footerState.payment.items.length) {
          state.footerState.payment.items.splice(index, 1);
        }
      });
    },
  }))
);