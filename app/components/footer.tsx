import { GitHubIcon } from "./icons";

export default function Footer() {
  const linkClasses =
    "select-none inline-flex bg-transparent cursor-pointer transition-all duration-200 ease-in-out text-gray-500 dark:text-gray-400 will-change-transform hover:text-gray-900 dark:hover:text-white";

  return (
    <div className='flex h-16 w-full items-center bg-white/80 dark:bg-black/80'>
      <footer className='mx-auto flex w-full max-w-7xl items-center justify-center gap-4 px-4 text-muted-foreground md:px-6 lg:px-8'>
        <span>share it</span>
        <a
          href='https://github.com/egarrisxn/realtime-transcribe'
          target='_blank'
          rel='noreferrer'
          aria-label='GitHub Repository'
          className={`${linkClasses} hover:bg-gray-100 dark:hover:bg-gray-800`}
        >
          <GitHubIcon />
        </a>
        <div className='h-7 w-px border-l border-muted-foreground'>&nbsp;</div>
        <a
          href='https://egxo.dev'
          target='_blank'
          rel='noreferrer'
          aria-label='Contact Me'
          className={`${linkClasses} font-semibold hover:bg-gray-50/50 dark:hover:bg-gray-950/50`}
        >
          contact me
        </a>
      </footer>
    </div>
  );
}
