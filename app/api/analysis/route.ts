import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { questionText, totalResponses, data, type } = await req.json();

  let prompt = `Analyze the following survey results about climate change and provide insights in a conversational tone:

Question: "${questionText}"
Total Responses: ${totalResponses}
`;

  if (type === "RATING") {
    const { ratingCounts, averageRating } = data;
    prompt += `\nAverage Rating: ${averageRating} out of 5\nRating Distribution:\n`;
    ratingCounts?.forEach((count: { value: number; count: number }) => {
      const percentage = Math.round((count.count / totalResponses) * 100);
      prompt += `Rating ${count.value}: ${count.count} responses (${percentage}%)\n`;
    });
  } else {
    const { optionCounts } = data;
    prompt += "\nResponse Distribution:\n";
    optionCounts?.forEach(
      (option: { textI18n: Record<string, string>; count: number }) => {
        const percentage = Math.round((option.count / totalResponses) * 100);
        prompt += `${option.textI18n.en}: ${option.count} responses (${percentage}%)\n`;
      }
    );
  }

  prompt +=
    "\nPlease provide a brief analysis of these results with same language as the question, including any notable patterns, implications, and suggestions for action. Keep the response under 150 words.";

  const result = await generateText({
    model: openai("gpt-3.5-turbo"),
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return new Response(result.text);
}
