import { useState, useEffect } from "react";

interface AnimatedTextProps {
  quotes: string[];
  onComplete: () => void;
}

const AnimatedText = ({ quotes, onComplete }: AnimatedTextProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < quotes.length - 1) {
      const timer = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      const showButtonTimer = setTimeout(() => onComplete(), 1500);
      return () => clearTimeout(showButtonTimer);
    }
  }, [index, quotes.length, onComplete]);

  return (
    <p className="animated-text">
      {quotes[index]}
    </p>
  );
};

export default AnimatedText;
