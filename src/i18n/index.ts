import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./locales/es.json";
import en from "./locales/en.json";

// Get saved language from localStorage or default to Spanish
function getSavedLanguage(): string {
  try {
    const settings = JSON.parse(localStorage.getItem("app_settings_v1") || "null");
    return settings?.language || "es";
  } catch {
    return "es";
  }
}

void i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: getSavedLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;