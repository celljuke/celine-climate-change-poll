import { Locale } from "@/i18n/config";

export interface AppState {
  data: {
    locale?: Locale;
  };
  setLocale: (locale: Locale) => void;
}
