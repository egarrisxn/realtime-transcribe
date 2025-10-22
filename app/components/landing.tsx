"use client";

import { useState } from "react";
import Transcription from "@/app/components/transcription";
import Auth from "@/app/components/auth";

export default function Landing() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  return (
    <>
      <main className='h-full overflow-hidden bg-linear-to-t from-black via-slate-950 to-slate-900'>
        {isAuthorized ? (
          <Transcription />
        ) : (
          <Auth onAuthorized={() => setIsAuthorized(true)} />
        )}
      </main>
    </>
  );
}
