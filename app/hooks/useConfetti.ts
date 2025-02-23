import confetti from "canvas-confetti";

export const useConfetti = () => {
  const fireConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: [
        "#ff0000",
        "#00ff00",
        "#0000ff",
        "#ffff00",
        "#ff00ff",
        "#00ffff",
      ],
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    // Initial celebration burst
    confetti({
      ...defaults,
      particleCount: 100,
      scalar: 1.2,
      colors: ["#FFD700", "#FFA500", "#ff0000"],
    });

    // Start the fireworks interval
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Launch fireworks from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#ff0000", "#ff7700", "#ffff00"],
      });

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#00ff00", "#00ffff", "#0000ff"],
      });

      // Add some sparkles in the middle
      if (Math.random() > 0.5) {
        confetti({
          ...defaults,
          particleCount: particleCount * 0.5,
          origin: { x: randomInRange(0.4, 0.6), y: Math.random() - 0.2 },
          colors: ["#FFD700", "#FFA500", "#ff69b4"],
          gravity: 0.8,
          scalar: 2,
          drift: 0,
        });
      }
    }, 250);

    // Cleanup the interval after the duration
    setTimeout(() => {
      clearInterval(interval);
    }, duration);
  };

  return { fireConfetti };
};
