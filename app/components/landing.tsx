// Testing

// import Test from "./test";

// export default function Landing() {
//   return (
//     <main className='mx-auto -mb-16 min-h-[calc(100%-4rem)] px-4 md:px-6 lg:px-8'>
//       <div className='mx-auto flex size-full items-center justify-center pt-28 pb-44 2xl:pt-36 2xl:pb-52'>
//         <Test />
//       </div>
//     </main>
//   );
// }

"use client";

import { useState } from "react";

import Transcribe from "./transcribe";
import Auth from "./auth";

export default function Landing() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  return (
    <main className='mx-auto -mb-16 min-h-[calc(100%-4rem)] px-4 md:px-6 lg:px-8'>
      <div className='mx-auto flex size-full items-center justify-center pt-28 pb-44 2xl:pt-36 2xl:pb-52'>
        {isAuthorized ? (
          <Transcribe />
        ) : (
          <Auth onAuthorized={() => setIsAuthorized(true)} />
        )}
      </div>
    </main>
  );
}
