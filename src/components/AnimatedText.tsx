import { useState, useEffect } from "react";

const quotes = [
  "Out of Heinz?",
  "Craving ketchup?",
  "Pour it on!",
  "Let’s ketchup!"
];

const AnimatedText = ({ onComplete }: { onComplete: () => void }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);

    if (index === quotes.length - 1) {
      setTimeout(() => onComplete(), 4000); // Show Start button after last quote
    }

    return () => clearInterval(interval);
  }, [index, onComplete]);

  return (
    <h2 className="text-center text-white text-lg font-semibold mt-8 transition-opacity duration-500">
      {quotes[index]}
    </h2>
  );
};

export default AnimatedText;
