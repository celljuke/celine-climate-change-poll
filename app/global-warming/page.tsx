"use client";

import { Survey } from "../components/survey/Survey";
import { submitSurveyResponse } from "../services/survey";
import { getSurvey } from "../services/survey.server";
import { useEffect, useState } from "react";
import { SurveyData } from "../components/survey/types";

export default function GlobalWarming() {
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Survey not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Survey
        survey={survey}
        onSubmit={async (answers) => {
          await submitSurveyResponse(survey.id, answers);
        }}
      />
    </div>
  );
}
