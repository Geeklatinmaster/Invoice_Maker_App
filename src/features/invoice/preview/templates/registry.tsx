import React from "react";
import type { TemplateVM } from "./types";

// Default template component
export const DefaultTemplate: React.FC<{ ctx: TemplateVM }> = ({ ctx }) => {
  return (
    <section style={{border:"1px solid #ddd", padding:12}}>
      <h3>{ctx.company.name}</h3>
      <p>{ctx.doc.type} • {ctx.doc.code}</p>
      <p>Customer: {ctx.client.name || "(sin nombre)"}</p>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead><tr><th align="left">Item</th><th>Qty</th><th>Unit</th><th align="right">Amount</th></tr></thead>
        <tbody>
          {ctx.items.map((item, idx) => (
            <tr key={item.id || idx}>
              <td>{item.description}</td>
              <td align="center">{item.qty}</td>
              <td align="center">{ctx.settings.currency} {item.unitPrice}</td>
              <td align="right">{ctx.settings.currency} {item.lineTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr/>
      <p>Total: {ctx.settings.currency} {ctx.totals.total}</p>
      <div style={{marginTop:12, fontSize:12, color:"#444"}}>
        <p>Footer style: {ctx.footer.style}</p>
      </div>
    </section>
  );
};

// Template registry
export const templateRegistry: Record<string, React.ComponentType<{ ctx: TemplateVM }>> = {
  default: DefaultTemplate,
  "template-01": DefaultTemplate, // Can add more templates later
};

export const defaultTemplateId = "default";