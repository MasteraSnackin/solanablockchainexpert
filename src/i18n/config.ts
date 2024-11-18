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
  fr: {
    translation: {
      'Copy Chat Logs': 'Copier les journaux',
      'Restart Chat': 'Redémarrer le chat',
      'Export Chat': 'Exporter le chat',
      'Dark Mode': 'Mode sombre',
      'Language': 'Langue',
    },
  },
  de: {
    translation: {
      'Copy Chat Logs': 'Chat-Protokolle kopieren',
      'Restart Chat': 'Chat neustarten',
      'Export Chat': 'Chat exportieren',
      'Dark Mode': 'Dunkelmodus',
      'Language': 'Sprache',
    },
  },
  it: {
    translation: {
      'Copy Chat Logs': 'Copia log chat',
      'Restart Chat': 'Riavvia chat',
      'Export Chat': 'Esporta chat',
      'Dark Mode': 'Modalità scura',
      'Language': 'Lingua',
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