import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { questionText, totalResponses, data, type, locale } = await req.json();

  // Determine the language for the response
  const languagePrompt =
    locale === "tr"
      ? "Please analyze the following survey results and provide insights in Turkish (Türkçe) language in a conversational tone:"
      : "Please analyze the following survey results and provide insights in English in a conversational tone:";

  let prompt = `${languagePrompt}

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
        // Use the localized text for options as well
        const optionText =
          locale in option.textI18n
            ? option.textI18n[locale]
            : option.textI18n.en;
        prompt += `${optionText}: ${option.count} responses (${percentage}%)\n`;
      }
    );
  }

  prompt +=
    locale === "tr"
      ? "\nLütfen bu sonuçları analiz ederek, önemli örüntüleri, çıkarımları ve eylem önerilerini belirtin. Yanıt 100 kelimeyi geçmemelidir. Bu analizler 10 yaşındaki bir öğrencinin hazırlayabileceği düzeyde olmalıdır."
      : "\nPlease provide a brief analysis of these results, including any notable patterns, implications, and suggestions for action. Keep the response under 100 words. These analyses should be at a level that a 10-year-old can prepare.";

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return new Response(result.text);
}
