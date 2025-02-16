"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/language-select";
import { locales, type Locale } from "@/i18n/config";
import { setUserLocale } from "@/lib/locale";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/stores/use-app-store";
import { GB, TR } from "country-flag-icons/react/3x2";
import { cn } from "@/lib/utils";

const LOCALE_DETAILS = {
  en: {
    flag: GB,
    label: "English",
    shortLabel: "EN",
  },
  tr: {
    flag: TR,
    label: "Türkçe",
    shortLabel: "TR",
  },
} as const;

export const LanguageSwitcher = ({
  currentLocale,
}: {
  currentLocale: Locale;
}) => {
  const router = useRouter();
  const t = useTranslations("common.languages");
  const { setLocale } = useAppStore();

  const onLocaleChange = useCallback(
    async (newLocale: string) => {
      await setUserLocale(newLocale as Locale);
      setLocale(newLocale as Locale);
      router.refresh();
    },
    [router, setLocale]
  );

  const FlagIcon = LOCALE_DETAILS[currentLocale].flag;
  const shortLabel = LOCALE_DETAILS[currentLocale].shortLabel;

  return (
    <Select
      value={currentLocale}
      onValueChange={onLocaleChange}
      aria-label={t("accessibility.selector")}
    >
      <SelectTrigger
        className={cn(
          "relative flex h-8 items-center gap-2 overflow-hidden rounded-full p-0 px-2",
          "transition-all duration-200 hover:ring-2 hover:ring-primary/50",
          "focus:ring-2 focus:ring-primary"
        )}
      >
        <div
          className={cn(
            "relative h-5 w-5 overflow-hidden rounded-full p-0",
            "transition-all duration-200 hover:ring-2 hover:ring-primary/50",
            "focus:ring-2 focus:ring-primary"
          )}
        >
          <FlagIcon className="absolute inset-0 h-full w-full scale-[1.6]" />
        </div>
        <div className="text-sm text-muted-foreground">{shortLabel}</div>
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => {
          const { flag: LocaleFlag } = LOCALE_DETAILS[locale];
          return (
            <SelectItem
              key={locale}
              value={locale}
              className="flex items-center gap-2 py-2"
            >
              <LocaleFlag className="h-4 w-4 rounded-sm" />
              <span className="ml-2">{t(locale)}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {LOCALE_DETAILS[locale].shortLabel}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
