"use server";

import { prisma } from "@/lib/prisma";
import { SurveyData, I18nText } from "@/app/components/survey/types";

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
