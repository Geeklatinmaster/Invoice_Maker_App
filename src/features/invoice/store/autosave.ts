import { useInvoice } from "./useInvoice";
import { save } from "../lib/storage";

// Guarda TODO el estado ante cualquier cambio.
useInvoice.subscribe((state) => {
  try { save(state); } catch {}
});
