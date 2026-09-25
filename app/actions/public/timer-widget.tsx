import { clientEntry, css, type Handle, on } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { Button } from '../../ui/button.tsx';
import { Temporal } from '../../utils/temporal-browser.ts';
import type { TemporalDuration, TemporalInstant } from '../../utils/temporal-types.ts';

export const TimerWidget = clientEntry(`${import.meta.url}#TimerWidget`, (handle: Handle) => {
  let elapsed: TemporalDuration = Temporal.Duration.from({ seconds: 0 });
  let startedAt: TemporalInstant | null = null;
  let interval: ReturnType<typeof setInterval> | undefined;
  let running = false;

  const clearTicker = () => {
    if (interval) clearInterval(interval);
    interval = undefined;
  };

  handle.signal.addEventListener('abort', clearTicker, { once: true });

  return () => {
    const currentElapsed =
      running && startedAt !== null
        ? elapsed.add(startedAt.until(Temporal.Now.instant()))
        : elapsed;

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
        <Button
          type='button'
          aria-label={running ? 'Pause timer' : 'Start timer'}
          variant='primary'
          mix={on('click', () => {
            if (running && startedAt !== null) {
              elapsed = elapsed.add(startedAt.until(Temporal.Now.instant()));
              startedAt = null;
              running = false;
              clearTicker();
            } else {
              startedAt = Temporal.Now.instant();
              running = true;
              interval = setInterval(() => handle.update(), 1000);
            }

            handle.update();
          })}
        >
          <span aria-hidden='true'>{running ? 'Ⅱ' : '▶'}</span>
          {running ? 'Pause' : elapsed.total({ unit: 'seconds' }) > 0 ? 'Resume' : 'Start timer'}
        </Button>
        {running ? (
          <span
            mix={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: `${themeTokens.spacing[2]}`,
              color: `${themeTokens.palette.success.main}`,
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
            Running
          </span>
        ) : null}
      </div>
    );
  };
});

const formatDuration = (duration: TemporalDuration) => {
  const totalSeconds = Math.floor(duration.total({ unit: 'seconds' }));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
