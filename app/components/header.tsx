import Image from "next/image";
import { ThemeSwitcher } from "./theme";

export default function Header() {
  return (
    <div className='flex h-16 items-center'>
      <header className='mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8'>
        <div className='flex flex-row items-center'>
          <Image src='/icon.svg' alt='Icon' width={40} height={40} priority />
          <span className='text-lg font-medium tracking-tighter dark:font-normal'>
            Realtime Transcribe
          </span>
        </div>
        <div className='flex items-center'>
          <ThemeSwitcher />
        </div>
      </header>
    </div>
  );
}
