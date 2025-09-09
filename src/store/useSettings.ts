import { create } from "zustand";

export type AppLanguage = "es" | "en";
export type AppLocale = "es-VE" | "es-ES" | "en-US";

type SettingsState = {
  language: AppLanguage;
  locale: AppLocale;
  setLanguage: (lang: AppLanguage) => void;
  setLocale: (loc: AppLocale) => void;
};

const LS_KEY = "app_settings_v1";
function readLS<T>(k: string): T | null { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } }
function writeLS<T>(k: string, v: T) { localStorage.setItem(k, JSON.stringify(v)); }

export const useSettings = create<SettingsState>((set, get) => {
  const boot = readLS<Partial<SettingsState>>(LS_KEY) || {};
  const language: AppLanguage = boot.language || "es";
  const locale: AppLocale = boot.locale || (language === "es" ? "es-VE" : "en-US");

  const persist = () => writeLS(LS_KEY, get());

  return {
    language,
    locale,
    setLanguage: (lang) => {
      const loc = lang === "es" ? "es-VE" : "en-US";
      set({ language: lang, locale: loc });
      document.documentElement.lang = lang;
      persist();
    },
    setLocale: (loc) => { set({ locale: loc }); persist(); },
  };
});