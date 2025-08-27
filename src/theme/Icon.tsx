import {
  Phone, Mail, MapPin, Instagram, MessageCircle, Globe,
  Facebook, Linkedin, Youtube, HelpCircle, FileText, Receipt, 
  Calculator, Building, Users, Star, Heart, Check, X, Plus,
  ChevronDown
} from "lucide-react";
import DOMPurify from "dompurify";
import type { IconSpec } from "./types";
import { useTheme } from './useTheme';

const ICONS: any = { 
  Phone, Mail, MapPin, Instagram, MessageCircle, Globe, Facebook, 
  Linkedin, Youtube, HelpCircle, FileText, Receipt, Calculator, 
  Building, Users, Star, Heart, Check, X, Plus, ChevronDown 
};

export function TheIcon({spec}:{spec:IconSpec}){
  const size = spec.size ?? 16;
  if (spec.type==="library" && spec.pack==="lucide"){
    const Cmp = ICONS[spec.name] ?? HelpCircle;
    return <Cmp size={size} strokeWidth={1.75}/>;
  }
  if (spec.type==="custom"){
    const clean = DOMPurify.sanitize(spec.svg, {
      USE_PROFILES: { svg:true },
      FORBID_TAGS: ["script","iframe","object"],
      FORBID_ATTR: ["onload","onerror","onclick","onmouseover","xmlns:xlink"]
    });
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
    const clean = DOMPurify.sanitize(tokens.customIconSvg, {
      USE_PROFILES: { svg:true },
      FORBID_TAGS: ["script","iframe","object"],
      FORBID_ATTR: ["onload","onerror","onclick","onmouseover","xmlns:xlink"]
    });
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

  // Try Lucide from allowlist
  const LucideIcon = ICONS[name];
  if (LucideIcon) {
    return <LucideIcon size={size} strokeWidth={1.75} />;
  }

  // Fall back to text
  return <span style={{ fontSize: `${size}px`, lineHeight: 1 }}>{name}</span>;
}