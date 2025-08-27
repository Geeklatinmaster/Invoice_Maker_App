import * as Lucide from "lucide-react";
import DOMPurify from "dompurify";
import type { IconSpec } from "./types";
import { useTheme } from './useTheme';

export function TheIcon({spec}:{spec:IconSpec}){
  const size = spec.size ?? 16;
  if (spec.type==="library" && spec.pack==="lucide"){
    const Cmp = (Lucide as any)[spec.name] ?? Lucide.HelpCircle;
    return <Cmp size={size} strokeWidth={1.75} />;
  }
  if (spec.type==="custom"){
    const clean = DOMPurify.sanitize(spec.svg, { USE_PROFILES: { svg: true } });
    return <span style={{display:"inline-flex",height:size,width:size}}
      dangerouslySetInnerHTML={{__html: clean}} />;
  }
  return null;
}

// Simple icon component for CustomizerPanel
export function Icon({ name, size = 24 }: { name: string; size?: number }) {
  const tokens = useTheme(s => s.tokens);

  // Handle custom SVG from tokens (for brandIcon)
  if (name === 'custom' && tokens.customIconSvg) {
    const clean = DOMPurify.sanitize(tokens.customIconSvg, { USE_PROFILES: { svg: true } });
    return (
      <span
        style={{ 
          display: 'inline-flex',
          height: size,
          width: size,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }

  // Try Lucide
  const LucideIcon = (Lucide as any)[name];
  if (LucideIcon) {
    return <LucideIcon size={size} strokeWidth={1.75} />;
  }

  // Fall back to text
  return <span style={{ fontSize: `${size}px`, lineHeight: 1 }}>{name}</span>;
}