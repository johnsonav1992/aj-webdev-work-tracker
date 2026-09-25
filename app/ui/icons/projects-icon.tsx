import { iconStyle } from './icon-style.ts';

export function ProjectsIcon() {
  return () => (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      stroke-width='1.8'
      stroke-linecap='round'
      stroke-linejoin='round'
      mix={iconStyle}
    >
      <path d='m12 3 9 5-9 5-9-5 9-5Z' />
      <path d='m3 12 9 5 9-5M3 16l9 5 9-5' />
    </svg>
  );
}
