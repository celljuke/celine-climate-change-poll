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
      className="space-y-4"
    >
      {question.options.map((option: OptionData) => (
        <div key={option.id} className="flex items-start space-x-3">
          <RadioGroupItem value={option.id} id={option.id} className="mt-0.5" />
          <Label
            htmlFor={option.id}
            className="text-sm sm:text-base font-normal leading-tight"
          >
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
  const locale = useLocale();
  const selectedValues = Array.isArray(value) ? value : [];

  const handleChange = (checked: boolean, optionId: string) => {
    if (checked) {
      onChange([...selectedValues, optionId]);
    } else {
      onChange(selectedValues.filter((v) => v !== optionId));
    }
  };

  return (
    <div className="space-y-4">
      {question.options.map((option: OptionData) => (
        <div key={option.id} className="flex items-start space-x-3">
          <Checkbox
            id={option.id}
            checked={selectedValues.includes(option.id)}
            onCheckedChange={(checked) =>
              handleChange(checked as boolean, option.id)
            }
            className="mt-0.5"
          />
          <Label
            htmlFor={option.id}
            className="text-sm sm:text-base font-normal leading-tight"
          >
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
      className="flex flex-wrap gap-6 justify-center sm:justify-start"
    >
      {ratings.map((rating) => (
        <div key={rating} className="flex flex-col items-center space-y-2">
          <RadioGroupItem
            value={rating.toString()}
            id={`rating-${rating}`}
            className="h-6 w-6 sm:h-5 sm:w-5"
          />
          <Label
            htmlFor={`rating-${rating}`}
            className="text-sm sm:text-base font-medium"
          >
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
