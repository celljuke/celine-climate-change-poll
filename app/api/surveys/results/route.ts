import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { QuestionType } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const surveyId = searchParams.get("surveyId");

    if (!surveyId) {
      return NextResponse.json(
        { error: "Survey ID is required" },
        { status: 400 }
      );
    }

    // Get the survey with questions and options
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

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    // Get all responses for this survey
    const responses = await prisma.response.findMany({
      where: { surveyId },
      include: {
        answers: {
          include: {
            option: true,
          },
        },
      },
    });

    // Calculate total responses
    const totalResponses = responses.length;

    // Process each question to get aggregated data
    const results = await Promise.all(
      survey.questions.map(async (question) => {
        // Get all answers for this question
        const questionAnswers = responses.flatMap((response) =>
          response.answers.filter((answer) => answer.questionId === question.id)
        );

        // Process based on question type
        if (question.type === QuestionType.RATING) {
          // For rating questions, count occurrences of each rating value
          const ratingCounts = Array.from({ length: 5 }, (_, i) => i + 1).map(
            (rating) => ({
              value: rating,
              count: questionAnswers.filter(
                (answer) => answer.ratingValue === rating
              ).length,
            })
          );

          // Calculate average rating
          const totalRating = questionAnswers.reduce(
            (sum, answer) => sum + (answer.ratingValue || 0),
            0
          );
          const averageRating =
            questionAnswers.length > 0
              ? totalRating / questionAnswers.length
              : 0;

          return {
            id: question.id,
            textI18n: question.textI18n,
            type: question.type,
            order: question.order,
            totalAnswers: questionAnswers.length,
            data: {
              ratingCounts,
              averageRating,
            },
          };
        } else if (
          question.type === QuestionType.SINGLE_CHOICE ||
          question.type === QuestionType.MULTIPLE_CHOICE
        ) {
          // For choice questions, count occurrences of each option
          const optionCounts = question.options.map((option) => ({
            id: option.id,
            textI18n: option.textI18n,
            count: questionAnswers.filter(
              (answer) => answer.optionId === option.id
            ).length,
          }));

          return {
            id: question.id,
            textI18n: question.textI18n,
            type: question.type,
            order: question.order,
            totalAnswers: questionAnswers.length,
            data: {
              optionCounts,
            },
          };
        }

        return {
          id: question.id,
          textI18n: question.textI18n,
          type: question.type,
          order: question.order,
          totalAnswers: questionAnswers.length,
          data: {},
        };
      })
    );

    return NextResponse.json({
      surveyId,
      surveyTitle: survey.titleI18n,
      surveyDescription: survey.descriptionI18n,
      totalResponses,
      results,
    });
  } catch (error) {
    console.error("Error fetching survey results:", error);
    return NextResponse.json(
      { error: "Failed to fetch survey results" },
      { status: 500 }
    );
  }
}
