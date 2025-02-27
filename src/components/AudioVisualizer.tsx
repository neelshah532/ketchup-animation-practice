import { useEffect, useRef } from 'react';

const AudioVisualizer = ({ isRecording, audioStream }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    if (!isRecording || !audioStream) return;

    // Set up audio context and analyzer
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyserRef.current = analyser;
    
    // Configure analyser for optimal visualization
    analyser.fftSize = 256; // Larger FFT size for more detailed frequency data
    analyser.smoothingTimeConstant = 0.8; // Smoothing for a more fluid visualization
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    dataArrayRef.current = dataArray;

    // Connect audio source to analyzer
    const source = audioContext.createMediaStreamSource(audioStream);
    source.connect(analyser);

    // Get canvas and context
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    
    // Ensure canvas is properly sized
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    
    // Scale context to match device pixel ratio for crisp rendering
    canvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Drawing function
    const draw = () => {
      if (!isRecording) return;
      
      animationRef.current = requestAnimationFrame(draw);

      // Get frequency data
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      canvasCtx.fillStyle = '#982932';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate dimensions for bars
      const barCount = 30; // Number of bars
      const barWidth = 4;  // Width of each bar
      const barSpacing = 2; // Space between bars
      const barMaxHeight = canvas.height * 0.7; // Max height of bars
      
      // Calculate starting X position to center the visualization
      const totalWidth = barCount * (barWidth + barSpacing) - barSpacing;
      let x = (canvas.width / window.devicePixelRatio - totalWidth) / 2;
      
      // Draw the bars
      canvasCtx.fillStyle = '#61131a'; // Color of the bars

      for (let i = 0; i < barCount; i++) {
        // Sample from the frequency data
        const dataIndex = Math.floor(i * (bufferLength / barCount));
        const amplitude = dataArray[dataIndex] / 255.0;
        
        // Calculate bar height
        const barHeight = amplitude * barMaxHeight;
        
        // Draw the bar
        canvasCtx.fillRect(x, (canvas.height / window.devicePixelRatio - barHeight) / 2, barWidth, barHeight);
        
        x += barWidth + barSpacing;
      }
    };

    // Start drawing loop
    draw();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording, audioStream]);

  return (
    <canvas 
      ref={canvasRef} 
      className="audio-visualizer"
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: '#982932'
      }}
    />
  );
};

export default AudioVisualizer;