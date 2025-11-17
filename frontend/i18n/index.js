import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./en";
import { es } from "./es";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      es: es,
    },
    lng: "en", 
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;