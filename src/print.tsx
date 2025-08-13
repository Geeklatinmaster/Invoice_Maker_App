import React from "react";
import ReactDOM from "react-dom/client";
import Preview from "./features/invoice/components/Preview";
import { useInvoice } from "./features/invoice/store/useInvoice";
import "./features/invoice/store/autosave";

function hydrateFromLocalStorage() {
  try {
    const raw = localStorage.getItem("invoice-maker@state");
    if (!raw) return;
    const saved = JSON.parse(raw);
    useInvoice.setState(saved);
    // Recalcular totales tras hidratar
    setTimeout(() => useInvoice.getState().compute(), 0);
  } catch (e) {
    console.warn("No se pudo hidratar estado:", e);
  }
}

hydrateFromLocalStorage();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Preview />
  </React.StrictMode>
);

// Si viene ?auto=1, abre el diálogo de impresión y luego cierra
const params = new URLSearchParams(window.location.search);
if (params.get("auto") === "1") {
  setTimeout(() => window.print(), 100);
  window.onafterprint = () => setTimeout(() => window.close(), 100);
}
