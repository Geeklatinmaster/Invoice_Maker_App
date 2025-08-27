import { useTheme } from "./useTheme";

export default function ThemeVars(){
  const t = useTheme(s=>s.tokens);
  return (
    <style>{`
      :root{
        --acc:${t.accent}; --acc2:${t.accent2};
        --txt:${t.text}; --txtMuted:${t.textMuted};
        --bg:${t.bg}; --surface:${t.surface}; --border:${t.border};
        --heading:${t.headingFont}; --body:${t.bodyFont};
        --hW:${t.headingWeight}; --bW:${t.bodyWeight};
        --r:${t.radius}px; --bw:${t.borderWidth}px;
        --stripe:${t.stripe ? 1 : 0}; --stripeOp:${t.stripeOpacity};
        --logoH:${t.logoMaxH}px; --rowH:${t.tableRowH}px; --sp:${t.spacing}px;
      }
      @media print {
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        body { background: var(--bg) !important; color: var(--txt) !important; }
        table thead { background: var(--surface) !important; }
      }
    `}</style>
  );
}