import { useEffect, useRef, useState } from "react";
import bottle from "../assets/group-6.png";
import wave from "../assets/Subtract.png";
import header from "../assets/layer-2.png";
import loaderImage from "../assets/loader-image-1.png";
import loaderImage2 from "../assets/loader-image-2.png";
import loaderImage3 from "../assets/loader-image-3.png";
import bottleHandeHolding from "../assets/start-hande-holding.png";
import "../styles/Animation.css";
import AudioVisualizer from "./AudioVisualizer";

const texts = [
  "Out of Heinz?",
  "What a nightmare.",
  "But don’t worry.",
  "We have got your back and your next bottle.",
];

const afterStartText = [
  "Squeeze your empty Heinz bottle.",
  "Squeeze some more.",
  "Keep squeezing.",
  "One last time.",
  "Done."
]

const bottleImages = [loaderImage, loaderImage2, loaderImage3];

const KetchupBottle = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showStartButton, setShowStartButton] = useState(false);
  const [loadingState, setLoadingState] = useState({
    show: false,
    progress: 0,
    complete: false,
  });
  const [currentAfterStartTextIndex, setCurrentAfterStartTextIndex] = useState(0);
  const [currentBottleImageIndex, setCurrentBottleImageIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const [microphoneWarning, setMicrophoneWarning] = useState(false);
  const micStreamRef = useRef(null);
  const loadingTimerRef = useRef(null);
  const recordingTimerRef = useRef(null);

//  this useEffect fot the text change before the start button
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


  // this is useEffrect fotr the loading state progress and completete 
  // and even for aftertext

  useEffect(() => {
    if (loadingState.show && !loadingState.complete) {
      setCurrentAfterStartTextIndex(0); 
      setCurrentBottleImageIndex(0);
      const totalDuration = 5000; 
      const intervalTime = totalDuration /( afterStartText.length - 1);

      const textInterval = setInterval(() => {
        setCurrentAfterStartTextIndex((prev) => {
          if (prev < afterStartText.length - 1) {
            return prev + 1;
          } else {
            clearInterval(textInterval);
            return prev;
          }
        });
      }, intervalTime);

      const imageInterval = setInterval(() => {
        setCurrentBottleImageIndex((prev) => (prev + 1) % bottleImages.length);
      }, 200);
      
      const progressInterval = setInterval(() => {
        setLoadingState((prev) => {
          const newProgress = prev.progress + 2;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            clearInterval(textInterval);
            clearInterval(imageInterval);
            return { ...prev, progress: 100, complete: true };
          }
          return { ...prev, progress: newProgress };
        });
      }, totalDuration / 50); 

      return () => {
        clearInterval(progressInterval);
        clearInterval(textInterval);
        clearInterval(imageInterval);
      };
    }
  }, [loadingState.show, loadingState.complete]);

  const handleStartClick = () => {
    console.log("Start clicked: loader and mic flow will begin.");
    setLoadingState({ show: true, progress: 0, complete: false });
  };

  return (
    <div className="container-fluid">
      <div className="header">
        <img src={header} alt="header-icon" />
      </div>
      {loadingState.show ? (
        <div className="loader-container">
          <div
            className="circular-progress"
          >
            <svg className="progress-ring" width="100%" height="100%" viewBox="0 0 100 100">
              <circle className="progress-ring-bg" cx="48" cy="48" r="42"></circle>
              <circle
                className="progress-ring-fill"
                cx="50"
                cy="50"
                r="45"
                strokeDasharray="282.74"
                strokeDashoffset={`${282.74 - (loadingState.progress / 100) * 282.74}`}
              ></circle>
            </svg>
            <div className="progress-inner-circle">
              <img src={bottleImages[currentBottleImageIndex]} alt="Loader" className="loader-image" />
              < div className="shadow" />  
            </div>
          </div>
        </div>
      ) : showStartButton ? (
        <div className="start-bottle-container">
          <div className="start-bottle-outline">
            <img src={bottleHandeHolding} alt="start-Bottle Outline" />
          </div>
          <div className="start-bottle-mask">
            <img src={wave} alt="Bottle Mask" className="subtract" />
            <div className="start-circle">
              <div className="start-wave"></div>
            </div>
          </div>
        </div>
      ) : (
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
      )}

      <div className="text-container">
      {loadingState.show ? (
        <div>
          <div className="audio-visualizer-wrapper">
            <AudioVisualizer 
              isRecording={isRecording} 
              audioStream={micStreamRef.current} 
            />
        </div>
          <p className="animated-text">{afterStartText[currentAfterStartTextIndex]}</p>
        </div>
        ) : !showStartButton ? (
          <p className="animated-text">{texts[currentTextIndex]}</p>
        ) : (
          <button className="start-button" onClick={handleStartClick}>
            <span>Start</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default KetchupBottle;
