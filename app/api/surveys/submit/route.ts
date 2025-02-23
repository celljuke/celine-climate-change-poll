import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Answer } from "@/app/components/survey/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { surveyId, answers } = body as {
      surveyId: string;
      answers: Answer[];
    };

    // Create a new response
    const response = await prisma.response.create({
      data: {
        surveyId,
        answers: {
          create: answers.map((answer) => ({
            questionId: answer.questionId,
            optionId: answer.optionId,
            ratingValue: answer.ratingValue,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, responseId: response.id });
  } catch (error) {
    console.error("Survey submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit survey" },
      { status: 500 }
    );
  }
}
