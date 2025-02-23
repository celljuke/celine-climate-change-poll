import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import ClientPage from "./client-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/cherry-logo.svg",
          width: 512,
          height: 512,
          alt: "Logo",
        },
      ],
    },
  };
}

export default function HomePage() {
  return <ClientPage />;
}
