import { useInvoice } from "../store/useInvoice";
import { fmtCurrency } from "../lib/format";
import Footer from "./Footers";

export default function Preview() {
  const s = useInvoice();
  const iv = s.invoice;
  const profile =
    s.profiles.find((p) => p.id === s.selectedProfileId) ?? s.profiles[0];

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
              style={{ height: 56, maxWidth: 180, objectFit: "contain" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}

          <div>
            <h3 style={{ margin: 0 }}>{profile.businessName}</h3>
            <small style={{ color: "#555" }}>
              {iv.docType} • {iv.code} • {iv.issueDate}
            </small>
          </div>
        </div>
      </header>

      {/* Cliente */}
      <p style={{ marginTop: 8 }}>
        Customer: {iv.customerName || "(sin nombre)"}
      </p>

      {/* Items */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
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

      {/* Totales (ya autocálculo activo) */}
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
