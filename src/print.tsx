import React from "react";
import ReactDOM from "react-dom/client";
import Preview from "./features/invoice/components/Preview";
import { useInvoice } from "./features/invoice/store/useInvoice";
// Opcional, pero útil si cambias algo desde /print.html:
import "./features/invoice/store/autosave";

// Hidratar el store desde localStorage (o desde tu helper si existe)
function hydrateFromLocalStorage() {
  try {
    const raw = localStorage.getItem("invoice-maker@state");
    if (!raw) return;
    const saved = JSON.parse(raw);
    useInvoice.setState(saved);
    // Asegura totales correctos después de hidratar
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
