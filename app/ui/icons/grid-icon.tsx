import { iconStyle } from './icon-style.ts';

export const GridIcon = () => {
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
      <rect
        x='3'
        y='3'
        width='7'
        height='7'
        rx='1.5'
      />
      <rect
        x='14'
        y='3'
        width='7'
        height='7'
        rx='1.5'
      />
      <rect
        x='3'
        y='14'
        width='7'
        height='7'
        rx='1.5'
      />
      <rect
        x='14'
        y='14'
        width='7'
        height='7'
        rx='1.5'
      />
    </svg>
  );
};
