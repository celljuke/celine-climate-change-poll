"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
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
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Create validation schema based on required questions
  const requiredFields = survey.questions.reduce((acc, question) => {
    if (question.required) {
      acc[question.id] = {
        required: `${question.textI18n[locale as keyof I18nText]} is required`,
      };
    }
    return acc;
  }, {} as Record<string, { required: string }>);

  const form = useForm<Record<string, string | number | string[]>>({
    defaultValues: {},
    mode: "onChange", // Enable real-time validation
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
        unansweredRequired.forEach((question) => {
          form.setError(question, {
            type: "required",
            message: "This question requires an answer",
          });
        });
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
              optionId: (value as string[])[0],
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

  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {survey.titleI18n[locale as keyof I18nText]}
          </CardTitle>
          {survey.descriptionI18n && (
            <CardDescription className="text-base">
              {survey.descriptionI18n[locale as keyof I18nText]}
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {survey.questions
            .sort((a, b) => a.order - b.order)
            .map((question) => (
              <Card
                key={question.id}
                className={cn(
                  "transition-all duration-200",
                  form.formState.errors[question.id] &&
                    "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,1)]"
                )}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-start gap-2">
                    <span>{question.textI18n[locale as keyof I18nText]}</span>
                    {question.required && (
                      <span className="text-red-500 text-sm leading-tight">
                        *
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name={question.id}
                    rules={requiredFields[question.id]}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <QuestionComponent
                            question={question}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage className="text-sm mt-2" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}

          {hasErrors && !form.formState.isSubmitted && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please answer all required questions marked with an asterisk
                (*).
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            variant="default"
            size="lg"
          >
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
