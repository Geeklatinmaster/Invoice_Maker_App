import { useTemplateContext } from "./context";
import { templateRegistry } from "./registry";

export default function DebugAllTemplates() {
  const ctx = useTemplateContext();
  
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: 20 }}>
      <div style={{ border: "1px solid #ddd", padding: 12 }}>
        <h3>Context Data</h3>
        <pre style={{ fontSize: 10, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(ctx, null, 2)}
        </pre>
      </div>
      
      {Object.entries(templateRegistry).map(([id, Template]) => (
        <div key={id} style={{ border: "1px solid #ddd", padding: 12 }}>
          <h3>{id}</h3>
          <div style={{ transform: "scale(0.3)", transformOrigin: "top left", height: 200, overflow: "hidden" }}>
            <Template ctx={ctx} />
          </div>
        </div>
      ))}
    </div>
  );
}