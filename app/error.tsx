"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='mx-auto grid size-full place-items-center px-4 md:px-6 lg:px-8'>
      <div className='w-full max-w-md'>
        <div className='flex flex-col gap-6 rounded-xl border py-6 shadow-2xl'>
          <div className='grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6'>
            <h1 className='text-2xl leading-none font-semibold'>
              Something went wrong.
            </h1>
          </div>
          <div className='px-6'>
            <p className='text-sm'>An unspecified error occurred.</p>
          </div>
          <div className='flex items-center justify-end px-6 [.border-t]:pt-6'>
            <button
              className='cursor-pointer text-sm font-medium text-blue-600 underline-offset-4 transition-all hover:text-blue-600/80 hover:underline'
              onClick={() => reset()}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
