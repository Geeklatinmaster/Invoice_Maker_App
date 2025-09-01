import { useTheme } from "../../../theme/useTheme";
import { useTemplateContext } from "./templates/context";
import { templateRegistry, defaultTemplateId } from "./templates/registry";

export default function TemplateRenderer(){
  const tpl = useTheme(s=>s.template); // 👈 reactivo
  const ctx = useTemplateContext(); // 👈 unified context
  
  // Get the template component from registry
  const Template = templateRegistry[tpl] ?? templateRegistry[defaultTemplateId];
  
  return <Template ctx={ctx} />;
}