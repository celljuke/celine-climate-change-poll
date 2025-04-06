"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { getSurveyResults } from "../services/survey";
import { SurveyResults, QuestionResult } from "../components/survey/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { I18nText } from "@/app/components/survey/types";
import { motion } from "motion/react";
import {
  Thermometer,
  Leaf,
  Lightbulb,
  Recycle,
  Bike,
  Trees,
  BookOpen,
  Globe,
  Users,
  School,
  Heart,
  AlertTriangle,
  HelpCircle,
  CheckCircle,
  Home,
} from "lucide-react";

// Color palette for charts
const COLORS = [
  "#FF6B6B", // coral
  "#4ECDC4", // turquoise
  "#FFD93D", // yellow
  "#6C5CE7", // purple
  "#A8E6CF", // mint
  "#FF8B94", // pink
  "#45B7D1", // blue
  "#96CEB4", // green
  "#FFEEAD", // cream
  "#D4A5A5", // rose
];

// Icons for different question types
const QUESTION_ICONS: Record<string, React.ReactNode> = {
  "How worried are you about climate change?": (
    <Thermometer className="h-5 w-5" />
  ),
  "How often do you talk about climate change with your family?": (
    <Users className="h-5 w-5" />
  ),
  "Which of these have you noticed in your area?": (
    <AlertTriangle className="h-5 w-5" />
  ),
  "How important do you think it is to learn about climate change in school?": (
    <School className="h-5 w-5" />
  ),
  "Which of these do you do at home?": <Home className="h-5 w-5" />,
  "How do you usually get to school?": <Bike className="h-5 w-5" />,
  "How interested are you in learning more about protecting the environment?": (
    <Leaf className="h-5 w-5" />
  ),
  "Which environmental topics would you like to learn more about?": (
    <BookOpen className="h-5 w-5" />
  ),
  "How often do you spend time in nature?": <Trees className="h-5 w-5" />,
  "How confident do you feel about explaining climate change to a friend?": (
    <Heart className="h-5 w-5" />
  ),
  "Which of these climate change effects worry you the most?": (
    <AlertTriangle className="h-5 w-5" />
  ),
  "How do you feel when you learn about ways to help the environment?": (
    <CheckCircle className="h-5 w-5" />
  ),
  "Which of these do you think are good solutions for climate change?": (
    <Lightbulb className="h-5 w-5" />
  ),
  "How often do you learn about climate change from these sources?": (
    <Globe className="h-5 w-5" />
  ),
  "How important is recycling to you?": <Recycle className="h-5 w-5" />,
};

// Helper function to get text in current locale
const getLocalizedText = (text: I18nText, locale: string): string => {
  return text[locale as keyof I18nText] || text.en;
};

// Helper function to format percentage
const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
};

