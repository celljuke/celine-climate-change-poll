import { prisma } from "@/lib/prisma";
import {
  SurveyData,
  Answer,
  I18nText,
  SurveyResults,
} from "@/app/components/survey/types";

export async function getSurvey(surveyId: string): Promise<SurveyData | null> {
  const survey = await prisma.survey.findUnique({
    where: { id: surveyId },
    include: {
      questions: {
        include: {
          options: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!survey) return null;

  return {
    id: survey.id,
    titleI18n: survey.titleI18n as unknown as I18nText,
    descriptionI18n: survey.descriptionI18n
      ? (survey.descriptionI18n as unknown as I18nText)
      : undefined,
    questions: survey.questions.map((q) => ({
      id: q.id,
      textI18n: q.textI18n as unknown as I18nText,
      type: q.type,
      required: q.required,
      order: q.order,
      options: q.options.map((o) => ({
        id: o.id,
        textI18n: o.textI18n as unknown as I18nText,
        order: o.order,
      })),
    })),
  };
}

export async function submitSurveyResponse(
  surveyId: string,
  answers: Answer[]
): Promise<void> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const response = await fetch(`${origin}/api/surveys/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      surveyId,
      answers,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit survey");
  }
}

export async function getSurveyResults(
  surveyId: string
): Promise<SurveyResults> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const response = await fetch(
    `${origin}/api/surveys/results?surveyId=${surveyId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch survey results");
  }

  return response.json();
}
