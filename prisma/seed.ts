import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.answer.deleteMany();
  await prisma.response.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.survey.deleteMany();

  // Create the climate change survey
  const survey = await prisma.survey.create({
    data: {
      title: "Climate Change Awareness Survey",
      description:
        "Help us understand your perspectives and actions regarding climate change",
      questions: {
        create: [
          {
            text: "How concerned are you about climate change?",
            type: QuestionType.RATING,
            required: true,
            order: 1,
          },
          {
            text: "Which of the following climate change impacts concern you the most? (Select all that apply)",
            type: QuestionType.MULTIPLE_CHOICE,
            required: true,
            order: 2,
            options: {
              create: [
                { text: "Rising sea levels", order: 1 },
                { text: "Extreme weather events", order: 2 },
                { text: "Loss of biodiversity", order: 3 },
                { text: "Food security", order: 4 },
                { text: "Water scarcity", order: 5 },
              ],
            },
          },
          {
            text: "What is your primary source of information about climate change?",
            type: QuestionType.SINGLE_CHOICE,
            required: true,
            order: 3,
            options: {
              create: [
                { text: "Scientific publications", order: 1 },
                { text: "News media", order: 2 },
                { text: "Social media", order: 3 },
                { text: "Educational institutions", order: 4 },
                { text: "Government reports", order: 5 },
              ],
            },
          },
          {
            text: "What actions do you currently take to reduce your carbon footprint?",
            type: QuestionType.MULTIPLE_CHOICE,
            required: true,
            order: 4,
            options: {
              create: [
                { text: "Using public transportation", order: 1 },
                { text: "Reducing energy consumption", order: 2 },
                { text: "Recycling and composting", order: 3 },
                { text: "Eating less meat", order: 4 },
                { text: "Using renewable energy", order: 5 },
              ],
            },
          },
          {
            text: "In your opinion, what is the most effective solution to combat climate change?",
            type: QuestionType.TEXT,
            required: true,
            order: 5,
          },
        ],
      },
    },
  });

  console.log("Seed data created successfully!");
  console.log("Created survey:", survey.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
