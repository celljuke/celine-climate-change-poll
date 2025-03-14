"use client";

import { Survey } from "../components/survey/Survey";
import { submitSurveyResponse } from "../services/survey";
import { getSurvey } from "../services/survey.server";
import { useEffect, useState } from "react";
import { SurveyData } from "../components/survey/types";

export default function ClientPage() {
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        // Replace with your actual survey ID
        const surveyData = await getSurvey("cm7816jy70000jxzkje5q9p4y");
        setSurvey(surveyData);
      } catch (err) {
        setError("Failed to load survey");
        console.error("Error loading survey:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-gray-500">Survey not found</div>
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Survey
          survey={survey}
          onSubmit={async (answers) => {
            await submitSurveyResponse(survey.id, answers);
          }}
        />
      </div>
    </main>
  );
}
