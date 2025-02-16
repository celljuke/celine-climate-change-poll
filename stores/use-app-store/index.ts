"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AppState } from "./types";

export const useAppStore = create(
  devtools<AppState>(
    (set) => ({
      data: {
        locale: "tr",
      },
      setLocale: (locale) =>
        set((state) => ({ data: { ...state.data, locale } })),
    }),
    { name: "AppStore", serialize: { options: false } }
  )
);
