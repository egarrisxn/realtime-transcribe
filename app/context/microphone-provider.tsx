"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Enum mapping MediaRecorder events to consistent string keys.
 * Makes it easier to register/unregister listeners safely.
 */
export enum MicrophoneEvents {
  DataAvailable = "dataavailable",
  Error = "error",
  Pause = "pause",
  Resume = "resume",
  Start = "start",
  Stop = "stop",
}

/**
 * Represents the lifecycle of the microphone setup and recording process.
 */
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

/**
 * Context type that defines the shape of values shared through React Context.
 */
interface MicrophoneContextType {
  microphone: MediaRecorder | null;
  startMicrophone: () => void;
  stopMicrophone: () => void;
  setupMicrophone: () => void;
  microphoneState: MicrophoneState | null;
}

const MicrophoneContext = createContext<MicrophoneContextType | undefined>(
  undefined
);

interface MicrophoneContextProviderProps {
  children: ReactNode;
}

/**
 * Provides microphone setup and control logic across the app.
 * Handles permissions, recording lifecycle, and clean shutdown.
 */
const MicrophoneContextProvider = ({
  children,
}: MicrophoneContextProviderProps) => {
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>(
    MicrophoneState.NotSetup
  );
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null);
  const [userMediaStream, setUserMediaStream] = useState<MediaStream | null>(
    null
  );

  /**
   * Requests microphone permissions and initializes the MediaRecorder instance.
   */
  const setupMicrophone = useCallback(async () => {
    setMicrophoneState(MicrophoneState.SettingUp);

    // --- Defensive Check Added ---
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Microphone API not supported or context is insecure.");
      alert(
        "Microphone access is blocked. Please ensure you are using HTTPS or a secure localhost environment."
      );
      setMicrophoneState(MicrophoneState.Error);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });

      const recorder = new MediaRecorder(stream);

      setUserMediaStream(stream);
      setMicrophone(recorder);
      setMicrophoneState(MicrophoneState.Ready);
    } catch (err: unknown) {
      console.error("Microphone setup failed:", err);
      setMicrophoneState(MicrophoneState.Error);
    }
  }, []);

  /**
   * Gracefully stops recording and releases audio hardware resources.
   */
  const stopMicrophone = useCallback(() => {
    setMicrophoneState(MicrophoneState.Stopping);

    if (microphone?.state === "recording" || microphone?.state === "paused") {
      microphone.stop();
    }

    // Stop all active media tracks (this releases the microphone hardware)
    if (userMediaStream) {
      userMediaStream.getTracks().forEach((track) => track.stop());
      setUserMediaStream(null);
    }
  }, [microphone, userMediaStream]);

  /**
   * Starts or resumes microphone recording depending on its current state.
   */
  const startMicrophone = useCallback(() => {
    if (!microphone) return;
    setMicrophoneState(MicrophoneState.Opening);

    try {
      if (microphone.state === "paused") {
        microphone.resume();
      } else if (microphone.state === "inactive") {
        microphone.start(250); // Emit chunks every 250ms
      } else {
        console.warn(
          `Attempted to start microphone in state: ${microphone.state}`
        );
      }
    } catch (error) {
      console.error("Error executing microphone.start:", error);
      setMicrophoneState(MicrophoneState.Error);
    }
  }, [microphone]);

  /**
   * Synchronizes MediaRecorder events with internal React state.
   * Ensures the UI always reflects the actual recorder status.
   */
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

    return () => {
      microphone.removeEventListener(MicrophoneEvents.Start, handleStart);
      microphone.removeEventListener(MicrophoneEvents.Stop, handleStop);
      microphone.removeEventListener(MicrophoneEvents.Pause, handlePause);
      microphone.removeEventListener(MicrophoneEvents.Error, handleError);

      // Final cleanup safeguard
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

/**
 * Hook that exposes microphone controls to React components.
 */
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
