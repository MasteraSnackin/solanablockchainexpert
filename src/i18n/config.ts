import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const translations = {
  en: {
    translation: {
      'Interactive Adventure Quest': 'Interactive Adventure Quest',
      'Copy Chat Logs': 'Copy Chat Logs',
      'Export Chat': 'Export Chat',
      'Restart Chat': 'Restart Chat',
      'Dark Mode': 'Dark Mode',
      'Speed': 'Speed',
      'Pitch': 'Pitch',
      'Volume': 'Volume',
    },
  },
  fi: {
    translation: {
      'Interactive Adventure Quest': 'Interaktiivinen Seikkailutehtävä',
      'Copy Chat Logs': 'Kopioi Keskustelu',
      'Export Chat': 'Vie Keskustelu',
      'Restart Chat': 'Aloita Alusta',
      'Dark Mode': 'Tumma Tila',
      'Speed': 'Nopeus',
      'Pitch': 'Sävelkorkeus',
      'Volume': 'Äänenvoimakkuus',
    },
  },
  sv: {
    translation: {
      'Interactive Adventure Quest': 'Interaktivt Äventyrsspel',
      'Copy Chat Logs': 'Kopiera Chattloggar',
      'Export Chat': 'Exportera Chatt',
      'Restart Chat': 'Starta Om',
      'Dark Mode': 'Mörkt Läge',
      'Speed': 'Hastighet',
      'Pitch': 'Tonhöjd',
      'Volume': 'Volym',
    },
  },
};

i18n.use(initReactI18next).init({
  resources: translations,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
