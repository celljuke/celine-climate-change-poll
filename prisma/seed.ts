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
      titleI18n: {
        en: "Climate Change Survey for Young Scientists",
        tr: "Genç Bilim İnsanları için İklim Değişikliği Anketi",
      },
      descriptionI18n: {
        en: "Help us understand what you know about climate change and how you feel about it",
        tr: "İklim değişikliği hakkında ne bildiğinizi ve ne düşündüğünüzü anlamamıza yardımcı olun",
      },
      questions: {
        create: [
          {
            textI18n: {
              en: "How worried are you about climate change?",
              tr: "İklim değişikliği konusunda ne kadar endişelisiniz?",
            },
            type: QuestionType.RATING,
            required: true,
            order: 1,
          },
          {
            textI18n: {
              en: "How often do you talk about climate change with your family?",
              tr: "Ailenizle iklim değişikliği hakkında ne sıklıkla konuşuyorsunuz?",
            },
            type: QuestionType.SINGLE_CHOICE,
            required: true,
            order: 2,
            options: {
              create: [
                { textI18n: { en: "Never", tr: "Hiç" }, order: 1 },
                { textI18n: { en: "Sometimes", tr: "Bazen" }, order: 2 },
                { textI18n: { en: "Often", tr: "Sık sık" }, order: 3 },
                { textI18n: { en: "Very often", tr: "Çok sık" }, order: 4 },
              ],
            },
          },
          {
            textI18n: {
              en: "Which of these have you noticed in your area? (Choose all that apply)",
              tr: "Yaşadığınız yerde bunlardan hangilerini fark ettiniz? (Uygun olanların hepsini seçin)",
            },
            type: QuestionType.MULTIPLE_CHOICE,
            required: true,
            order: 3,
            options: {
              create: [
                {
                  textI18n: { en: "Hotter summers", tr: "Daha sıcak yazlar" },
                  order: 1,
                },
                {
                  textI18n: {
                    en: "Less snow in winter",
                    tr: "Kışın daha az kar yağması",
                  },
                  order: 2,
                },
                {
                  textI18n: { en: "More storms", tr: "Daha fazla fırtına" },
                  order: 3,
                },
                {
                  textI18n: {
                    en: "Changes in plants and animals",
                    tr: "Bitki ve hayvanlardaki değişimler",
                  },
                  order: 4,
                },
                {
                  textI18n: {
                    en: "More rainy days",
                    tr: "Daha fazla yağmurlu gün",
                  },
                  order: 5,
                },
              ],
            },
          },
          {
            textI18n: {
              en: "How important do you think it is to learn about climate change in school?",
              tr: "Okulda iklim değişikliği hakkında öğrenmenin ne kadar önemli olduğunu düşünüyorsunuz?",
            },
            type: QuestionType.RATING,
            required: true,
            order: 4,
          },
          {
            textI18n: {
              en: "Which of these do you do at home? (Choose all that apply)",
              tr: "Evde bunlardan hangilerini yapıyorsunuz? (Uygun olanların hepsini seçin)",
            },
            type: QuestionType.MULTIPLE_CHOICE,
            required: true,
            order: 5,
            options: {
              create: [
                {
                  textI18n: {
                    en: "Turn off lights when leaving a room",
                    tr: "Odadan çıkarken ışıkları kapatmak",
                  },
                  order: 1,
                },
                {
                  textI18n: { en: "Recycle", tr: "Geri dönüşüm yapmak" },
                  order: 2,
                },
                {
                  textI18n: { en: "Save water", tr: "Su tasarrufu yapmak" },
                  order: 3,
                },
                {
                  textI18n: {
                    en: "Use reusable water bottles",
                    tr: "Tekrar kullanılabilir su şişeleri kullanmak",
                  },
                  order: 4,
                },
                {
                  textI18n: {
                    en: "Remind others to be eco-friendly",
                    tr: "Başkalarına çevre dostu olmalarını hatırlatmak",
                  },
                  order: 5,
                },
              ],
            },
          },
          {
            textI18n: {
              en: "How do you usually get to school?",
              tr: "Genellikle okula nasıl gidiyorsunuz?",
            },
            type: QuestionType.SINGLE_CHOICE,
            required: true,
            order: 6,
            options: {
              create: [
                { textI18n: { en: "Walk", tr: "Yürüyerek" }, order: 1 },
                { textI18n: { en: "Bicycle", tr: "Bisikletle" }, order: 2 },
                {
                  textI18n: { en: "School bus", tr: "Okul servisi" },
                  order: 3,
                },
                { textI18n: { en: "Car", tr: "Arabayla" }, order: 4 },
                {
                  textI18n: { en: "Public transport", tr: "Toplu taşıma" },
                  order: 5,
                },
              ],
            },
          },
          {
            textI18n: {
              en: "How interested are you in learning more about protecting the environment?",
              tr: "Çevreyi koruma konusunda daha fazla bilgi edinmekle ne kadar ilgilisiniz?",
            },
            type: QuestionType.RATING,
            required: true,
            order: 7,
          },
          {
            textI18n: {
              en: "Which environmental topics would you like to learn more about? (Choose all that apply)",
              tr: "Hangi çevre konuları hakkında daha fazla bilgi edinmek istersiniz? (Uygun olanların hepsini seçin)",
            },
            type: QuestionType.MULTIPLE_CHOICE,
            required: true,
            order: 8,
            options: {
              create: [
                {
                  textI18n: {
                    en: "Renewable energy",
                    tr: "Yenilenebilir enerji",
                  },
                  order: 1,
                },
                {
                  textI18n: {
                    en: "Wildlife protection",
                    tr: "Yaban hayatı koruma",
                  },
                  order: 2,
                },
                {
                  textI18n: { en: "Ocean pollution", tr: "Okyanus kirliliği" },
                  order: 3,
                },
                {
                  textI18n: { en: "Forest conservation", tr: "Orman koruma" },
                  order: 4,
                },
                {
                  textI18n: {
                    en: "Sustainable living",
                    tr: "Sürdürülebilir yaşam",
                  },
                  order: 5,
                },
              ],
            },
          },
          {
            textI18n: {
              en: "How often do you spend time in nature?",
              tr: "Ne sıklıkla doğada vakit geçiriyorsunuz?",
            },
            type: QuestionType.SINGLE_CHOICE,
            required: true,
            order: 9,
            options: {
              create: [
                { textI18n: { en: "Every day", tr: "Her gün" }, order: 1 },
                {
                  textI18n: {
                    en: "A few times a week",
                    tr: "Haftada birkaç kez",
                  },
                  order: 2,
                },
                {
                  textI18n: { en: "Once a week", tr: "Haftada bir" },
                  order: 3,
                },
                {
                  textI18n: {
                    en: "A few times a month",
                    tr: "Ayda birkaç kez",
                  },
                  order: 4,
                },
                { textI18n: { en: "Rarely", tr: "Nadiren" }, order: 5 },
              ],
            },
          },
          {
            textI18n: {
              en: "How confident do you feel about explaining climate change to a friend?",
              tr: "Bir arkadaşınıza iklim değişikliğini açıklama konusunda kendinize ne kadar güveniyorsunuz?",
            },
            type: QuestionType.RATING,
            required: true,
            order: 10,
          },
          {
            textI18n: {
              en: "Which of these climate change effects worry you the most? (Choose all that apply)",
              tr: "İklim değişikliğinin bu etkilerinden hangileri sizi en çok endişelendiriyor? (Uygun olanların hepsini seçin)",
            },
            type: QuestionType.MULTIPLE_CHOICE,
            required: true,
            order: 11,
            options: {
              create: [
                {
                  textI18n: {
                    en: "Animals losing their homes",
                    tr: "Hayvanların yaşam alanlarını kaybetmesi",
                  },
                  order: 1,
                },
                {
                  textI18n: {
                    en: "Not enough clean water",
                    tr: "Yeterli temiz su olmaması",
                  },
                  order: 2,
                },
                {
                  textI18n: {
                    en: "More natural disasters",
                    tr: "Daha fazla doğal afet",
                  },
                  order: 3,
                },
                {
                  textI18n: {
                    en: "Changes in food production",
                    tr: "Gıda üretimindeki değişiklikler",
                  },
                  order: 4,
                },
                {
                  textI18n: {
                    en: "Rising sea levels",
                    tr: "Deniz seviyesinin yükselmesi",
                  },
                  order: 5,
                },
              ],
            },
          },
          {
            textI18n: {
              en: "How do you feel when you learn about ways to help the environment?",
              tr: "Çevreye yardım etme yollarını öğrendiğinizde nasıl hissediyorsunuz?",
            },
            type: QuestionType.SINGLE_CHOICE,
            required: true,
            order: 12,
            options: {
              create: [
                {
                  textI18n: { en: "Very excited", tr: "Çok heyecanlı" },
                  order: 1,
                },
                { textI18n: { en: "Hopeful", tr: "Umutlu" }, order: 2 },
                { textI18n: { en: "Interested", tr: "İlgili" }, order: 3 },
                { textI18n: { en: "Worried", tr: "Endişeli" }, order: 4 },
                {
                  textI18n: { en: "Confused", tr: "Kafası karışmış" },
                  order: 5,
                },
              ],
            },
          },
          {
            textI18n: {
              en: "Which of these do you think are good solutions for climate change? (Choose all that apply)",
              tr: "Bunlardan hangileri sizce iklim değişikliği için iyi çözümlerdir? (Uygun olanların hepsini seçin)",
            },
            type: QuestionType.MULTIPLE_CHOICE,
            required: true,
            order: 13,
            options: {
              create: [
                {
                  textI18n: {
                    en: "Using more solar and wind power",
                    tr: "Daha fazla güneş ve rüzgar enerjisi kullanmak",
                  },
                  order: 1,
                },
                {
                  textI18n: {
                    en: "Planting more trees",
                    tr: "Daha fazla ağaç dikmek",
                  },
                  order: 2,
                },
                {
                  textI18n: {
                    en: "Using less plastic",
                    tr: "Daha az plastik kullanmak",
                  },
                  order: 3,
                },
                {
                  textI18n: {
                    en: "Walking or cycling more",
                    tr: "Daha fazla yürümek veya bisiklet kullanmak",
                  },
                  order: 4,
                },
                {
                  textI18n: {
                    en: "Saving energy at home",
                    tr: "Evde enerji tasarrufu yapmak",
                  },
                  order: 5,
                },
              ],
            },
          },
          {
            textI18n: {
              en: "How often do you learn about climate change from these sources? (Choose all that apply)",
              tr: "Bu kaynaklardan ne sıklıkla iklim değişikliği hakkında bilgi ediniyorsunuz? (Uygun olanların hepsini seçin)",
            },
            type: QuestionType.MULTIPLE_CHOICE,
            required: true,
            order: 14,
            options: {
              create: [
                {
                  textI18n: { en: "School lessons", tr: "Okul dersleri" },
                  order: 1,
                },
                { textI18n: { en: "Internet", tr: "İnternet" }, order: 2 },
                {
                  textI18n: { en: "TV shows", tr: "TV programları" },
                  order: 3,
                },
                { textI18n: { en: "Books", tr: "Kitaplar" }, order: 4 },
                {
                  textI18n: { en: "Family discussions", tr: "Aile sohbetleri" },
                  order: 5,
                },
              ],
            },
          },
          {
            textI18n: {
              en: "How important is recycling to you?",
              tr: "Geri dönüşüm sizin için ne kadar önemli?",
            },
            type: QuestionType.RATING,
            required: true,
            order: 15,
          },
        ],
      },
    },
  });

  console.log("Seed data created successfully!");
  console.log("Created survey:", survey.titleI18n);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
