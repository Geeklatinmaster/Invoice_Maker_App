import { useTranslation } from "react-i18next";
import { useSettings, type AppLanguage } from "@/store/useSettings";

export default function LanguageSwitcher() {
  const { t } = useTranslation('settings');
  const { language, setLanguage } = useSettings();

  const handleLanguageChange = (newLanguage: AppLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 14, fontWeight: 500 }}>
        {t("language")}:
      </label>
      <select 
        value={language} 
        onChange={(e) => handleLanguageChange(e.target.value as AppLanguage)}
        style={{ 
          padding: "4px 8px", 
          borderRadius: 4, 
          border: "1px solid #ddd",
          fontSize: 14 
        }}
      >
        <option value="es">{t("spanish")}</option>
        <option value="en">{t("english")}</option>
      </select>
    </div>
  );
}