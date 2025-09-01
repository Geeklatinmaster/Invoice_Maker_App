import { useEffect, useRef } from "react";
import { useInvoice } from "@/features/invoice/store/useInvoice";
import { useTheme } from "./useTheme";
import type { TemplateId, ThemeTokens } from "./types";

function shallowEqualTokens(a?: Partial<ThemeTokens>, b?: Partial<ThemeTokens>) {
  if (a === b) return true;
  if (!a || !b) return false;
  const ak = Object.keys(a) as (keyof ThemeTokens)[];
  const bk = Object.keys(b) as (keyof ThemeTokens)[];
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (a[k] !== b[k]) return false;
  return true;
}

export default function ProfileThemeBridge(){
  const inv = useInvoice();
  const applyingRef = useRef(false); // <- guard anti-reentrada

  // A) Al cambiar de perfil activo, aplica su tema UNA VEZ si difiere
  useEffect(()=>{
    const pid = inv.selectedProfileId;
    const p = inv.profiles.find(x=>x.id===pid) ?? inv.profiles[0];
    if (!p?.theme) return;

    const cur = useTheme.getState();
    const sameTpl = cur.template === p.theme.template;
    const sameTok = shallowEqualTokens(cur.tokens, p.theme.tokens);
    if (sameTpl && sameTok) return;

    applyingRef.current = true;
    useTheme.getState().setTemplate(p.theme.template as TemplateId);
    useTheme.getState().setTokens(p.theme.tokens as Partial<ThemeTokens>);
    // libera el guard en el siguiente tick
    queueMicrotask(()=> { applyingRef.current = false; });
  // 👇 NO dependas de inv.profiles para no re-disparar
  }, [inv.selectedProfileId]);

  // B) Persiste cambios del theme store en el perfil, sólo si cambian y no estamos aplicando
  useEffect(()=>{
    const unsub = useTheme.subscribe(
      s => ({ template: s.template, tokens: s.tokens }), // selector fino
      ({ template, tokens }) => {
        if (applyingRef.current) return; // estoy aplicando desde perfil → no persistir

        const i = useInvoice.getState();
        const pid = i.selectedProfileId;
        const p = i.profiles.find(x=>x.id===pid);
        const prev = p?.theme ?? {};

        const sameTpl = prev.template === template;
        const sameTok = shallowEqualTokens(prev.tokens, tokens);
        if (sameTpl && sameTok) return; // nada que guardar

        i.updateProfile?.(pid, { theme: { template, tokens } });
      }
    );
    return unsub;
  }, []);

  return null;
}