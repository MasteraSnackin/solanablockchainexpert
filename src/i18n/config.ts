import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Copy Chat Logs': 'Copy Chat Logs',
      'Restart Chat': 'Restart Chat',
      'Export Chat': 'Export Chat',
      'Dark Mode': 'Dark Mode',
      'Language': 'Language',
    },
  },
  es: {
    translation: {
      'Copy Chat Logs': 'Copiar registros',
      'Restart Chat': 'Reiniciar chat',
      'Export Chat': 'Exportar chat',
      'Dark Mode': 'Modo oscuro',
      'Language': 'Idioma',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;