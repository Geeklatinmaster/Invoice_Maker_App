import { useInvoice } from "@/features/invoice/store/useInvoice";
import { useTemplateContext } from "./templates/context";
import { templateRegistry, defaultTemplateId } from "./templates/registry.tsx";

export default function TemplateRenderer() {
  const templateId = useInvoice(s => s.templateId);
  const docVersion = useInvoice(s => s.docVersion);
  const ctx = useTemplateContext();

  const Template = templateRegistry[templateId] || templateRegistry[defaultTemplateId];
  
  // Force remount when template or document version changes
  return <Template key={`${templateId}-${docVersion}`} ctx={ctx} />;
}