"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { QuestionComponent } from "./QuestionTypes";
import { SurveyData, Answer, I18nText } from "./types";
import { hasTakenSurvey, markSurveyAsTaken } from "./utils";

interface SurveyProps {
  survey: SurveyData;
  onSubmit: (answers: Answer[]) => Promise<void>;
}

export const Survey: React.FC<SurveyProps> = ({ survey, onSubmit }) => {
  const [answers, setAnswers] = useState<
    Record<string, string | number | string[]>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const locale = useLocale();
  // Check if user has already taken the survey
  if (hasTakenSurvey(survey.id)) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-center text-gray-600">
          Thank you for your participation. You have already completed this
          survey.
        </p>
      </div>
    );
  }

  const handleQuestionChange = (
    questionId: string,
    value: string | number | string[]
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required questions
      const unansweredRequired = survey.questions
        .filter((q) => q.required && !answers[q.id])
        .map((q) => q.textI18n[locale as keyof I18nText]);

      if (unansweredRequired.length > 0) {
        setError(
          `Please answer the following required questions: ${unansweredRequired.join(
            ", "
          )}`
        );
        setIsSubmitting(false);
        return;
      }

      // Format answers for submission
      const formattedAnswers: Answer[] = Object.entries(answers).map(
        ([questionId, value]) => {
          const question = survey.questions.find((q) => q.id === questionId);
          if (!question) throw new Error(`Question ${questionId} not found`);

          if (question.type === "RATING") {
            return {
              questionId,
              ratingValue: value as number,
            };
          } else if (question.type === "MULTIPLE_CHOICE") {
            return {
              questionId,
              optionId: (value as string[])[0], // Take first selected option
            };
          } else {
            return {
              questionId,
              optionId: value as string,
            };
          }
        }
      );

      await onSubmit(formattedAnswers);
      markSurveyAsTaken(survey.id);
      setSubmitted(true);
    } catch (err) {
      setError(
        "An error occurred while submitting the survey. Please try again."
      );
      console.error("Survey submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 bg-green-50 rounded-lg">
        <p className="text-center text-green-600">
          Thank you for completing the survey! Your responses have been
          recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">
        {survey.titleI18n[locale as keyof I18nText]}
      </h1>
      {survey.descriptionI18n && (
        <p className="text-gray-600 mb-6">
          {survey.descriptionI18n[locale as keyof I18nText]}
        </p>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {survey.questions
          .sort((a, b) => a.order - b.order)
          .map((question) => (
            <div key={question.id} className="border p-4 rounded">
              <p className="font-medium mb-2">
                {question.textI18n[locale as keyof I18nText]}
                {question.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </p>
              <QuestionComponent
                question={question}
                value={answers[question.id]}
                onChange={(value) => handleQuestionChange(question.id, value)}
              />
            </div>
          ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white font-medium`}
        >
          {isSubmitting ? "Submitting..." : "Submit Survey"}
        </button>
      </form>
    </div>
  );
};
