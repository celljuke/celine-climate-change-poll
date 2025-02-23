"use client";

import { QuestionType } from "@prisma/client";
import { QuestionData, OptionData, I18nText } from "./types";
import { useLocale } from "next-intl";
interface QuestionProps {
  question: QuestionData;
  onChange: (value: string | number | string[]) => void;
  value?: string | number | string[];
}

export const SingleChoiceQuestion: React.FC<QuestionProps> = ({
  question,
  onChange,
  value,
}) => {
  const locale = useLocale();
  return (
    <div className="space-y-2">
      {question.options.map((option: OptionData) => (
        <label key={option.id} className="flex items-center space-x-2">
          <input
            type="radio"
            name={question.id}
            value={option.id}
            checked={value === option.id}
            onChange={(e) => onChange(e.target.value)}
            className="form-radio"
          />
          <span>{option.textI18n[locale as keyof I18nText]}</span>
        </label>
      ))}
    </div>
  );
};

export const MultipleChoiceQuestion: React.FC<QuestionProps> = ({
  question,
  onChange,
  value,
}) => {
  const selectedValues = (value as string[]) || [];

  const handleChange = (optionId: string) => {
    const newValues = selectedValues.includes(optionId)
      ? selectedValues.filter((v) => v !== optionId)
      : [...selectedValues, optionId];
    onChange(newValues);
  };

  const locale = useLocale();

  return (
    <div className="space-y-2">
      {question.options.map((option: OptionData) => (
        <label key={option.id} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedValues.includes(option.id)}
            onChange={() => handleChange(option.id)}
            className="form-checkbox"
          />
          <span>{option.textI18n[locale as keyof I18nText]}</span>
        </label>
      ))}
    </div>
  );
};

export const RatingQuestion: React.FC<QuestionProps> = ({
  question,
  onChange,
  value,
}) => {
  const ratings = [1, 2, 3, 4, 5];

  return (
    <div className="flex space-x-4">
      {ratings.map((rating) => (
        <label key={rating} className="flex flex-col items-center">
          <input
            type="radio"
            name={question.id}
            value={rating}
            checked={value === rating}
            onChange={(e) => onChange(Number(e.target.value))}
            className="form-radio"
          />
          <span>{rating}</span>
        </label>
      ))}
    </div>
  );
};

export const QuestionComponent: React.FC<QuestionProps> = (props) => {
  const { question } = props;

  switch (question.type) {
    case QuestionType.SINGLE_CHOICE:
      return <SingleChoiceQuestion {...props} />;
    case QuestionType.MULTIPLE_CHOICE:
      return <MultipleChoiceQuestion {...props} />;
    case QuestionType.RATING:
      return <RatingQuestion {...props} />;
    default:
      return <div>Unsupported question type</div>;
  }
};
