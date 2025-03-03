import { useEffect, useRef } from 'react';
import '../styles/AudioVisualizer.css';

interface AudioVisualizerProps {
  isRecording: boolean;
  audioStream: MediaStream | null;
}

const AudioVisualizer= ({ isRecording, audioStream }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;

    // Set canvas dimensions with devicePixelRatio for sharper rendering
    const scale = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * scale;
    canvas.height = canvas.clientHeight * scale;
    ctx.scale(scale, scale);

    // Background color matching the image
    ctx.fillStyle = '#B22234'; // Deep red background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const setupAudioAnalyser = () => {
      if (!audioStream) return;

      const audioContext = new (window.AudioContext || window.AudioContext)();
      const source = audioContext.createMediaStreamSource(audioStream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 128; // Lower for fewer bars
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);

        // Get frequency data if recording, otherwise generate visualization
        if (isRecording && analyser && dataArray) {
          analyser.getByteFrequencyData(dataArray);
        }

        // Clear and redraw background
        ctx.fillStyle = '#982932'; // Deep red background
        ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

        // Set up bar properties
        const barWidth = 3;
        const barGap = 2;
        const numBars = Math.floor((canvas.width / scale) / (barWidth + barGap));
        const centerY = (canvas.height / scale) / 2;

        for (let i = 0; i < numBars; i++) {
          let barHeight;

          if (isRecording && analyser && dataArray) {
            // Use real audio data
            const dataIndex = Math.floor((i / numBars) * dataArray.length);
            barHeight = (dataArray[dataIndex] / 255) * (canvas.height / scale) * 0.7;
            // Set minimum height
            barHeight = Math.max(barHeight, 5);
          } else {
            // Generate wave-like pattern similar to the image
            const time = Date.now() / 1000;
            // Multiple sine waves with different frequencies for a more natural look
            const wave1 = Math.sin(i * 0.2 + time * 2) * 0.5;
            const wave2 = Math.sin(i * 0.1 + time * 1.5) * 0.3;
            const wave3 = Math.sin(i * 0.05 + time) * 0.2;
            const combinedWave = (wave1 + wave2 + wave3) / 1;

            barHeight = Math.abs(combinedWave) * (canvas.height / scale) * 0.6;
            // Set minimum height
            barHeight = Math.max(barHeight, 5);
          }

          // Calculate x position for each bar
          const x = i * (barWidth + barGap);

          // Draw bar (vertical line)
          ctx.fillStyle = '#61131a'; // Darker red for the bars
          ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);
        }
      };

      draw();
    };

    // Start visualization
    setupAudioAnalyser();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, audioStream]);

  return <canvas ref={canvasRef} className="audio-visualizer" />;
};

export default AudioVisualizer;