// Helper function to generate insights based on question results
const generateInsights = (result: QuestionResult, locale: string): string[] => {
  const insights: string[] = [];
  const questionText = getLocalizedText(result.textI18n, locale);

  if (result.type === "RATING") {
    const { ratingCounts, averageRating } = result.data;
    if (!ratingCounts || averageRating === undefined) return insights;

    // Find the most common rating
    const mostCommonRating = [...ratingCounts].sort(
      (a, b) => b.count - a.count
    )[0];

    // Generate insights based on the question
    if (questionText.includes("worried")) {
      if (averageRating >= 4) {
        insights.push(
          `**${formatPercentage(
            mostCommonRating.count,
            result.totalAnswers
          )}** of respondents are very worried about climate change.`
        );
        insights.push(
          `The average concern level is **${averageRating.toFixed(
            1
          )}** out of 5, indicating high awareness.`
        );
      } else if (averageRating >= 3) {
        insights.push(
          `The average concern level is **${averageRating.toFixed(
            1
          )}** out of 5, showing moderate awareness.`
        );
      } else {
        insights.push(
          `The average concern level is **${averageRating.toFixed(
            1
          )}** out of 5, suggesting that awareness could be improved.`
        );
      }
    } else if (questionText.includes("important")) {
      if (averageRating >= 4) {
        insights.push(
          `**${formatPercentage(
            mostCommonRating.count,
            result.totalAnswers
          )}** of respondents think learning about climate change in school is very important.`
        );
        insights.push(
          `The average importance rating is **${averageRating.toFixed(
            1
          )}** out of 5, showing strong support for climate education.`
        );
      } else {
        insights.push(
          `The average importance rating is **${averageRating.toFixed(
            1
          )}** out of 5 for learning about climate change in school.`
        );
      }
    } else if (questionText.includes("interested")) {
      if (averageRating >= 4) {
        insights.push(
          `**${formatPercentage(
            mostCommonRating.count,
            result.totalAnswers
          )}** of respondents are very interested in learning more about protecting the environment.`
        );
        insights.push(
          `The average interest level is **${averageRating.toFixed(
            1
          )}** out of 5, indicating high engagement potential.`
        );
      } else {
        insights.push(
          `The average interest level is **${averageRating.toFixed(
            1
          )}** out of 5 for learning more about environmental protection.`
        );
      }
    } else if (questionText.includes("confident")) {
      if (averageRating >= 4) {
        insights.push(
          `**${formatPercentage(
            mostCommonRating.count,
            result.totalAnswers
          )}** of respondents feel very confident explaining climate change to others.`
        );
        insights.push(
          `The average confidence level is **${averageRating.toFixed(
            1
          )}** out of 5, showing strong knowledge.`
        );
      } else if (averageRating <= 2) {
        insights.push(
          `The average confidence level is **${averageRating.toFixed(
            1
          )}** out of 5, suggesting that more education on climate change is needed.`
        );
      } else {
        insights.push(
          `The average confidence level is **${averageRating.toFixed(
            1
          )}** out of 5 for explaining climate change to others.`
        );
      }
    }
  } else if (result.type === "SINGLE_CHOICE") {
    const { optionCounts } = result.data;
    if (!optionCounts) return insights;

    // Find the most common option
    const mostCommonOption = [...optionCounts].sort(
      (a, b) => b.count - a.count
    )[0];
    const mostCommonText = getLocalizedText(mostCommonOption.textI18n, locale);

    // Generate insights based on the question
    if (questionText.includes("talk about climate change")) {
      insights.push(
        `**${formatPercentage(
          mostCommonOption.count,
          result.totalAnswers
        )}** of respondents ${mostCommonText.toLowerCase()} talk about climate change with their family.`
      );

      if (mostCommonText === "Very often" || mostCommonText === "Often") {
        insights.push(
          `This indicates that climate change is a regular topic of discussion in many households.`
        );
      } else if (mostCommonText === "Never") {
        insights.push(
          `This suggests an opportunity to encourage more family discussions about climate change.`
        );
      }
    } else if (questionText.includes("get to school")) {
      insights.push(
        `**${formatPercentage(
          mostCommonOption.count,
          result.totalAnswers
        )}** of respondents usually ${mostCommonText.toLowerCase()} to school.`
      );

      if (mostCommonText === "Walk" || mostCommonText === "Bicycle") {
        insights.push(
          `This is encouraging as active transportation reduces carbon emissions.`
        );
      } else if (mostCommonText === "Car") {
        insights.push(
          `This highlights an area where sustainable transportation options could be promoted.`
        );
      }
    } else if (questionText.includes("spend time in nature")) {
      insights.push(
        `**${formatPercentage(
          mostCommonOption.count,
          result.totalAnswers
        )}** of respondents ${mostCommonText.toLowerCase()} spend time in nature.`
      );

      if (
        mostCommonText === "Every day" ||
        mostCommonText === "A few times a week"
      ) {
        insights.push(
          `This strong connection to nature can foster environmental stewardship.`
        );
      } else if (mostCommonText === "Rarely") {
        insights.push(
          `Increasing time in nature could help strengthen environmental awareness.`
        );
      }
    } else if (questionText.includes("feel when you learn")) {
      insights.push(
        `**${formatPercentage(
          mostCommonOption.count,
          result.totalAnswers
        )}** of respondents feel ${mostCommonText.toLowerCase()} when learning about ways to help the environment.`
      );

      if (mostCommonText === "Very excited" || mostCommonText === "Hopeful") {
        insights.push(
          `This positive emotional response is encouraging for environmental education efforts.`
        );
      } else if (mostCommonText === "Confused") {
        insights.push(
          `This suggests a need for clearer communication about environmental actions.`
        );
      }
    }
  } else if (result.type === "MULTIPLE_CHOICE") {
    const { optionCounts } = result.data;
    if (!optionCounts) return insights;

    // Sort options by count
    const sortedOptions = [...optionCounts].sort((a, b) => b.count - a.count);

    // Get the top 2-3 options
    const topOptions = sortedOptions.slice(0, 3);

    // Generate insights based on the question
    if (questionText.includes("noticed in your area")) {
      insights.push(
        `The most commonly noticed climate change effects in respondents' areas are:`
      );
      topOptions.forEach((option) => {
        const optionText = getLocalizedText(option.textI18n, locale);
        insights.push(
          `- **${optionText}** (${formatPercentage(
            option.count,
            result.totalAnswers
          )})`
        );
      });
    } else if (questionText.includes("do at home")) {
      insights.push(`The most common environmental actions taken at home are:`);
      topOptions.forEach((option) => {
        const optionText = getLocalizedText(option.textI18n, locale);
        insights.push(
          `- **${optionText}** (${formatPercentage(
            option.count,
            result.totalAnswers
          )})`
        );
      });
    } else if (questionText.includes("environmental topics")) {
      insights.push(
        `The environmental topics respondents are most interested in learning about are:`
      );
      topOptions.forEach((option) => {
        const optionText = getLocalizedText(option.textI18n, locale);
        insights.push(
          `- **${optionText}** (${formatPercentage(
            option.count,
            result.totalAnswers
          )})`
        );
      });
    } else if (questionText.includes("climate change effects worry")) {
      insights.push(
        `The climate change effects that worry respondents the most are:`
      );
      topOptions.forEach((option) => {
        const optionText = getLocalizedText(option.textI18n, locale);
        insights.push(
          `- **${optionText}** (${formatPercentage(
            option.count,
            result.totalAnswers
          )})`
        );
      });
    } else if (questionText.includes("good solutions for climate change")) {
      insights.push(
        `The solutions respondents think are most effective for climate change are:`
      );
      topOptions.forEach((option) => {
        const optionText = getLocalizedText(option.textI18n, locale);
        insights.push(
          `- **${optionText}** (${formatPercentage(
            option.count,
            result.totalAnswers
          )})`
        );
      });
    } else if (
      questionText.includes("learn about climate change from these sources")
    ) {
      insights.push(
        `The most common sources for learning about climate change are:`
      );
      topOptions.forEach((option) => {
        const optionText = getLocalizedText(option.textI18n, locale);
        insights.push(
          `- **${optionText}** (${formatPercentage(
            option.count,
            result.totalAnswers
          )})`
        );
      });
    }
  }

  return insights;
};

