// BUG: if you see an error about a `Top Level await` import form /cjs instead
// see: https://github.com/i18next/i18next-fs-backend/issues/57
// import Backend from 'i18next-fs-backend';
import Backend from 'i18next-fs-backend/cjs'
import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next/server";
import i18n from "./i18n";

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
  },
  // Extending our default config file with server only fields
  i18next: {
    ...i18n,
    backend: {
      loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
    },
  },
  // Setting our our backend to load our translations from the file system via
  // i18next-fs-backend
  plugins: [Backend],
});

export default i18next;
