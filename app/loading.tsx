export default function Loading() {
  return (
    <div className='mx-auto grid min-h-dvh w-full place-items-center p-6 md:p-10'>
      <div className='w-full max-w-md'>
        <div className='flex w-full flex-row items-center justify-center gap-1.5'>
          <svg
            className='size-5 animate-spin'
            width={20}
            height={20}
            strokeWidth='2'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M21 12a9 9 0 1 1-6.219-8.56' />
          </svg>
          <p className='text-lg font-medium'>Loading...</p>
        </div>
      </div>
    </div>
  );
}
