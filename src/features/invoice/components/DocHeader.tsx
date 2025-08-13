import { useInvoice } from "../store/useInvoice";

// --- Helpers de numeración ---
// Prefijo por tipo de documento
function prefixForDocType(t: string) {
  return t?.toLowerCase() === "quote" ? "QTE" : "INV";
}

// YYYYMM a partir de la fecha del invoice (o de hoy si no hay)
function yyyymmFrom(dateStr?: string) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}${mm}`;
}

// Llevar un contador por (prefijo, YYYYMM) en localStorage
function nextSequence(prefix: string, yyyymm: string) {
  const key = `invoice-maker@seq:${prefix}:${yyyymm}`;
  const current = parseInt(localStorage.getItem(key) || "0", 10) || 0;
  const next = current + 1;
  localStorage.setItem(key, String(next));
  return next;
}

// Formatea el código final: INV-YYYYMM-XXX
function buildCode(prefix: string, yyyymm: string, seq: number) {
  return `${prefix}-${yyyymm}-${String(seq).padStart(3, "0")}`;
}

export default function DocHeader() {
  const s = useInvoice();
  const iv = s.invoice;

  const setDocType: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const docType = e.target.value;
    useInvoice.setState((state) => ({
      invoice: { ...state.invoice, docType },
    }));
  };

  const setCode: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const code = e.target.value;
    useInvoice.setState((state) => ({
      invoice: { ...state.invoice, code },
    }));
  };

  const setIssueDate: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const issueDate = e.target.value;
    useInvoice.setState((state) => ({
      invoice: { ...state.invoice, issueDate },
    }));
  };

  // ←—— Botón Regenerar
  const regenerateCode = () => {
    const prefix = prefixForDocType(iv.docType);
    const yyyymm = yyyymmFrom(iv.issueDate);
    const seq = nextSequence(prefix, yyyymm);
    const code = buildCode(prefix, yyyymm, seq);

    useInvoice.setState((state) => ({
      invoice: { ...state.invoice, code },
    }));
  };

  return (
    <section style={{ display: "grid", gap: 8 }}>
      {/* Tipo de documento */}
      <label>
        Type:&nbsp;
        <select value={iv.docType} onChange={setDocType}>
          <option value="Invoice">Invoice</option>
          <option value="Quote">Quote</option>
        </select>
      </label>

      {/* Código + Regenerar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Code:&nbsp;
          <input
            style={{ width: 220 }}
            value={iv.code ?? ""}
            onChange={setCode}
            placeholder="INV-YYYYMM-001"
          />
        </label>
        <button
          type="button"
          onClick={regenerateCode}
          title="Regenerar código"
          className="no-print"
          style={{ padding: "4px 8px" }}
        >
          ↻ Regenerar
        </button>
      </div>

      {/* Fecha de emisión */}
      <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        Issue date:&nbsp;
        <input
          type="date"
          value={iv.issueDate ?? ""}
          onChange={setIssueDate}
          style={{ width: 160 }}
        />
      </label>
    </section>
  );
}