import ProfileSelector from "./features/invoice/components/ProfileSelector";
import FooterSelector from "./features/invoice/components/FooterSelector";
import InvoiceForm from "./features/invoice/components/InvoiceForm";
import Preview from "./features/invoice/components/Preview";

export default function App() {
  return (
    <main style={{fontFamily:"system-ui", padding:16, display:"grid", gap:16, gridTemplateColumns:"1fr 1fr"}}>
      <section style={{display:"grid", gap:12}}>
        <h2>InvoiceMaker 2.1.8.3 — Base</h2>
        <ProfileSelector />
        <FooterSelector />
        <InvoiceForm />
      </section>
      <section>
        <h3>Preview</h3>
        <Preview />
        <p><a href="/print.html" target="_blank" rel="noreferrer">Vista de impresión (estática)</a></p>
      </section>
    </main>
  );
}
