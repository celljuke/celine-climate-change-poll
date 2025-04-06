import { Metadata } from "next";
import ResultsClient from "./client-page";

export const metadata: Metadata = {
  title: "Survey Results | Climate Change Survey",
  description:
    "View and analyze the results of the Climate Change Survey for Young Scientists",
};

export default function ResultsPage() {
  return <ResultsClient />;
}
