import { memo } from "react";
import { useInvoice } from "@/features/invoice/store/useInvoice";
import { shallow } from "zustand/shallow";
import { MuiIcon, IconName } from "../../../ui/icons/allowlist";

// Constante compartida para evitar crear arrays nuevos
const EMPTY: ReadonlyArray<any> = Object.freeze([]);

function Icon({ s }: { s: any }) {
  const size = 16;
  if (s.icon?.type === 'mui') {
    return <MuiIcon name={s.icon.name as IconName} size={size} />;
  }
  if (s.icon?.type === 'custom') {
    return <span 
      style={{ width: size, height: size, display: 'inline-flex' }}
      dangerouslySetInnerHTML={{ __html: s.icon.svg }} 
    />;
  }
  return null;
}

function FooterBarImpl() {
  // Selector estable (sin crear arrays/objetos nuevos)
  const socials = useInvoice(s => s.invoice.socials || EMPTY);
  
  if (!Array.isArray(socials) || socials.length === 0) return null;
  
  return (
    <div style={{
      display: 'flex', 
      gap: 16, 
      alignItems: 'center', 
      flexWrap: 'wrap', 
      padding: '8px 0',
      borderTop: 'var(--bw) solid var(--border)',
      marginTop: 'var(--sp)'
    }}>
      {socials.map((s: any) => (
        <div key={s.id} style={{
          display: 'inline-flex', 
          gap: 6, 
          alignItems: 'center', 
          fontSize: 13
        }}>
          <Icon s={s} />
          <span>{s.value || s.label}</span>
        </div>
      ))}
    </div>
  );
}

const FooterBar = memo(FooterBarImpl); // 👈 evita renders innecesarios
export default FooterBar;