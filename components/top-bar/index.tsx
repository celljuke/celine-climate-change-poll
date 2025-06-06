"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useAppStore } from "@/stores/use-app-store";
import { cn } from "@/lib/utils";
import { Locale } from "@/i18n/config";
export const TopBar = () => {
  const { data } = useAppStore();

  return (
    <div
      className={cn(
        "sticky top-0 z-50 w-full bg-emerald-50 px-4",
        "backdrop-blur supports-[backdrop-filter]:bg-emerald-50"
      )}
    >
      <div className="container flex h-14 items-center">
        <div className="flex flex-1" />
        <div className="flex flex-shrink-0 items-center justify-end">
          <LanguageSwitcher currentLocale={data.locale as Locale} />
        </div>
      </div>
    </div>
  );
};
