import { clientEntry, css, on, type Handle } from 'remix/ui'

import { primaryButtonStyle } from '../../theme/tokens.ts'

export const TimerWidget = clientEntry(
  import.meta.url,
  function TimerWidget(handle: Handle) {
    let elapsed = 0
    let startedAt: number | null = null
    let interval: ReturnType<typeof setInterval> | undefined
    let running = false

    const clearTicker = () => {
      if (interval) clearInterval(interval)
      interval = undefined
    }

    handle.signal.addEventListener('abort', clearTicker, { once: true })

    return () => {
      let currentElapsed = elapsed + (running && startedAt !== null ? Date.now() - startedAt : 0)

      return (
        <div mix={css({ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' })}>
          <div aria-live="off" mix={css({ minWidth: '124px', color: 'var(--ink)', fontSize: '25px', fontVariantNumeric: 'tabular-nums', fontWeight: 650, letterSpacing: '-0.04em' })}>
            {formatDuration(currentElapsed)}
          </div>
          <button
            type="button"
            aria-label={running ? 'Pause timer' : 'Start timer'}
            mix={[
              primaryButtonStyle,
              on('click', () => {
                if (running && startedAt !== null) {
                  elapsed += Date.now() - startedAt
                  startedAt = null
                  running = false
                  clearTicker()
                } else {
                  startedAt = Date.now()
                  running = true
                  interval = setInterval(() => handle.update(), 1000)
                }
                handle.update()
              }),
            ]}
          >
            <span aria-hidden="true">{running ? 'Ⅱ' : '▶'}</span>
            {running ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start timer'}
          </button>
          {running ? <span mix={css({ display: 'inline-flex', alignItems: 'center', gap: '7px', color: 'var(--green-dark)', fontSize: '12px', fontWeight: 600 })}><span aria-hidden="true" mix={css({ width: '7px', height: '7px', borderRadius: '50%', background: '#3b9b6b' })} />Tracking now</span> : null}
        </div>
      )
    }
  },
)

function formatDuration(milliseconds: number) {
  let totalSeconds = Math.floor(milliseconds / 1000)
  let hours = Math.floor(totalSeconds / 3600)
  let minutes = Math.floor((totalSeconds % 3600) / 60)
  let seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
