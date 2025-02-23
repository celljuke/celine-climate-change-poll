const SURVEY_RESPONSES_KEY = "survey_responses";

export const hasTakenSurvey = (surveyId: string): boolean => {
  if (typeof window === "undefined") return false;

  const responses = localStorage.getItem(SURVEY_RESPONSES_KEY);
  if (!responses) return false;

  const takenSurveys = JSON.parse(responses) as string[];
  return takenSurveys.includes(surveyId);
};

export const markSurveyAsTaken = (surveyId: string): void => {
  if (typeof window === "undefined") return;

  const responses = localStorage.getItem(SURVEY_RESPONSES_KEY);
  const takenSurveys = responses ? (JSON.parse(responses) as string[]) : [];

  if (!takenSurveys.includes(surveyId)) {
    takenSurveys.push(surveyId);
    localStorage.setItem(SURVEY_RESPONSES_KEY, JSON.stringify(takenSurveys));
  }
};
