import type { ChangeEvent } from "react";
import { useInvoice } from "../store/useInvoice";
import { save } from "../lib/storage";

function ts(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(
    d.getHours()
  )}${pad(d.getMinutes())}`;
}

export default function ExportImport() {
  const handleExport = () => {
    const payload = { __version: 1, state: useInvoice.getState() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `invoice-maker-${ts()}.json`;
    a.click();
    // Revoca la URL después del click para evitar cortar la descarga
    setTimeout(() => URL.revokeObjectURL(a.href), 0);
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const payload = JSON.parse(text);

      // Acepta formato nuevo ({ __version, state }) y antiguo (estado directo)
      const incoming = payload?.state ?? payload;
      const version = payload?.__version ?? 0;

      // Validación mínima
      if (!incoming || typeof incoming !== "object" || !("invoice" in incoming)) {
        throw new Error("Archivo no tiene la estructura esperada.");
      }

      // Aviso si la versión no coincide
      if (version !== 1) {
        const ok = confirm(
          `Archivo con versión desconocida (${version}). ¿Importar de todas formas?`
        );
        if (!ok) {
          e.target.value = "";
          return;
        }
      }

      // Merge selectivo: solo datos; preserva las acciones del store
      useInvoice.setState((s) => ({
        ...s,
        profiles: incoming.profiles ?? s.profiles,
        selectedProfileId: incoming.selectedProfileId ?? s.selectedProfileId,
        invoice: incoming.invoice ?? s.invoice,
        totals: incoming.totals ?? s.totals,
      }));

      // Persiste y recalcula
      save(useInvoice.getState());
      setTimeout(() => useInvoice.getState().compute(), 0);

      alert("Import OK");
    } catch (err) {
      console.error(err);
      alert("Import failed: JSON inválido");
    } finally {
      e.target.value = ""; // reset input
    }
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={handleExport}>Export JSON</button>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <input
          type="file"
          accept="application/json,.json"
          onChange={handleImport}
        />
        Import JSON
      </label>
    </div>
  );
}

