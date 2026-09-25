import { clientEntry, css, type Handle, on } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';

const timerButtonStyle = css({
  appearance: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: `${themeTokens.spacing[2]}`,
  minHeight: '40px',
  padding: '9px 14px',
  border: `1px solid ${themeTokens.palette.primary.main}`,
  borderRadius: `${themeTokens.shape.small}`,
  background: `${themeTokens.palette.primary.main}`,
  color: `${themeTokens.palette.primary.contrastText}`,
  fontWeight: `${themeTokens.typography.weight.semibold}`,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'background 140ms ease, border-color 140ms ease, transform 140ms ease',
  '&:hover': {
    background: `${themeTokens.palette.primary.dark}`,
    borderColor: `${themeTokens.palette.primary.dark}`
  },
  '&:active': { transform: 'translateY(1px)' }
});

export const TimerWidget = clientEntry(import.meta.url, function TimerWidget(handle: Handle) {
  let elapsed = 0;
  let startedAt: number | null = null;
  let interval: ReturnType<typeof setInterval> | undefined;
  let running = false;

  const clearTicker = () => {
    if (interval) clearInterval(interval);
    interval = undefined;
  };

  handle.signal.addEventListener('abort', clearTicker, { once: true });

  return () => {
    const currentElapsed = elapsed + (running && startedAt !== null ? Date.now() - startedAt : 0);

    return (
      <div
        mix={css({
          display: 'flex',
          alignItems: 'center',
          gap: `${themeTokens.spacing[4]}`,
          flexWrap: 'wrap'
        })}
      >
        <div
          aria-live='off'
          mix={css({
            minWidth: '124px',
            color: `${themeTokens.palette.text.primary}`,
            fontSize: `${themeTokens.typography.size.timer}`,
            fontVariantNumeric: 'tabular-nums',
            fontWeight: `${themeTokens.typography.weight.semibold}`,
            letterSpacing: '-0.04em'
          })}
        >
          {formatDuration(currentElapsed)}
        </div>
        <button
          type='button'
          aria-label={running ? 'Pause timer' : 'Start timer'}
          mix={[
            timerButtonStyle,
            on('click', () => {
              if (running && startedAt !== null) {
                elapsed += Date.now() - startedAt;
                startedAt = null;
                running = false;
                clearTicker();
              } else {
                startedAt = Date.now();
                running = true;
                interval = setInterval(() => handle.update(), 1000);
              }

              handle.update();
            })
          ]}
        >
          <span aria-hidden='true'>{running ? 'Ⅱ' : '▶'}</span>
          {running ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start timer'}
        </button>
        {running ? (
          <span
            mix={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: `${themeTokens.spacing[2]}`,
              color: `${themeTokens.palette.success.dark}`,
              fontSize: `${themeTokens.typography.size.small}`,
              fontWeight: `${themeTokens.typography.weight.semibold}`
            })}
          >
            <span
              aria-hidden='true'
              mix={css({
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: `${themeTokens.palette.success.main}`
              })}
            />
            Tracking now
          </span>
        ) : null}
      </div>
    );
  };
});

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
