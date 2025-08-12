import ProfileSelector from "./features/invoice/components/ProfileSelector";
import FooterSelector from "./features/invoice/components/FooterSelector";
import InvoiceForm from "./features/invoice/components/InvoiceForm";
import Preview from "./features/invoice/components/Preview";
import ExportImport from "./features/invoice/components/ExportImport";
import DocHeader from "./features/invoice/components/DocHeader";


// opcional: asegura autosave/auto-cálculo activo en toda la app
import "./features/invoice/store/autosave";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 16 }}>
      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "360px 1fr",
          alignItems: "start",
        }}
      >
        {/* Panel izquierdo (solo una vez) */}
        <section style={{ display: "grid", gap: 12 }}>
          <h2>InvoiceMaker — Base</h2>

          <div style={{ marginBottom: 12 }}>
            <ExportImport />
          </div>
          <section style={{ display: "grid", gap: 12 }}>
            <h2>InvoiceMaker — Base</h2>

            <div style={{ marginBottom: 12 }}>
              <ExportImport />
            </div>

            {/* ⬇️ Nuevo */}
            <DocHeader />

            <ProfileSelector />
            <FooterSelector />
            <InvoiceForm />
          </section>

          <ProfileSelector />
          <FooterSelector />
          <InvoiceForm />
        </section>

        {/* Panel derecho: preview */}
        <section>
          <h3>Preview</h3>
          <Preview />
        </section>
      </div>
    </div>
  );
}