// Component to render a rating question result
const RatingQuestionResult = ({
  result,
  locale,
}: {
  result: QuestionResult;
  locale: string;
}) => {
  const { ratingCounts, averageRating } = result.data;
  if (!ratingCounts || averageRating === undefined) return null;

  const questionText = getLocalizedText(result.textI18n, locale);

  // Prepare data for the chart
  const chartData = ratingCounts.map((item) => ({
    name: item.value.toString(),
    value: item.count,
    percentage: formatPercentage(item.count, result.totalAnswers),
    color: COLORS[parseInt(item.value.toString()) - 1] || COLORS[0],
  }));

  // Calculate insights
  const insights = generateInsights(result, locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        {QUESTION_ICONS[questionText] || <Thermometer className="h-5 w-5" />}
        <h3 className="text-xl font-bold">{questionText}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                "1": { color: COLORS[0] },
                "2": { color: COLORS[1] },
                "3": { color: COLORS[2] },
                "4": { color: COLORS[3] },
                "5": { color: COLORS[4] },
              }}
            >
              <BarChart
                data={chartData}
                margin={{
                  top: 12,
                  right: 12,
                  left: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => [
                        `${props.payload.percentage} (${value} responses)`,
                        `Rating ${name}`,
                      ]}
                    />
                  }
                />
                <Bar dataKey="value" fill="#8884d8">
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <div className="text-6xl font-bold text-primary mb-4">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-xl text-muted-foreground">out of 5</div>
            <div className="mt-8 space-y-2">
              {insights.map((insight) => (
                <p
                  key={insight}
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: insight }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

// Component to render a single choice question result
const SingleChoiceQuestionResult = ({
  result,
  locale,
}: {
  result: QuestionResult;
  locale: string;
}) => {
  const { optionCounts } = result.data;
  if (!optionCounts) return null;

  const questionText = getLocalizedText(result.textI18n, locale);

  // Prepare data for the chart
  const chartData = optionCounts.map((option) => ({
    name: getLocalizedText(option.textI18n, locale),
    value: option.count,
    percentage: formatPercentage(option.count, result.totalAnswers),
    color: COLORS[optionCounts.indexOf(option) % COLORS.length],
  }));

  // Calculate insights
  const insights = generateInsights(result, locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        {QUESTION_ICONS[questionText] || <HelpCircle className="h-5 w-5" />}
        <h3 className="text-xl font-bold">{questionText}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartData.reduce((acc, item) => {
                acc[item.name] = { color: item.color };
                return acc;
              }, {} as Record<string, { color: string }>)}
            >
              <PieChart
                margin={{
                  top: 12,
                  right: 12,
                  left: 12,
                  bottom: 12,
                }}
              >
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => [
                        `${props.payload.percentage} (${value} responses)`,
                        name,
                      ]}
                    />
                  }
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent className="h-64 overflow-y-auto">
            <div className="space-y-2">
              {insights.map((insight) => (
                <p
                  key={insight}
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: insight }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

// Component to render a multiple choice question result
const MultipleChoiceQuestionResult = ({
  result,
  locale,
}: {
  result: QuestionResult;
  locale: string;
}) => {
  const { optionCounts } = result.data;
  if (!optionCounts) return null;

  const questionText = getLocalizedText(result.textI18n, locale);

  // Prepare data for the chart
  const chartData = optionCounts
    .map((option) => ({
      name: getLocalizedText(option.textI18n, locale),
      value: option.count,
      percentage: formatPercentage(option.count, result.totalAnswers),
      color: COLORS[optionCounts.indexOf(option) % COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);

  // Calculate insights
  const insights = generateInsights(result, locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        {QUESTION_ICONS[questionText] || <HelpCircle className="h-5 w-5" />}
        <h3 className="text-xl font-bold">{questionText}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartData.reduce((acc, item) => {
                acc[item.name] = { color: item.color };
                return acc;
              }, {} as Record<string, { color: string }>)}
            >
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{
                  top: 12,
                  right: 12,
                  left: 150,
                  bottom: 12,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => [
                        `${props.payload.percentage} (${value} responses)`,
                        name,
                      ]}
                    />
                  }
                />
                <Bar dataKey="value" fill="#8884d8">
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent className="h-64 overflow-y-auto">
            <div className="space-y-2">
              {insights.map((insight) => (
                <p
                  key={insight}
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: insight }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

// Component to render a question result based on its type
const QuestionResultComponent = ({
  result,
  locale,
}: {
  result: QuestionResult;
  locale: string;
}) => {
  switch (result.type) {
    case "RATING":
      return <RatingQuestionResult result={result} locale={locale} />;
    case "SINGLE_CHOICE":
      return <SingleChoiceQuestionResult result={result} locale={locale} />;
    case "MULTIPLE_CHOICE":
      return <MultipleChoiceQuestionResult result={result} locale={locale} />;
    default:
      return null;
  }
};

export default function ResultsClient() {
  const [results, setResults] = useState<SurveyResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Replace with your actual survey ID
        const surveyId = "cm7816jy70000jxzkje5q9p4y";
        const data = await getSurveyResults(surveyId);
        setResults(data);
      } catch (err) {
        setError("Failed to load survey results");
        console.error("Error loading survey results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-gray-500">No results found</div>
      </div>
    );
  }

  const surveyTitle = getLocalizedText(results.surveyTitle, locale);
  const surveyDescription = results.surveyDescription
    ? getLocalizedText(results.surveyDescription, locale)
    : "";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {surveyTitle} - Results
            </h1>
            {surveyDescription && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {surveyDescription}
              </p>
            )}
            <div className="text-xl font-semibold text-primary">
              Total Responses:{" "}
              <span className="font-bold">{results.totalResponses}</span>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Questions</TabsTrigger>
              <TabsTrigger value="rating">Rating Questions</TabsTrigger>
              <TabsTrigger value="choice">Choice Questions</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-12 mt-8">
              {results.results.map((result) => (
                <QuestionResultComponent
                  key={result.id}
                  result={result}
                  locale={locale}
                />
              ))}
            </TabsContent>

            <TabsContent value="rating" className="space-y-12 mt-8">
              {results.results
                .filter((result) => result.type === "RATING")
                .map((result) => (
                  <QuestionResultComponent
                    key={result.id}
                    result={result}
                    locale={locale}
                  />
                ))}
            </TabsContent>

            <TabsContent value="choice" className="space-y-12 mt-8">
              {results.results
                .filter(
                  (result) =>
                    result.type === "SINGLE_CHOICE" ||
                    result.type === "MULTIPLE_CHOICE"
                )
                .map((result) => (
                  <QuestionResultComponent
                    key={result.id}
                    result={result}
                    locale={locale}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </main>
  );
}
