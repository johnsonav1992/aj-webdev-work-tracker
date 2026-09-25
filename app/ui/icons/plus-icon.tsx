import { iconStyle } from './icon-style.ts';

export function PlusIcon() {
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
      <path d='M12 5v14M5 12h14' />
    </svg>
  );
}
