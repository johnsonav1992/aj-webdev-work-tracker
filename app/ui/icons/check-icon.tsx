import { iconStyle } from './icon-style.ts';

export const CheckIcon = () => {
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
      <path d='M20 7 10 17l-5-5' />
      <path d='M21 12a9 9 0 1 1-5.3-8.2' />
    </svg>
  );
};
