import { QuestionType } from "@prisma/client";

export interface I18nText {
  en: string;
  tr: string;
}

export interface SurveyData {
  id: string;
  titleI18n: I18nText;
  descriptionI18n?: I18nText;
  questions: QuestionData[];
}

export interface QuestionData {
  id: string;
  textI18n: I18nText;
  type: QuestionType;
  required: boolean;
  order: number;
  options: OptionData[];
}

export interface OptionData {
  id: string;
  textI18n: I18nText;
  order: number;
}

export interface SurveyResponse {
  surveyId: string;
  answers: Answer[];
}

export interface Answer {
  questionId: string;
  optionId?: string;
  ratingValue?: number;
}
