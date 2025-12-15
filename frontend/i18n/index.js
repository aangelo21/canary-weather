import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./en";
import { es } from "./es";


const savedLanguage = localStorage.getItem('i18nextLng') || 'es';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: es,
      en: en,
    },
    lng: savedLanguage, 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;