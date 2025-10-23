interface IconProps {
  className?: string;
}

const CircleCheckIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='10' />
    <path d='m9 12 2 2 4-4' />
  </svg>
);

const CircleXIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='10' />
    <path d='m15 9-6 6' />
    <path d='m9 9 6 6' />
  </svg>
);

const GitHubIcon = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M16 22.027v-2.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7a5.44 5.44 0 0 0-1.5-3.75a5.07 5.07 0 0 0-.09-3.77s-1.18-.35-3.91 1.48a13.4 13.4 0 0 0-7 0c-2.73-1.83-3.91-1.48-3.91-1.48A5.07 5.07 0 0 0 5 5.797a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58v2.87'></path>
      <path d='M9 20.027c-3 .973-5.5 0-7-3'></path>
    </svg>
  );
};

const LoaderIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M12 2v4' />
    <path d='m16.2 7.8 2.9-2.9' />
    <path d='M18 12h4' />
    <path d='m16.2 16.2 2.9 2.9' />
    <path d='M12 18v4' />
    <path d='m4.9 19.1 2.9-2.9' />
    <path d='M2 12h4' />
    <path d='m4.9 4.9 2.9 2.9' />
  </svg>
);

const LockIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
    <path d='M7 11V7a5 5 0 0 1 10 0v4' />
  </svg>
);

const MoonStarIcon = ({ className }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M18 5h4' />
    <path d='M20 3v4' />
    <path d='M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401' />
  </svg>
);

const SunIcon = ({ className }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='4' />
    <path d='M12 2v2' />
    <path d='M12 20v2' />
    <path d='m4.93 4.93 1.41 1.41' />
    <path d='m17.66 17.66 1.41 1.41' />
    <path d='M2 12h2' />
    <path d='M20 12h2' />
    <path d='m6.34 17.66-1.41 1.41' />
    <path d='m19.07 4.93-1.41 1.41' />
  </svg>
);

export {
  CircleCheckIcon,
  CircleXIcon,
  GitHubIcon,
  LoaderIcon,
  LockIcon,
  MoonStarIcon,
  SunIcon,
};
