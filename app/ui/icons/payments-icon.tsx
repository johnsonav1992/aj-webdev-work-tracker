import { iconStyle } from './icon-style.ts';

export function PaymentsIcon() {
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
      <rect x='3' y='5' width='18' height='14' rx='2' />
      <path d='M3 10h18M7 15h3' />
    </svg>
  );
}
