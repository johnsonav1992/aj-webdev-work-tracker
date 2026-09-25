import { iconStyle } from './icon-style.ts';

export function ArrowIcon() {
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
      <path d='M5 12h14M13 6l6 6-6 6' />
    </svg>
  );
}
