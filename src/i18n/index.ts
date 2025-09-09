import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English namespaces
import enCommon from './locales/en/common.json';
import enDashboard from './locales/en/dashboard.json';
import enInvoices from './locales/en/invoices.json';
import enClients from './locales/en/clients.json';
import enSettings from './locales/en/settings.json';

// Spanish namespaces
import esCommon from './locales/es/common.json';
import esDashboard from './locales/es/dashboard.json';
import esInvoices from './locales/es/invoices.json';
import esClients from './locales/es/clients.json';
import esSettings from './locales/es/settings.json';

const resources = {
  en: {
    common: enCommon,
    dashboard: enDashboard,
    invoices: enInvoices,
    clients: enClients,
    settings: enSettings
  },
  es: {
    common: esCommon,
    dashboard: esDashboard,
    invoices: esInvoices,
    clients: esClients,
    settings: esSettings
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // default language
    fallbackLng: 'es',
    defaultNS: 'common',
    ns: ['common', 'dashboard', 'invoices', 'clients', 'settings'],
    
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;