import { useEffect, useState } from "react";
import bottle from "../assets/group-6.png";
import wave from "../assets/Subtract.png";
import header from "../assets/layer-2.png";
import "../styles/Animation.css";

const texts = [
  "Out of Heinz?",
  "What a nightmare.",
  "But don’t worry.",
  "We have got your back and your next bottle.",
];

const KetchupBottle = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showStartButton, setShowStartButton] = useState(false);

  useEffect(() => {
    if (currentTextIndex < texts.length - 1) {
      const timer = setTimeout(() => {
        setCurrentTextIndex((prev) => prev + 1);
      }, 1800); 
      return () => clearTimeout(timer);
    } else {
      const showButtonTimer = setTimeout(() => setShowStartButton(true), 1500);
      return () => clearTimeout(showButtonTimer);
    }
  }, [currentTextIndex]);

  const handleStartClick = () => {
    console.log("Start clicked: loader and mic flow will begin.");
  };

  return (
    <div className="container-fluid">
      <div className="header">
        <img src={header} alt="header-icon" />
      </div>
      <div className="bottle-container">
        <div className="bottle-outline">
          <img src={bottle} alt="Bottle Outline" />
        </div>
        <div className="bottle-mask">
          <img src={wave} alt="Bottle Mask" className="subtract" />
          <div className="circle">
            <div className="wave"></div>
          </div>
        </div>
      </div>
      <div className="text-container">
        {!showStartButton ? (
          <p className="animated-text">{texts[currentTextIndex]}</p>
        ) : (
          <button className="start-button" onClick={handleStartClick}>
           <span>
             Start
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default KetchupBottle;
