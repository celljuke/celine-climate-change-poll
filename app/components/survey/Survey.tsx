"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { QuestionComponent } from "./QuestionTypes";
import { SurveyData, Answer, I18nText } from "./types";
import { hasTakenSurvey, markSurveyAsTaken } from "./utils";
import { useConfetti } from "@/app/hooks/useConfetti";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface SurveyProps {
  survey: SurveyData;
  onSubmit: (answers: Answer[]) => Promise<void>;
}

export const Survey: React.FC<SurveyProps> = ({ survey, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const locale = useLocale();
  const { fireConfetti } = useConfetti();

  const form = useForm<Record<string, string | number | string[]>>({
    defaultValues: {},
  });

  // Check if user has already taken the survey
  if (hasTakenSurvey(survey.id)) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">
            Thank you for your participation. You have already completed this
            survey.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (
    data: Record<string, string | number | string[]>
  ) => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required questions
      const unansweredRequired = survey.questions
        .filter((q) => q.required && !data[q.id])
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
      const formattedAnswers: Answer[] = Object.entries(data).map(
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
      fireConfetti();
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
      <Card className="bg-green-50">
        <CardContent className="pt-6 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            🎉 Thank You! 🎉
          </h2>
          <p className="text-green-600">
            Your responses have been recorded. We appreciate your participation
            in making our planet a better place!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      <Card>
        <CardHeader>
          <CardTitle>{survey.titleI18n[locale as keyof I18nText]}</CardTitle>
          {survey.descriptionI18n && (
            <p className="text-gray-600">
              {survey.descriptionI18n[locale as keyof I18nText]}
            </p>
          )}
        </CardHeader>
      </Card>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {survey.questions
            .sort((a, b) => a.order - b.order)
            .map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {question.textI18n[locale as keyof I18nText]}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name={question.id}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <QuestionComponent
                            question={question}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            variant="default"
          >
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
