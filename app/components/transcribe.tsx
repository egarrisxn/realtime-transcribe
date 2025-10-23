"use client";

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../context/deepgram-provider";
import {
  useMicrophone,
  MicrophoneEvents,
  MicrophoneState,
} from "../context/microphone-provider";

export default function Transcribe() {
  const [caption, setCaption] = useState<string | undefined>(
    "Realtime Transcribe in 3..2..1..."
  );
  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, microphoneState } =
    useMicrophone();

  // Timeout to clear captions after a brief delay
  const captionTimeout = useRef<number | null>(null);
  // Interval for keeping Deepgram connection alive
  const keepAliveInterval = useRef<number | null>(null);

  // 🔧 Step 1: Request microphone permission & initialize MediaRecorder
  useEffect(() => {
    setupMicrophone();
  }, [setupMicrophone]);

  // 🔗 Step 2: Once microphone is ready, connect to Deepgram live API
  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-3",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000, // Helps Deepgram know when a user stops talking
      });
    }
  }, [microphoneState, connectToDeepgram]);

  // 🎙 Step 3: Handle microphone audio chunks being generated
  const onData = useCallback(
    (e: BlobEvent) => {
      // Some browsers (notably Safari on iOS) may emit zero-size chunks — ignore them
      if (e.data.size > 0) {
        connection?.send(e.data); // Send audio to Deepgram via WebSocket
      }
    },
    [connection]
  );

  // 🧠 Step 4: Handle transcription messages coming from Deepgram
  const onTranscript = useEffectEvent((data: LiveTranscriptionEvent) => {
    const { is_final: isFinal, speech_final: speechFinal } = data;
    const thisCaption = data.channel.alternatives[0].transcript;

    console.log("thisCaption", thisCaption);

    // Update caption if a non-empty string was received
    if (thisCaption !== "") {
      console.log('thisCaption !== ""', thisCaption);
      setCaption(thisCaption);
    }

    // If Deepgram marks the utterance as final, clear the caption after delay
    if (isFinal && speechFinal) {
      if (captionTimeout.current !== null) {
        clearTimeout(captionTimeout.current);
      }

      captionTimeout.current = setTimeout(() => {
        setCaption(undefined); // Hide caption text
        captionTimeout.current = null;
      }, 3000) as unknown as number; // 3-second fade-out delay
    }
  });

  // 🎧 Step 5: Attach listeners for audio data + transcriptions once connected
  useEffect(() => {
    if (!microphone || !connection) return;

    if (connectionState === LiveConnectionState.OPEN) {
      // Listen for transcript messages from Deepgram
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);

      // Forward recorded audio chunks to Deepgram
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      // Begin recording from the microphone
      startMicrophone();
    }

    // Cleanup listeners when dependencies change or component unmounts
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

      // Clear caption timeout if active
      if (captionTimeout.current !== null) {
        clearTimeout(captionTimeout.current);
      }
      captionTimeout.current = null;
    };
  }, [connectionState, connection, microphone, onData, startMicrophone]);

  // 🔄 Step 6: Keep Deepgram connection alive if the mic is idle
  useEffect(() => {
    if (!connection) return;

    // Send periodic keepAlive signals to prevent session timeout
    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000) as unknown as number; // Every 10 seconds
    } else {
      // Stop the keep-alive interval when mic is recording or connection closes
      if (keepAliveInterval.current !== null) {
        clearInterval(keepAliveInterval.current);
      }
      keepAliveInterval.current = null;
    }

    // Cleanup interval on dismount
    return () => {
      if (keepAliveInterval.current !== null) {
        clearInterval(keepAliveInterval.current);
      }
    };
  }, [microphoneState, connectionState, connection]);

  return (
    <>
      <div className='mx-auto flex w-full max-w-4xl items-center justify-center p-8'>
        {caption && (
          <span className='rounded-xl border border-neutral-800/70 bg-neutral-900/90 p-8 text-center text-xl text-white shadow-2xl sm:text-2xl'>
            {caption}
          </span>
        )}
      </div>
    </>
  );
}
