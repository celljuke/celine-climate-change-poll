"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AppState } from "./types";
import { Locale } from "@/i18n/config";

export const useAppStore = create(
  devtools<AppState>(
    (set) => ({
      data: {
        locale: "tr" as Locale,
      },
      setLocale: (locale) =>
        set((state) => ({ data: { ...state.data, locale } })),
    }),
    { name: "AppStore", serialize: { options: false } }
  )
);
