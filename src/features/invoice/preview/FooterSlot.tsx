import FooterBar from "./FooterBar";
import { useInvoice } from "../store/useInvoice";

export default function FooterSlot(){
  const mode = useInvoice(s=>s.invoice.footer?.mode || 'social');
  if (mode === 'none') return null;
  return <FooterBar />; // en "minimal/brand/social" puedes variar estilos dentro del componente si quieres
}