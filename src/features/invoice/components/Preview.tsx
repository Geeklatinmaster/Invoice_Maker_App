import { useInvoice } from "../store/useInvoice";
import { fmtCurrency } from "../lib/format";
import Footer from "./Footers";

export default function Preview() {
  const s = useInvoice();
  const iv = s.invoice;
  const profile =
    s.profiles.find((p) => p.id === s.selectedProfileId) ?? s.profiles[0];

  // Detecta si estamos en la página de impresión
  const isPrintPage =
    typeof window !== "undefined" &&
    (window.location.pathname === "/print.html" ||
      window.location.pathname.endsWith("/print.html"));

  // Abre /print.html con auto=1 y cache-bust; si bloquea pop-up, hace fallback navegando
  const openPrint = () => {
    const url = `/print.html?auto=1&t=${Date.now()}`;
    const w = window.open(url, "_blank", "noopener");
    if (!w) {
      window.location.href = url;
    }
  };

  return (
    <section style={{ border: "1px solid #ddd", padding: 12 }}>
      {/* Header con logo + info */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {profile?.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={profile.businessName || "Logo"}
              style={{
                height: 56, // se imprime nítido; no empuja el footer
                maxWidth: 180,
                objectFit: "contain",
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}

          <div>
            <h3 style={{ margin: 0 }}>{profile?.businessName ?? ""}</h3>
            <small style={{ color: "#555" }}>
              {iv.docType} • {iv.code} • {iv.issueDate}
            </small>

            {/* Contacto opcional */}
            <div style={{ marginTop: 4, fontSize: 12, color: "#555" }}>
              {profile?.email ? (
                <a
                  style={{ color: "#555", marginRight: 8 }}
                  href={`mailto:${profile.email}`}
                >
                  {profile.email}
                </a>
              ) : null}
              {profile?.phone ? (
                <a
                  style={{ color: "#555", marginRight: 8 }}
                  href={`tel:${profile.phone}`}
                >
                  {profile.phone}
                </a>
              ) : null}
              {profile?.website ? (
                <a
                  style={{ color: "#555", marginRight: 8 }}
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.website.replace(/^https?:\/\//, "")}
                </a>
              ) : null}
              {profile?.taxId ? (
                <span style={{ color: "#555" }}>Tax ID: {profile.taxId}</span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Botón de imprimir: NO se muestra dentro de /print.html */}
        {!isPrintPage && (
          <button
            className="no-print"
            onClick={openPrint}
            style={{ padding: "6px 10px" }}
            title="Abrir vista de impresión (PDF)"
            type="button"
          >
            Imprimir / PDF
          </button>
        )}
      </header>

      {/* Cliente */}
      <p style={{ marginTop: 8 }}>
        Customer: {iv.customerName || "(sin nombre)"}
      </p>

      {/* Items */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Item</th>
            <th>Qty</th>
            <th>Unit</th>
            <th align="right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {iv.items.map((it) => (
            <tr key={it.id}>
              <td>{it.title}</td>
              <td align="center">{it.qty}</td>
              <td align="center">
                {fmtCurrency(it.unitPrice, profile.currency, profile.locale)}
              </td>
              <td align="right">
                {fmtCurrency(
                  it.qty * it.unitPrice,
                  profile.currency,
                  profile.locale
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* Totales */}
      <p>
        <strong>Total:</strong>{" "}
        {fmtCurrency(s.totals.total, profile.currency, profile.locale)}
      </p>

      {/* Footer fijo al imprimir (la clase es usada por print.html) */}
      <div
        className="print-footer"
        style={{ marginTop: 12, fontSize: 12, color: "#444" }}
      >
        <Footer id={iv.footerId} />
      </div>
    </section>
  );
}
