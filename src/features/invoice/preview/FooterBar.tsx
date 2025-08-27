import { useInvoice } from "../store/useInvoice";
import * as MuiIcons from '@mui/icons-material';

function Icon({ s }: { s: any }) {
  const size = 16;
  if (s.icon?.type === 'mui') {
    // Use dynamic MUI icon by name
    const IconComponent = (MuiIcons as any)[s.icon.name] ?? MuiIcons.Link;
    return <IconComponent sx={{ fontSize: size }} />;
  }
  if (s.icon?.type === 'custom') {
    return <span 
      style={{ width: size, height: size, display: 'inline-flex' }}
      dangerouslySetInnerHTML={{ __html: s.icon.svg }} 
    />;
  }
  return null;
}

export default function FooterBar() {
  const socials = useInvoice(s => s.invoice.socials ?? []);
  
  if (socials.length === 0) return null;
  
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
      {socials.map(s => (
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