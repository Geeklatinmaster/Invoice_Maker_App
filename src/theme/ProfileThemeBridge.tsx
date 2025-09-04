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
  // For minimal footer visibility implementation, this component is disabled
  // since we don't have profiles/selectedProfileId in the minimal store
  return null;
}