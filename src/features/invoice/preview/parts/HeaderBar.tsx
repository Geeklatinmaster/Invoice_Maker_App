import { labels } from "../../lib/i18n";
import { useBrand, useClient, useDocType, useLang, useMeta, useTagline } from "../../lib/selectors";

export default function HeaderBar(){
  const lang = useLang();
  const l = labels[lang];
  const docType = useDocType(); // 'invoice' | 'quote'
  const brand = useBrand();
  const client = useClient();
  const meta = useMeta();
  const tagline = useTagline();

  const title = docType === 'quote' ? l.quote : l.invoice;
  const leftLabel  = docType === 'quote' ? l.quoteFrom : l.billedFrom;
  const rightLabel = docType === 'quote' ? l.quoteTo   : l.invoiceTo;

  return (
    <header style={{ padding: '16px 20px 8px 20px', borderTopLeftRadius: 12, borderTopRightRadius: 12,
                     background: (getComputedStyle(document.documentElement).getPropertyValue('--grad-on').trim()==='1')
                       ? `linear-gradient(90deg, var(--grad-a), var(--grad-b))` : 'var(--accent)',
                     color: 'var(--header-text, #fff)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:'var(--title-size)', fontWeight:800, letterSpacing:0.5 }}>{title}</div>
          <div style={{ fontSize:'var(--small-size)', opacity:.9 }}>{brand?.name || ''}</div>
          {tagline && <div style={{ fontSize:'var(--small-size)', opacity:.8 }}>{tagline}</div>}
        </div>
        <div style={{ background:'#fff', color:'#111', borderRadius:12, padding:'10px 14px', boxShadow:'0 2px 8px rgba(0,0,0,.12)' }}>
          <div style={{ fontSize:12 }}><b>{l.number}:</b> {meta.number || '—'}</div>
          <div style={{ fontSize:12 }}><b>{l.date}:</b> {meta.date}</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16 }}>
        <div style={{ background:'rgba(0,0,0,.25)', color:'#000', borderRadius:12, padding:12,
                      border:`var(--border-width, 1px) solid var(--border)` }}>
          <div style={{ color:'var(--accent)', fontWeight:800 }}>{leftLabel}</div>
          <div style={{ fontSize:18, fontWeight:800, marginTop:6 }}>{brand?.name || ''}</div>
          <div style={{ fontSize:12, opacity:.9, marginTop:4 }}>
            {brand?.email && <div>{brand.email}</div>}
            {brand?.phone && <div>{brand.phone}</div>}
            {brand?.address && <div>{brand.address}</div>}
          </div>
        </div>
        <div style={{ background:'rgba(0,0,0,.25)', color:'#000', borderRadius:12, padding:12,
                      border:`var(--border-width, 1px) solid var(--border)` }}>
          <div style={{ color:'var(--accent)', fontWeight:800 }}>{rightLabel}</div>
          <div style={{ fontSize:18, fontWeight:800, marginTop:6 }}>{client?.name || ''}</div>
          <div style={{ fontSize:12, opacity:.9, marginTop:4 }}>
            {client?.email && <div>{client.email}</div>}
            {client?.address && <div>{client.address}</div>}
          </div>
        </div>
      </div>
    </header>
  );
}