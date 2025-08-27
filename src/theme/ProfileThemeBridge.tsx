import { useEffect } from "react";
import { useInvoice } from "../features/invoice/store/useInvoice";
import { useTheme } from "./useTheme";
import type { TemplateId, ThemeTokens } from "./types";

export default function ProfileThemeBridge(){
  const s = useInvoice();
  const { setTemplate, setTokens } = useTheme();

  // Al cambiar de perfil, aplica su tema si existe
  useEffect(()=>{
    const p = s.profiles.find(x=>x.id===s.selectedProfileId) ?? s.profiles[0];
    if (p?.theme?.template){
      setTemplate(p.theme.template as TemplateId);
    }
    if (p?.theme?.tokens){
      setTokens(p.theme.tokens as Partial<ThemeTokens>);
    }
  }, [s.selectedProfileId, s.profiles, setTemplate, setTokens]);

  // Hook espejo: cada cambio de theme se persiste en el perfil activo
  useEffect(()=>{
    const unsub1 = useTheme.subscribe((st)=>{ // template + tokens
      const pid = s.selectedProfileId;
      const p  = s.profiles.find(x=>x.id===pid);
      if (!p) return;
      s.updateProfile?.(pid, { 
        theme: { 
          ...(p.theme ?? {}), 
          template: st.template,
          tokens: st.tokens
        } 
      });
    });
    return ()=>{ unsub1(); };
  }, [s.selectedProfileId, s.profiles, s.updateProfile]);

  return null;
}