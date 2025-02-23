"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function SurveyCompleted() {
  const t = useTranslations("survey");
  const colors = [
    "#FF6B6B", // coral
    "#4ECDC4", // turquoise
    "#FFD93D", // yellow
    "#6C5CE7", // purple
    "#A8E6CF", // mint
    "#FF8B94", // pink
  ];

  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <Card className="relative max-w-md overflow-hidden p-8 text-center">
        {/* Rainbow gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] opacity-20" />

        {/* Floating bubbles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-8 w-8 rounded-full"
            style={{
              background: colors[i % colors.length],
              top: "50%",
              left: "50%",
              opacity: 0.3,
            }}
            animate={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              delay: i * 0.2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}

        {/* Main content */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="relative flex flex-col items-center gap-6"
        >
          {/* Trophy emoji with glow effect */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="relative"
          >
            <div className="relative">
              <span className="block text-8xl">🏆</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
                className="absolute inset-0 rounded-full bg-yellow-300 blur-xl opacity-30"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
              {t("thankYou")} 🎉
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("alreadySubmitted")}
            </p>
          </motion.div>

          {/* Stars */}
          <div className="absolute inset-0 -z-10">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 1,
                }}
              >
                <Star
                  className="h-6 w-6"
                  fill={colors[i % colors.length]}
                  stroke={colors[i % colors.length]}
                />
              </motion.div>
            ))}
          </div>

          {/* Rainbow confetti */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{
                background: colors[i % colors.length],
                top: "50%",
                left: "50%",
              }}
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.random() * 400 - 200,
                y: Math.random() * 400 - 200,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 2,
              }}
            />
          ))}

          {/* Fun emojis */}
          <div className="flex gap-4 text-2xl">
            {["🌟", "🎈", "🎨", "✨"].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </Card>
    </div>
  );
}
