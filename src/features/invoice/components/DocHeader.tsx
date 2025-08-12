import type { ChangeEvent } from "react";
import { useInvoice } from "../store/useInvoice";
import type { DocType } from "../types/types";

function yyyymm(d = new Date()) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function seqKey(prefix: "INV" | "QTE", ym = yyyymm()) {
  return `invoice-maker@seq:${prefix}:${ym}`;
}
function nextSeq(prefix: "INV" | "QTE", ym = yyyymm()) {
  const k = seqKey(prefix, ym);
  const curr = parseInt(localStorage.getItem(k) || "0", 10) || 0;
  const next = curr + 1;
  localStorage.setItem(k, String(next));
  return String(next).padStart(3, "0");
}
function prefixFor(docType: DocType) {
  return docType === "INVOICE" ? "INV" : "QTE";
}

export default function DocHeader() {
  const s = useInvoice();
  const iv = s.invoice;

  const onTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    s.patchInvoice({ docType: e.target.value as DocType });
  };

  const onCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    s.patchInvoice({ code: e.target.value });
  };

  const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    s.patchInvoice({ issueDate: e.target.value });
  };

  const onRegenCode = () => {
    const ym = yyyymm();
    const prefix = prefixFor(iv.docType);
    const seq = nextSeq(prefix, ym);
    const code = `${prefix}-${ym}-${seq}`;
    s.patchInvoice({ code });
  };

  return (
    <section style={{ display: "grid", gap: 10 }}>
      <label>
        Type:&nbsp;
        <select value={iv.docType} onChange={onTypeChange}>
          <option value="INVOICE">Invoice</option>
          <option value="QUOTE">Quote</option>
        </select>
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Code:&nbsp;
          <input
            value={iv.code}
            onChange={onCodeChange}
            placeholder="INV-YYYYMM-001"
            style={{ width: 220 }}
          />
        </label>
        <button type="button" onClick={onRegenCode} title="Autonumerar">
          ↻ Regenerar
        </button>
      </div>

      <label>
        Issue date:&nbsp;
        <input type="date" value={iv.issueDate} onChange={onDateChange} />
      </label>
    </section>
  );
}
