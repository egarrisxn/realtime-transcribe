import Link from "next/link";

export default function NotFound() {
  return (
    <div className='mx-auto grid size-full place-items-center px-4 md:px-6 lg:px-8'>
      <div className='w-full max-w-md'>
        <div className='flex flex-col gap-6 rounded-xl border py-6 shadow-2xl'>
          <div className='grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6'>
            <h1 className='text-2xl leading-none font-semibold'>
              Page Not Found.
            </h1>
          </div>
          <div className='px-6'>
            <p className='text-sm'>Could not find requested resource.</p>
          </div>
          <div className='flex items-center justify-end px-6'>
            <Link
              className='cursor-pointer text-sm font-medium text-blue-600 underline-offset-4 transition-all hover:text-blue-600/80 hover:underline'
              href='/'
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
