import { create } from "zustand";
import type { ThemeState, ThemeTokens, TemplateId, IconSpec } from "./types";

const defaults: ThemeTokens = {
  accent:"#04A7A3", accent2:"#027e7b",
  text:"#0f172a", textMuted:"#64748b",
  bg:"#ffffff", surface:"#f8fafc", border:"#e2e8f0",
  headingFont:"Inter", bodyFont:"Inter",
  headingWeight:700, bodyWeight:400,
  radius:12, borderWidth:1,
  stripe:true, stripeOpacity:0.45,
  logoMaxH:56, tableRowH:44, spacing:12,
  brandIcon: "FileText", customIconSvg: undefined
};

export const useTheme = create<ThemeState & {
  setTemplate:(t:TemplateId)=>void;
  setTokens:(p:Partial<ThemeTokens>)=>void;
  setIcon:(slot: keyof ThemeState["icons"], v: IconSpec)=>void;
  // Individual setters for CustomizerPanel
  setAccent: (v: string) => void;
  setAccent2: (v: string) => void;
  setText: (v: string) => void;
  setTextMuted: (v: string) => void;
  setBg: (v: string) => void;
  setSurface: (v: string) => void;
  setBorder: (v: string) => void;
  setHeadingFont: (v: string) => void;
  setBodyFont: (v: string) => void;
  setRadius: (v: number) => void;
  setBorderWidth: (v: number) => void;
  setStripe: (v: boolean) => void;
  setStripeOpacity: (v: number) => void;
  setLogoMaxH: (v: number) => void;
  setTableRowH: (v: number) => void;
  setSpacing: (v: number) => void;
  setBrandIcon: (iconName: string, customSvg?: string) => void;
}>(set=>({
  template:"modernTeal",
  tokens: defaults,
  icons:{
    phone:{type:"library",pack:"lucide",name:"Phone"},
    email:{type:"library",pack:"lucide",name:"Mail"},
    location:{type:"library",pack:"lucide",name:"MapPin"},
    instagram:{type:"library",pack:"lucide",name:"Instagram"},
    whatsapp:{type:"library",pack:"lucide",name:"MessageCircle"},
    website:{type:"library",pack:"lucide",name:"Globe"}
  },
  setTemplate:(t)=>set({template:t}),
  setTokens:(p)=>set(s=>({tokens:{...s.tokens,...p}})),
  setIcon:(slot,v)=>set(s=>({icons:{...s.icons,[slot]:v}})),
  // Individual setters
  setAccent: (v) => set(s => ({ tokens: { ...s.tokens, accent: v } })),
  setAccent2: (v) => set(s => ({ tokens: { ...s.tokens, accent2: v } })),
  setText: (v) => set(s => ({ tokens: { ...s.tokens, text: v } })),
  setTextMuted: (v) => set(s => ({ tokens: { ...s.tokens, textMuted: v } })),
  setBg: (v) => set(s => ({ tokens: { ...s.tokens, bg: v } })),
  setSurface: (v) => set(s => ({ tokens: { ...s.tokens, surface: v } })),
  setBorder: (v) => set(s => ({ tokens: { ...s.tokens, border: v } })),
  setHeadingFont: (v) => set(s => ({ tokens: { ...s.tokens, headingFont: v } })),
  setBodyFont: (v) => set(s => ({ tokens: { ...s.tokens, bodyFont: v } })),
  setRadius: (v) => set(s => ({ tokens: { ...s.tokens, radius: v } })),
  setBorderWidth: (v) => set(s => ({ tokens: { ...s.tokens, borderWidth: v } })),
  setStripe: (v) => set(s => ({ tokens: { ...s.tokens, stripe: v } })),
  setStripeOpacity: (v) => set(s => ({ tokens: { ...s.tokens, stripeOpacity: v } })),
  setLogoMaxH: (v) => set(s => ({ tokens: { ...s.tokens, logoMaxH: v } })),
  setTableRowH: (v) => set(s => ({ tokens: { ...s.tokens, tableRowH: v } })),
  setSpacing: (v) => set(s => ({ tokens: { ...s.tokens, spacing: v } })),
  setBrandIcon: (iconName, customSvg) => set(s => ({ 
    tokens: { 
      ...s.tokens, 
      brandIcon: iconName,
      ...(customSvg && { customIconSvg: customSvg })
    } 
  })),
}));