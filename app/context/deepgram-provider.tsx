"use client";

import {
  createClient,
  LiveClient,
  LiveConnectionState,
  LiveTranscriptionEvents,
  type LiveSchema,
  type LiveTranscriptionEvent,
} from "@deepgram/sdk";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

/**
 * Fetches a temporary Deepgram access token from your Next.js API route.
 * The token is short-lived and scoped for live transcription use.
 */
export const getToken = async (): Promise<string> => {
  const response = await fetch("/api/authenticate", { cache: "no-store" });
  const result = await response.json();
  return result.access_token;
};

interface DeepgramContextType {
  connection: LiveClient | null;
  connectToDeepgram: (options: LiveSchema, endpoint?: string) => Promise<void>;
  disconnectFromDeepgram: () => void;
  connectionState: LiveConnectionState;
}

const DeepgramContext = createContext<DeepgramContextType | undefined>(
  undefined
);

interface DeepgramContextProviderProps {
  children: ReactNode;
}

/**
 * Provides Deepgram real-time transcription connection and state management.
 */
const DeepgramContextProvider = ({
  children,
}: DeepgramContextProviderProps) => {
  const [connection, setConnection] = useState<LiveClient | null>(null);
  const [connectionState, setConnectionState] = useState<LiveConnectionState>(
    LiveConnectionState.CLOSED
  );

  /**
   * Establishes a new WebSocket connection with Deepgram's live transcription API.
   */
  const connectToDeepgram = useCallback(
    async (options: LiveSchema, endpoint?: string) => {
      const token = await getToken();
      const deepgram = createClient({ accessToken: token });

      const conn = deepgram.listen.live(options, endpoint);

      conn.addListener(LiveTranscriptionEvents.Open, () =>
        setConnectionState(LiveConnectionState.OPEN)
      );
      conn.addListener(LiveTranscriptionEvents.Close, () =>
        setConnectionState(LiveConnectionState.CLOSED)
      );

      setConnection(conn);
    },
    []
  );

  /**
   * Gracefully closes the Deepgram WebSocket session.
   */
  const disconnectFromDeepgram = useCallback(async () => {
    if (connection) {
      connection.finish();
      setConnection(null);
      // Optionally: setConnectionState(LiveConnectionState.CLOSED);
    }
  }, [connection]);

  return (
    <DeepgramContext.Provider
      value={{
        connection,
        connectToDeepgram,
        disconnectFromDeepgram,
        connectionState,
      }}
    >
      {children}
    </DeepgramContext.Provider>
  );
};

/**
 * Hook to access Deepgram connection and state.
 */
function useDeepgram(): DeepgramContextType {
  const context = useContext(DeepgramContext);
  if (!context) {
    throw new Error(
      "useDeepgram must be used within a DeepgramContextProvider"
    );
  }
  return context;
}

export {
  DeepgramContextProvider,
  useDeepgram,
  LiveConnectionState,
  LiveTranscriptionEvents,
  type LiveTranscriptionEvent,
};
