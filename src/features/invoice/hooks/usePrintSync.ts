import { useEffect } from 'react';
import { useInvoice } from '@/features/invoice/store/useInvoice';

export const usePrintSync = () => {
  // TEMPORARILY DISABLED TO ISOLATE LOOP SOURCE
  // This hook was causing infinite re-renders
  // We need to fix the root cause before re-enabling
  
  // No-op for now
  useEffect(() => {
    // Do nothing until we fix the loop
  }, []);
};