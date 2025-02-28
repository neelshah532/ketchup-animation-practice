import { useEffect, useState } from "react";
import bottle from "../assets/group-6.png";
import wave from "../assets/Subtract.png";
import header from "../assets/layer-2.png";
import loaderImage from "../assets/loader-image-1.png";
import loaderImage2 from "../assets/loader-image-2.png";
import loaderImage3 from "../assets/loader-image-3.png";
import bottleHandeHolding from "../assets/start-hande-holding.png";
import "../styles/Animation.css";
import AnimatedText from "./AnimatedText";

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
  const [showFinalText, setShowFinalText] = useState(false);
  const [showCouponDiv, setShowCouponDiv] = useState(false);
  const [randomPercentage, setRandomPercentage] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const randomPercentage = Math.floor(Math.random() * (100 - 5 + 1)) + 5; // Random between 5% and 100%
    setRandomPercentage(randomPercentage);

    // Mapping percentage to translateY values (higher percentage moves the element lower)
    const newTranslateY = ((randomPercentage / 100) * 100); // Adjust multiplier as needed
    setTranslateY(newTranslateY);
  }, []);
  
  
  // const [isRecording, setIsRecording] = useState(false);

  // const [microphoneWarning, setMicrophoneWarning] = useState(false);
  // const micStreamRef = useRef(null);
  // const loadingTimerRef = useRef(null);
  // const recordingTimerRef = useRef(null);
  
  // In KetchupBottle.tsx, add this state to track random percentage
  const afterCompleteProgress = `Seems like you've only ${randomPercentage}% Heinz left.`;
  

  // In the useEffect where you handle loadingState.complete
  useEffect(() => {
    if (loadingState.complete) {
      // Generate random percentage between 5% and 25%
      const newPercentage = Math.floor(Math.random() * 21) + 5;
      setRandomPercentage(newPercentage);
      setShowFinalText(true);

      // After 1.5 seconds, hide final text and show coupon div
      const finalTextTimer = setTimeout(() => {
        setShowFinalText(false);
        setShowCouponDiv(true);
      }, 2000);

      return () => clearTimeout(finalTextTimer);
    }
  }, [loadingState.complete]);


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
      const totalDuration = 10000; // Total 10 seconds

      // We need to schedule the first 4 texts evenly across the first 9 seconds
      // and the "Done" text exactly at 10 seconds (100% progress)
      const firstFourTextsDuration = 9000;
      const intervalBetweenFirstFourTexts = firstFourTextsDuration / (afterStartText.length - 2);

      // Schedule the first 4 text changes individually with setTimeout
      const textTimers: number[] = [];
      for (let i = 1; i < afterStartText.length - 1; i++) {
        const timer = setTimeout(() => {
          console.log(`Setting text index to ${i}`);
          setCurrentAfterStartTextIndex(i);
        }, i * intervalBetweenFirstFourTexts);
        textTimers.push(timer);
      }

      // Schedule the "Done" text to appear exactly at 100% (after 10 seconds)
      const doneTextTimer = setTimeout(() => {
        console.log("Setting text to Done");
        setCurrentAfterStartTextIndex(afterStartText.length - 1);
      }, totalDuration);
      textTimers.push(doneTextTimer);

      const imageInterval = setInterval(() => {
        setCurrentBottleImageIndex((prev) => (prev + 1) % bottleImages.length);
      }, 200);

      // Progress should take exactly 10 seconds (totalDuration)
      const progressStep = 100 / (totalDuration / 100); // Update every 100ms
      let progressValue = 0;

      const progressInterval = setInterval(() => {
        progressValue += progressStep;
        console.log("Progress value:", progressValue);

        if (progressValue >= 100) {
          clearInterval(progressInterval);
          setLoadingState(prev => ({ ...prev, progress: 100 }));

          // After 1.5 seconds, mark as complete
          setTimeout(() => {
            setLoadingState(prev => ({ ...prev, progress: 100, complete: true }));
          }, 1500);
        } else {
          setLoadingState(prev => ({ ...prev, progress: progressValue }));
        }
      }, 100);

      return () => {
        textTimers.forEach(timer => clearTimeout(timer));
        clearInterval(imageInterval);
        clearInterval(progressInterval);
      };
    }
  }, [loadingState.show, loadingState.complete]);


  // this useEfect use for handle after the complete the progresss
  useEffect(() => {
    if (loadingState.complete) {
      setShowFinalText(true);

      // After 1.5 seconds, hide final text and show coupon div
      const finalTextTimer = setTimeout(() => {
        setShowFinalText(false);
        setShowCouponDiv(true);
      }, 2000);

      return () => clearTimeout(finalTextTimer);
    }
  }, [loadingState.complete]);

  // Clean up when component unmounts
  //  useEffect(() => {
  //   return () => {
  //     if (micStreamRef.current) {
  //       micStreamRef.current.getTracks().forEach((track) => track.stop());
  //     }
  //     if (loadingTimerRef.current) {
  //       clearInterval(loadingTimerRef?.current);
  //     }
  //     if (recordingTimerRef.current) {
  //       clearTimeout(recordingTimerRef.current);
  //     }
  //   };
  // }, []);

  const handleStartClick = () => {
    console.log("Start clicked: loader and mic flow will begin.");
    setLoadingState({ show: true, progress: 0, complete: false });
  };


  // create a const for copy the code in clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText("HEINZ50OFF");
    alert("Coupon code copied 🥳🥳!");
  };

  const handleTextComplete = () => {
    setShowStartButton(true);
  };

  return (
    <div className="container-fluid">
      <div className="header">
        <img src={header} alt="header-icon" />
      </div>
      {loadingState.show && !loadingState.complete ? (
        <div className="loader-container">
          <div
            className="circular-progress"
          >
            <svg className="progress-ring" width="100%" height="100%" viewBox="0 0 100 100">
              <circle className="progress-ring-bg" cx="50" cy="50" r="44"></circle>
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
      ) : loadingState.complete ? (
        <div className="bottle-container">
          <div className="bottle-outline">
            <img src={bottle} alt="completed-bottle" />
          </div>
          <div className="bottle-mask">
            <img src={wave} alt="Bottle Mask" className="subtract" />
            <div className="dynamic-percentage-container">
              <div className="dynamic-percentage">
                  <span>12%</span>
              </div>
               <div className="dash-border"></div>
            </div>
            <div className="end-circle" style={{ transform: `translate(6%, -${translateY}%)` }}>
          <div className="end-wave"></div>
        </div>
        <div className="hidden-box"style={{ transform: `translateY(${translateY}%)` }} />  {/* this box height is dynamically set, so we have to move the circle animation up */}
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
        {loadingState.show && !loadingState.complete ? (
          <div>
            {/* <div className="audio-visualizer-wrapper">
            <AudioVisualizer 
              isRecording={isRecording} 
              audioStream={micStreamRef.current} 
            />
        </div> */}
            <p className="animated-text">{afterStartText[currentAfterStartTextIndex]}</p>
          </div>
        )
          : loadingState.complete && showFinalText ? (
            <p className="animated-text final-text">{afterCompleteProgress}</p>
          ) : loadingState.complete && showCouponDiv ? (
            // <div className="coupon-container">
            //   <div className="coupon-row">
            //     <div className="coupon-col">
            //       <p className="coupon-text">Here's your reward for being a loyal Heinz customer:</p>
            //     </div>
            //     <div className="coupon-col">
            //       <div className="coupon-code">
            //         <span>HEINZ50OFF</span>
            //         <button onClick={handleCopyCode} className="copy-button">Copy</button>
            //       </div>
            //     </div>
            //     <div className="coupon-col">
            //       <p className="coupon-subtext">Use this code for 50% off on your next purchase</p>
            //     </div>
            //   </div>
            // </div>
            <div className="coupon-container">
              <div className="coupon-row">
                <span className="animated-text">Here’s a coupon code for you</span>
              </div>
              <div className="coupon-code" onClick={handleCopyCode}>
                <span>OOH12</span>
              </div>
              <div className="coupon-col">
                <span className="coupon-subtext">Use the code now to get your Heinz ketchup in the next 10 mins.</span>
              </div>
            </div>
          )
            : !showStartButton ? (
              <AnimatedText quotes={texts} onComplete={handleTextComplete} />
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
