import { LoaderIcon } from "./components/icons";

export default function Loading() {
  return (
    <div className='mx-auto grid size-full place-items-center px-4 md:px-6 lg:px-8'>
      <div className='w-full max-w-md'>
        <div className='flex w-full flex-row items-center justify-center gap-1.5 text-lg font-medium'>
          <LoaderIcon className='size-5 animate-spin' />
          <span>Loading...</span>
        </div>
      </div>
    </div>
  );
}
