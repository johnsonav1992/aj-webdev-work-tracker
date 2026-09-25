import { iconStyle } from './icon-style.ts';

export const BrandMarkIcon = () => {
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
      <path d='M5 18V6l7 7 7-7v12' />
    </svg>
  );
};
