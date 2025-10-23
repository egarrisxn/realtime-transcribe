import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { DeepgramContextProvider } from "./context/deepgram-provider";
import { MicrophoneContextProvider } from "./context/microphone-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://realtime-transcribe.vercel.app"),
  title: "Realtime Transcribe",
  description: "Realtime speech-to-text with Deepgram.",
  referrer: "origin-when-cross-origin",
  keywords: [
    "realtime-transcribe, realtime, transcribe, transcription, deepgram, speech-to-text, transcription, nextjs, react, typescript, javascript, ai, api, voice, audio",
  ],
  openGraph: {
    locale: "en_US",
    type: "website",
    title: "Realtime Transcribe",
    description: "Realtime speech-to-text with Deepgram.",
    url: "https://realtime-transcribe.vercel.app",
    siteName: "Realtime Transcribe",
  },
  twitter: {
    card: "summary_large_image",
    title: "Realtime Transcribe",
    description: "Realtime speech-to-text with Deepgram.",
    creator: "@eg__xo",
    site: "@eg__xo",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#181f25" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='h-dvh'>
      <head>
        <meta name='apple-mobile-web-app-title' content='Realtime Transcribe' />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} h-full`}>
        <MicrophoneContextProvider>
          <DeepgramContextProvider>
            <main className='size-full bg-radial-[at_50%_50%] from-slate-900 via-slate-950 to-black to-95% font-sans antialiased'>
              {children}
            </main>
          </DeepgramContextProvider>
        </MicrophoneContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
