import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import ClientPage from "./client-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function GlobalWarmingPage() {
  return <ClientPage />;
}
