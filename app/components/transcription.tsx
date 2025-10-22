"use client";

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type JSX,
} from "react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "@/app/context/deepgram-provider";
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "@/app/context/microphone-provider";
import Visuals from "./visuals";

export default function Transcription(): JSX.Element {
  const [caption, setCaption] = useState<string | undefined>(
    "Powered by Deepgram"
  );
  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, microphoneState } =
    useMicrophone();

  // Type is number | null (number is the type for browser-side timer IDs)
  const captionTimeout = useRef<number | null>(null);
  const keepAliveInterval = useRef<number | null>(null);

  // Initial microphone setup on mount
  useEffect(() => {
    setupMicrophone();
  }, [setupMicrophone]);

  // Connect to Deepgram once microphone is ready
  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-3",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
    }
  }, [microphoneState, connectToDeepgram]);

  // Handler for incoming audio data from the microphone.
  const onData = useCallback(
    (e: BlobEvent) => {
      // iOS SAFARI FIX:
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    },
    [connection]
  );

  // Handler for incoming transcription events.
  const onTranscript = useEffectEvent((data: LiveTranscriptionEvent) => {
    const { is_final: isFinal, speech_final: speechFinal } = data;
    const thisCaption = data.channel.alternatives[0].transcript;

    console.log("thisCaption", thisCaption);
    if (thisCaption !== "") {
      console.log('thisCaption !== ""', thisCaption);
      setCaption(thisCaption);
    }

    if (isFinal && speechFinal) {
      // Clear and reset the timeout
      if (captionTimeout.current !== null) {
        clearTimeout(captionTimeout.current);
      }

      // Use 'as unknown as number' for robust cross-environment typing of timer ID
      captionTimeout.current = setTimeout(() => {
        setCaption(undefined);
        captionTimeout.current = null; // Mark as cleared
      }, 3000) as unknown as number;
    }
  });

  // Attach Listeners and Start Microphone
  useEffect(() => {
    // Exit early if resources aren't available
    if (!microphone || !connection) return;

    if (connectionState === LiveConnectionState.OPEN) {
      // Attach listeners
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      // Start the microphone after listeners are attached
      startMicrophone();
    }

    // Cleanup function: runs on unmount or when dependencies change
    return () => {
      if (connection) {
        connection.removeListener(
          LiveTranscriptionEvents.Transcript,
          onTranscript
        );
      }
      if (microphone) {
        microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      }

      // Explicit null check before calling clearTimeout
      if (captionTimeout.current !== null) {
        clearTimeout(captionTimeout.current);
      }
      captionTimeout.current = null;
    };
  }, [connectionState, connection, microphone, onData, startMicrophone]);

  // Keep-Alive logic
  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();

      // Use 'as unknown as number' for robust typing of interval ID
      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000) as unknown as number;
    } else {
      // Explicit null check before calling clearInterval
      if (keepAliveInterval.current !== null) {
        clearInterval(keepAliveInterval.current);
      }
      keepAliveInterval.current = null;
    }

    return () => {
      // Explicit null check in the cleanup return
      if (keepAliveInterval.current !== null) {
        clearInterval(keepAliveInterval.current);
      }
    };
  }, [microphoneState, connectionState, connection]);

  return (
    <>
      <div className='mx-auto h-full px-4 md:px-6 lg:px-8'>
        <div className='relative size-full'>
          {microphone && <Visuals microphone={microphone} />}
          <div className='absolute inset-x-0 bottom-32 mx-auto max-w-4xl text-center'>
            {caption && <span className='bg-black/70 p-8'>{caption}</span>}
          </div>
        </div>
      </div>
    </>
  );
}
