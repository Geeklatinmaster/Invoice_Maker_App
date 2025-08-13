import ProfileSelector from "./features/invoice/components/ProfileSelector";
import FooterSelector from "./features/invoice/components/FooterSelector";
import InvoiceForm from "./features/invoice/components/InvoiceForm";
import ExportImport from "./features/invoice/components/ExportImport";
import Preview from "./features/invoice/components/Preview";

export default function App() {
  return (
    <main
      style={{
        fontFamily: "system-ui",
        padding: 16,
        display: "grid",
        gridTemplateColumns: "minmax(340px, 560px) 1fr", // izquierda (form) / derecha (preview)
        gap: 24,
        alignItems: "start",
      }}
    >
      {/* Columna izquierda: controles */}
      <section style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ExportImport />
        </div>

        <h2 style={{ margin: "8px 0 0" }}>InvoiceMaker — Base</h2>

        <ProfileSelector />
        <FooterSelector />
        <InvoiceForm />
      </section>

      {/* Columna derecha: preview (sticky) */}
      <aside
        style={{
          position: "sticky",
          top: 12,
          alignSelf: "start",
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Preview</h3>
          <Preview />
        </div>
      </aside>
    </main>
  );
}
