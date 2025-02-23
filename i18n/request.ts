import { getUserLocale } from "@/lib/locale";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: {
      home: (await import(`../messages/${locale}/home.json`)).default,
      common: (await import(`../messages/${locale}/common.json`)).default,
      survey: (await import(`../messages/${locale}/survey.json`)).default,
    },
  };
});
