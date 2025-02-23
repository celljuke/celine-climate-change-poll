"use client";

import { QuestionType } from "@prisma/client";
import { QuestionData, OptionData, I18nText } from "./types";
import { useLocale } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
    <RadioGroup
      value={value as string}
      onValueChange={onChange}
      className="space-y-3"
    >
      {question.options.map((option: OptionData) => (
        <div key={option.id} className="flex items-center space-x-2">
          <RadioGroupItem value={option.id} id={option.id} />
          <Label htmlFor={option.id} className="text-sm font-normal">
            {option.textI18n[locale as keyof I18nText]}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export const MultipleChoiceQuestion: React.FC<QuestionProps> = ({
  question,
  onChange,
  value,
}) => {
  const selectedValues = (value as string[]) || [];
  const locale = useLocale();

  const handleChange = (checked: boolean, optionId: string) => {
    const newValues = checked
      ? [...selectedValues, optionId]
      : selectedValues.filter((v) => v !== optionId);
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      {question.options.map((option: OptionData) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox
            id={option.id}
            checked={selectedValues.includes(option.id)}
            onCheckedChange={(checked) =>
              handleChange(checked as boolean, option.id)
            }
          />
          <Label htmlFor={option.id} className="text-sm font-normal">
            {option.textI18n[locale as keyof I18nText]}
          </Label>
        </div>
      ))}
    </div>
  );
};

export const RatingQuestion: React.FC<QuestionProps> = ({
  onChange,
  value,
}) => {
  const ratings = [1, 2, 3, 4, 5];

  return (
    <RadioGroup
      value={value?.toString()}
      onValueChange={(val) => onChange(Number(val))}
      className="flex space-x-4"
    >
      {ratings.map((rating) => (
        <div key={rating} className="flex flex-col items-center space-y-1">
          <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
          <Label htmlFor={`rating-${rating}`} className="text-sm">
            {rating}
          </Label>
        </div>
      ))}
    </RadioGroup>
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
