"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface MicrophoneContextType {
  microphone: MediaRecorder | null;
  startMicrophone: () => void;
  stopMicrophone: () => void;
  setupMicrophone: () => void;
  microphoneState: MicrophoneState | null;
}

export enum MicrophoneEvents {
  DataAvailable = "dataavailable",
  Error = "error",
  Pause = "pause",
  Resume = "resume",
  Start = "start",
  Stop = "stop",
}

export enum MicrophoneState {
  NotSetup = -1,
  SettingUp = 0,
  Ready = 1,
  Opening = 2,
  Open = 3,
  Error = 4,
  Pausing = 5,
  Paused = 6,
  Stopping = 7,
  Stopped = 8,
}

const MicrophoneContext = createContext<MicrophoneContextType | undefined>(
  undefined
);

interface MicrophoneContextProviderProps {
  children: ReactNode;
}

const MicrophoneContextProvider = ({
  children,
}: MicrophoneContextProviderProps) => {
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>(
    MicrophoneState.NotSetup
  );
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null);
  // State to track the underlying MediaStream for cleanup
  const [userMediaStream, setUserMediaStream] = useState<MediaStream | null>(
    null
  );

  const setupMicrophone = async () => {
    setMicrophoneState(MicrophoneState.SettingUp);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });

      const recorder = new MediaRecorder(stream);

      setUserMediaStream(stream); // Store the stream
      setMicrophone(recorder);
      setMicrophoneState(MicrophoneState.Ready);
    } catch (err: unknown) {
      console.error("Microphone setup failed:", err);
      setMicrophoneState(MicrophoneState.Error);
      // Do not throw, handle state locally
    }
  };

  const stopMicrophone = useCallback(() => {
    setMicrophoneState(MicrophoneState.Stopping);

    if (microphone?.state === "recording" || microphone?.state === "paused") {
      // Use .stop() to fully end recording and trigger event
      microphone.stop();
    }

    // Stop the media tracks to release hardware resource
    if (userMediaStream) {
      userMediaStream.getTracks().forEach((track) => track.stop());
      setUserMediaStream(null); // Clear stream reference
    }

    // State will be confirmed by the 'stop' event listener
  }, [microphone, userMediaStream]);

  const startMicrophone = useCallback(() => {
    if (!microphone) return;

    setMicrophoneState(MicrophoneState.Opening);

    try {
      // Check states correctly before starting/resuming
      if (microphone.state === "paused") {
        microphone.resume();
      } else if (microphone.state === "inactive") {
        microphone.start(250);
      } else {
        console.warn(
          `Attempted to start microphone in state: ${microphone.state}`
        );
      }

      // State will be confirmed by the 'start' event listener
    } catch (error) {
      console.error("Error executing microphone.start:", error);
      setMicrophoneState(MicrophoneState.Error);
    }
  }, [microphone]);

  // Use useEffect to attach listeners for robust state management
  useEffect(() => {
    if (!microphone) return;

    const handleStart = () => setMicrophoneState(MicrophoneState.Open);
    const handleStop = () => setMicrophoneState(MicrophoneState.Stopped);
    const handlePause = () => setMicrophoneState(MicrophoneState.Paused);
    const handleError = (e: Event) => {
      console.error("MediaRecorder Error:", (e as ErrorEvent).error);
      setMicrophoneState(MicrophoneState.Error);
    };

    microphone.addEventListener(MicrophoneEvents.Start, handleStart);
    microphone.addEventListener(MicrophoneEvents.Stop, handleStop);
    microphone.addEventListener(MicrophoneEvents.Pause, handlePause);
    microphone.addEventListener(MicrophoneEvents.Error, handleError);

    // Cleanup listeners on unmount or microphone change
    return () => {
      microphone.removeEventListener(MicrophoneEvents.Start, handleStart);
      microphone.removeEventListener(MicrophoneEvents.Stop, handleStop);
      microphone.removeEventListener(MicrophoneEvents.Pause, handlePause);
      microphone.removeEventListener(MicrophoneEvents.Error, handleError);

      // Final safety cleanup on unmount
      if (microphone.state !== "inactive") {
        microphone.stop();
      }
    };
  }, [microphone]);

  return (
    <MicrophoneContext.Provider
      value={{
        microphone,
        startMicrophone,
        stopMicrophone,
        setupMicrophone,
        microphoneState,
      }}
    >
      {children}
    </MicrophoneContext.Provider>
  );
};

function useMicrophone(): MicrophoneContextType {
  const context = useContext(MicrophoneContext);

  if (context === undefined) {
    throw new Error(
      "useMicrophone must be used within a MicrophoneContextProvider"
    );
  }

  return context;
}

export { MicrophoneContextProvider, useMicrophone };
