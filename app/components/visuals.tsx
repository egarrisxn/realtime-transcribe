"use client";

import { useCallback, useEffect, useRef, type JSX } from "react";

const interpolateColor = (
  startColor: number[],
  endColor: number[],
  factor: number
): number[] => {
  const result: number[] = [];
  for (let i = 0; i < startColor.length; i++) {
    result[i] = Math.round(
      startColor[i] + factor * (endColor[i] - startColor[i])
    );
  }
  return result;
};

// Interface for the audio objects we need to manage
interface AudioNodes {
  context: AudioContext;
  analyser: AnalyserNode;
  dataArray: Uint8Array<ArrayBuffer>;
  source: MediaStreamAudioSourceNode | null;
}

export default function Visuals({
  microphone,
}: {
  microphone: MediaRecorder;
}): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Ref to hold all mutable audio API objects created in the setup effect
  const audioRef = useRef<AudioNodes | null>(null);

  // Ref for the stable, recursive drawing function
  const drawRef = useRef<(() => void) | null>(null);

  // Define the stable, recursive drawing function
  const stableDraw = useCallback((): void => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const audioNodes = audioRef.current;

    if (!canvas || !context || !audioNodes) return;

    const { analyser, dataArray } = audioNodes;

    // Responsive Canvas Sizing
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;

    analyser.getByteFrequencyData(dataArray);

    context.clearRect(0, 0, width, height);

    const barWidth = 10;
    let x = 0;
    const startColor = [19, 239, 147];
    const endColor = [20, 154, 251];

    for (const value of dataArray) {
      const barHeight = (value / 255) * height * 1.5;
      const interpolationFactor = value / 255;

      const color = interpolateColor(startColor, endColor, interpolationFactor);

      context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4)`;
      // Draw from the bottom (height - barHeight)
      context.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth;
    }

    // Schedule the next frame using the function stored in the ref
    if (drawRef.current) {
      animationFrameRef.current = requestAnimationFrame(drawRef.current);
    }
  }, []); // Empty dependency array: all external values are accessed via refs

  // Update the draw function ref
  useEffect(() => {
    drawRef.current = stableDraw;
  }, [stableDraw]);

  // Initializes Web Audio API and handles all connection/cleanup.
  useEffect(() => {
    let sourceNode: MediaStreamAudioSourceNode | undefined;
    let audioCtx: AudioContext | undefined;

    try {
      // Initialization
      audioCtx = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)() as AudioContext;

      const analyserNode = audioCtx.createAnalyser();
      const dataArray = new Uint8Array(
        analyserNode.frequencyBinCount
      ) as Uint8Array<ArrayBuffer>;

      // Store objects in ref for access by stableDraw
      audioRef.current = {
        context: audioCtx,
        analyser: analyserNode,
        dataArray: dataArray,
        source: null,
      };

      // Connection
      sourceNode = audioCtx.createMediaStreamSource(microphone.stream);
      sourceNode.connect(analyserNode);

      // Update the ref with the source
      audioRef.current.source = sourceNode;

      // Resume the context if it's suspended
      if (audioCtx.state === "suspended") {
        audioCtx
          .resume()
          .catch((e) => console.error("Failed to resume AudioContext:", e));
      }

      // Start Visualization
      stableDraw();
    } catch (error) {
      console.error("Audio setup failed:", error);
      // Ensure context is closed if initialization partially failed
      if (audioCtx && audioCtx.state !== "closed") {
        audioCtx.close();
      }
      return;
    }

    // Cleanup Function (Runs only on unmount or dependency change)
    return () => {
      // Stop animation loop
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const nodes = audioRef.current;
      if (nodes) {
        // Disconnect source
        if (nodes.source) {
          nodes.source.disconnect();
        }

        // Close context: Check state before closing to prevent InvalidStateError
        if (nodes.context.state !== "closed") {
          nodes.context.close();
        }
      }

      // Clear ref to ensure stableDraw knows it's cleaned up
      audioRef.current = null;
    };
  }, [microphone, stableDraw]);

  return (
    <div className='absolute inset-0'>
      <canvas ref={canvasRef} className='size-full' />
    </div>
  );
}
