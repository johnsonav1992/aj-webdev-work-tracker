import { clientEntry, css, type Handle } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';
import { Temporal } from '#app/utils/temporal-browser.ts';
import type { TemporalDuration } from '#app/utils/temporal/types.ts';

type TimerWidgetProps = {
  startedAt: number | null;
  durationSeconds: number;
};

export const TimerWidget = clientEntry(
  `${import.meta.url}#TimerWidget`,
  (handle: Handle<TimerWidgetProps>) => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let tickerScheduled = false;
    const clearTicker = () => {
      if (interval) clearInterval(interval);
      interval = undefined;
    };

    handle.signal.addEventListener('abort', clearTicker, { once: true });

    return () => {
      const startedAt = handle.props.startedAt;

      if (startedAt !== null && !interval && !tickerScheduled) {
        tickerScheduled = true;
        handle.queueTask(() => {
          tickerScheduled = false;

          if (!handle.signal.aborted && handle.props.startedAt !== null && !interval) {
            interval = setInterval(() => handle.update(), 1000);
          }
        });
      }

      if (startedAt === null) clearTicker();

      const elapsed = Temporal.Duration.from({ seconds: handle.props.durationSeconds }).add(
        startedAt === null
          ? Temporal.Duration.from({ seconds: 0 })
          : Temporal.Instant.fromEpochMilliseconds(startedAt).until(Temporal.Now.instant())
      );

      return <div mix={timerStyle}>{formatDuration(elapsed)}</div>;
    };
  }
);

const timerStyle = css({
  minWidth: '124px',
  color: `${themeTokens.palette.text.primary}`,
  fontSize: `${themeTokens.typography.size.timer}`,
  fontVariantNumeric: 'tabular-nums',
  fontWeight: `${themeTokens.typography.weight.semibold}`,
  letterSpacing: '-0.04em'
});

const formatDuration = (duration: TemporalDuration) => {
  const totalSeconds = Math.max(0, Math.floor(duration.total({ unit: 'seconds' })));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
