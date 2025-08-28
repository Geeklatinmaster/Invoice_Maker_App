import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { ThemeState, ThemeTokens, TemplateId, IconSpec } from "./types";

function shallowEqual<T extends object>(a?: Partial<T>, b?: Partial<T>) {
  if (a === b) return true;
  if (!a || !b) return false;
  const ak = Object.keys(a) as (keyof T)[];
  const bk = Object.keys(b) as (keyof T)[];
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (a[k] !== b[k]) return false;
  return true;
}

const defaults: ThemeTokens = {
  accent:"#04A7A3", accent2:"#027e7b",
  text:"#0f172a", textMuted:"#64748b",
  bg:"#ffffff", surface:"#f8fafc", border:"#e2e8f0",
  headingFont:"Inter", bodyFont:"Inter",
  headingWeight:700, bodyWeight:400,
  radius:12, borderWidth:1,
  stripe:true, stripeOpacity:0.45,
  logoMaxH:56, tableRowH:44, spacing:12,
  bodySize: 14, titleSize: 24, smallSize: 12,
  marginTop: 20, marginRight: 20, marginBottom: 25, marginLeft: 20,
  rowHeight: 44, cellPadding: 10,
  headerGradient: true,
  headerGradStart: '#0f0fa9', headerGradEnd: '#02a7a3'
};

type Store = ThemeState & {
  setTemplate:(t:TemplateId)=>void;
  setTokens:(p:Partial<ThemeTokens>)=>void;
  setIcon:(slot: keyof ThemeState["icons"], v: IconSpec)=>void;
};

export const useTheme = create(subscribeWithSelector<Store>((set, get)=>({
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

  setTemplate:(t)=> {
    if (get().template === t) return;            // <- no-op si igual
    set({ template: t });
  },

  setTokens:(p)=> {
    const next = { ...get().tokens, ...p };
    if (shallowEqual<ThemeTokens>(next, get().tokens)) return; // <- no-op si igual
    set({ tokens: next });
  },

  setIcon:(slot,v)=>{
    const cur = get().icons as any;
    const same = JSON.stringify(cur[slot]) === JSON.stringify(v);
    if (same) return;                             // <- no-op si igual
    set({ icons: { ...get().icons, [slot]: v } });
  }
})));