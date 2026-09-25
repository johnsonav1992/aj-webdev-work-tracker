import { iconStyle } from './icon-style.ts';

export const ClockIcon = () => {
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
      <circle
        cx='12'
        cy='12'
        r='9'
      />
      <path d='M12 7v5l3 2' />
    </svg>
  );
};
