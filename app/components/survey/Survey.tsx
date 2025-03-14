"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { QuestionComponent } from "./QuestionTypes";
import { SurveyData, Answer, I18nText } from "./types";
import { hasTakenSurvey, markSurveyAsTaken } from "./utils";
import { useConfetti } from "@/app/hooks/useConfetti";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import SurveyCompleted from "@/components/survey-completed";

interface SurveyProps {
  survey: SurveyData;
  onSubmit: (answers: Answer[]) => Promise<void>;
}

export const Survey: React.FC<SurveyProps> = ({ survey, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const locale = useLocale();
  const t = useTranslations("survey");
  const { fireConfetti } = useConfetti();

  const sortedQuestions = survey.questions.sort((a, b) => a.order - b.order);
  const currentQuestion = sortedQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === sortedQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const progress = ((currentQuestionIndex + 1) / sortedQuestions.length) * 100;

  const form = useForm<Record<string, string | number | string[]>>({
    defaultValues: {},
    mode: "onChange",
  });

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const value = form.getValues(currentQuestion.id);
    if (!value) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  };

  // Check if current question is valid to proceed
  const canProceed = !currentQuestion.required || isCurrentQuestionAnswered();

  // Check if user has already taken the survey
  if (hasTakenSurvey(survey.id)) {
    return <SurveyCompleted />;
  }

  const handleNext = () => {
    const questionId = currentQuestion.id;
    const value = form.getValues(questionId);

    if (currentQuestion.required && !value) {
      form.setError(questionId, {
        type: "required",
        message: t("required"),
      });
      return;
    }

    if (currentQuestionIndex < sortedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the last question is answered
    if (!isCurrentQuestionAnswered()) {
      form.setError(currentQuestion.id, {
        type: "required",
        message: t("required"),
      });
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      const formData = form.getValues();

      // Format answers for submission
      const formattedAnswers: Answer[] = Object.entries(formData)
        .filter(([, value]) => value !== undefined && value !== null) // Filter out empty answers
        .map(([questionId, value]) => {
          const question = sortedQuestions.find((q) => q.id === questionId);
          if (!question)
            throw new Error(t("errors.questionNotFound", { id: questionId }));

          if (question.type === "RATING") {
            return {
              questionId,
              ratingValue: Number(value),
            };
          } else if (question.type === "MULTIPLE_CHOICE") {
            const selectedValues = Array.isArray(value) ? value : [value];
            return {
              questionId,
              optionId: selectedValues[0]?.toString(),
            };
          } else {
            return {
              questionId,
              optionId: String(value),
            };
          }
        });

      if (formattedAnswers.length === 0) {
        setError(t("validateAllRequired"));
        return;
      }

      await onSubmit(formattedAnswers);
      markSurveyAsTaken(survey.id);
      setSubmitted(true);
      fireConfetti();
    } catch (err) {
      console.error("Survey submission error:", err);
      setError(t("submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return <SurveyCompleted />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-12">
        <Card className="shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-2xl sm:text-3xl text-center">
              {survey.titleI18n[locale as keyof I18nText]}
            </CardTitle>
            {survey.descriptionI18n && (
              <CardDescription className="text-base sm:text-lg text-center mt-2">
                {survey.descriptionI18n[locale as keyof I18nText]}
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        <div className="space-y-10">
          <div className="relative px-1">
            <Progress value={progress} className="h-2" />
            <span className="absolute right-0 top-4 text-xs sm:text-sm text-gray-500">
              {t("question", {
                current: currentQuestionIndex + 1,
                total: sortedQuestions.length,
              })}
            </span>
          </div>

          {error && (
            <Alert variant="destructive" className="mx-1">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <Card
                className={cn(
                  "transition-all duration-300 transform shadow-sm",
                  form.formState.errors[currentQuestion.id] &&
                    "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,1)]"
                )}
              >
                <CardHeader className="pb-2 sm:pb-4 p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl leading-tight">
                    {currentQuestion.textI18n[locale as keyof I18nText]}
                    {currentQuestion.required && (
                      <span className="text-red-500 text-base sm:text-lg ml-1 align-top">
                        *
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-2 sm:pt-4">
                  <FormField
                    control={form.control}
                    name={currentQuestion.id}
                    rules={{ required: currentQuestion.required }}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <QuestionComponent
                            question={currentQuestion}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage className="text-sm mt-2" />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between p-4 sm:p-6 pt-4 sm:pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isFirstQuestion}
                    className="min-w-[90px] sm:w-[100px] text-sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("buttons.back")}
                  </Button>
                  {isLastQuestion ? (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !canProceed}
                      className={cn(
                        "min-w-[90px] sm:w-[100px] text-sm",
                        !canProceed && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isSubmitting
                        ? t("buttons.submitting")
                        : t("buttons.submit")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceed}
                      className={cn(
                        "min-w-[90px] sm:w-[100px] text-sm",
                        !canProceed && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {t("buttons.next")}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
