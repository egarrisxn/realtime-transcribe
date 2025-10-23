//! Testing
// import Test from "./test";

// export default function Landing() {
//   return (
//     <>
//       <div className='mx-auto grid size-full place-items-center p-4 md:p-6 lg:p-8'>
//         <Test />
//       </div>
//     </>
//   );
// }

"use client";

import { useState } from "react";

import Transcribe from "./transcribe";
import Auth from "./auth";

export default function Landing() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  return (
    <>
      <div className='mx-auto grid size-full place-items-center p-4 md:p-6 lg:p-8'>
        {isAuthorized ? (
          <Transcribe />
        ) : (
          <Auth onAuthorized={() => setIsAuthorized(true)} />
        )}
      </div>
    </>
  );
}
