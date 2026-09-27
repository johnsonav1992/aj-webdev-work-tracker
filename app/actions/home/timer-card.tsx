import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { routes } from '../../routes.ts';
import { themeTokens } from '../../theme/tokens.ts';
import { Button } from '../../ui/button.tsx';
import { Card } from '../../ui/card.tsx';
import type { HomeDashboardData } from './dashboard-types.ts';
import { TimerWidget } from '../public/timer-widget.tsx';

type TimerCardProps = {
  csrfToken: string;
  data: Pick<HomeDashboardData, 'activeTimer' | 'projectOptions'>;
};

export const TimerCard = (handle: Handle<TimerCardProps>) => {
  return () => {
    const { activeTimer, projectOptions } = handle.props.data;

    return (
      <Card>
        <div mix={cardContentStyle}>
          <div mix={headingStyle}>
            <div>
              <p mix={eyebrowStyle}>Time tracking</p>
              <h2 mix={titleStyle}>
                {activeTimer
                  ? activeTimer.startedAt === null
                    ? 'Timer paused'
                    : 'Timer running'
                  : 'Timer'}
              </h2>
            </div>
            {activeTimer ? (
              <span mix={runningStyle}>
                {activeTimer.startedAt === null ? 'Paused' : 'Running'} · one session
              </span>
            ) : (
              <span mix={mutedStyle}>Sessions are saved when you stop the timer.</span>
            )}
          </div>
          {activeTimer ? (
            <div mix={runningSessionStyle}>
              <div>
                <strong>
                  {activeTimer.client} · {activeTimer.project}
                </strong>
                {activeTimer.notes ? <p mix={noteStyle}>{activeTimer.notes}</p> : null}
              </div>
              <div mix={activeTimerControlsStyle}>
                <TimerWidget
                  startedAt={activeTimer.startedAt}
                  durationSeconds={activeTimer.durationSeconds}
                />
                <div mix={timerControlsStyle}>
                  <form
                    method='post'
                    action={
                      activeTimer.startedAt === null
                        ? routes.time.resume.href()
                        : routes.time.pause.href()
                    }
                    data-rmx-document
                  >
                    <input
                      type='hidden'
                      name='_csrf'
                      value={handle.props.csrfToken}
                    />
                    <input
                      type='hidden'
                      name='entryId'
                      value={activeTimer.id}
                    />
                    <Button
                      type='submit'
                      variant='quiet'
                    >
                      {activeTimer.startedAt === null ? 'Resume' : 'Pause'}
                    </Button>
                  </form>
                  <form
                    method='post'
                    action={routes.time.stop.href()}
                    data-rmx-document
                  >
                    <input
                      type='hidden'
                      name='_csrf'
                      value={handle.props.csrfToken}
                    />
                    <input
                      type='hidden'
                      name='entryId'
                      value={activeTimer.id}
                    />
                    <Button
                      type='submit'
                      variant='primary'
                    >
                      Stop
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <form
              method='post'
              action={routes.time.start.href()}
              data-rmx-document
            >
              <input
                type='hidden'
                name='_csrf'
                value={handle.props.csrfToken}
              />
              <div mix={fieldsStyle}>
                <label mix={fieldLabelStyle}>
                  <span>Project</span>
                  <select
                    name='projectId'
                    aria-label='Choose a project'
                    mix={fieldStyle}
                    defaultValue={projectOptions[0]?.id ?? ''}
                    required
                    disabled={!projectOptions.length}
                  >
                    {projectOptions.length ? (
                      projectOptions.map((project) => (
                        <option
                          key={project.id}
                          value={project.id}
                        >
                          {project.client} · {project.name}
                        </option>
                      ))
                    ) : (
                      <option value=''>No active projects</option>
                    )}
                  </select>
                </label>
                <label mix={fieldLabelStyle}>
                  <span>Task note</span>
                  <input
                    name='notes'
                    aria-label='Task note'
                    placeholder='e.g. Build pricing page'
                    maxLength={2000}
                    mix={fieldStyle}
                  />
                </label>
              </div>
              <div mix={startControlsStyle}>
                <TimerWidget
                  startedAt={null}
                  durationSeconds={0}
                />
                <Button
                  type='submit'
                  variant='primary'
                  disabled={!projectOptions.length}
                >
                  {projectOptions.length ? 'Start timer' : 'No active projects'}
                </Button>
              </div>
              {!projectOptions.length ? (
                <p mix={noProjectsStyle}>Create or activate a project before tracking time.</p>
              ) : null}
            </form>
          )}
        </div>
      </Card>
    );
  };
};

const cardContentStyle = css({ padding: `${themeTokens.spacing[5]}` });
const headingStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'start',
  gap: `${themeTokens.spacing[4]}`,
  marginBottom: `${themeTokens.spacing[4]}`,
  '@media (max-width: 560px)': { flexDirection: 'column' }
});
const eyebrowStyle = css({
  margin: `0 0 ${themeTokens.spacing[1]}`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`,
  fontWeight: `${themeTokens.typography.weight.semibold}`,
  textTransform: 'uppercase',
  letterSpacing: '0.08em'
});
const titleStyle = css({ margin: 0, fontSize: `${themeTokens.typography.size.body}` });
const mutedStyle = css({
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const runningStyle = css({
  color: `${themeTokens.palette.success.main}`,
  fontSize: `${themeTokens.typography.size.small}`,
  fontWeight: `${themeTokens.typography.weight.semibold}`
});
const fieldsStyle = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(135px, 0.62fr)',
  gap: `${themeTokens.spacing[2]}`,
  marginBottom: `${themeTokens.spacing[4]}`,
  '@media (max-width: 560px)': { gridTemplateColumns: '1fr' }
});
const fieldLabelStyle = css({
  display: 'grid',
  gap: `${themeTokens.spacing[1]}`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`,
  fontWeight: `${themeTokens.typography.weight.semibold}`
});
const fieldStyle = css({
  width: '100%',
  height: '40px',
  minWidth: 0,
  padding: `0 ${themeTokens.spacing[3]}`,
  border: `1px solid ${themeTokens.palette.divider}`,
  borderRadius: `${themeTokens.shape.large}`,
  background: `${themeTokens.palette.background.paper}`,
  color: `${themeTokens.palette.text.primary}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const startControlsStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: `${themeTokens.spacing[4]}`,
  borderTop: `1px solid ${themeTokens.palette.divider}`,
  paddingTop: `${themeTokens.spacing[4]}`
});
const runningSessionStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: `${themeTokens.spacing[4]}`,
  borderTop: `1px solid ${themeTokens.palette.divider}`,
  paddingTop: `${themeTokens.spacing[4]}`,
  '@media (max-width: 560px)': { alignItems: 'start', flexDirection: 'column' }
});
const timerControlsStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: `${themeTokens.spacing[4]}`
});
const activeTimerControlsStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: `${themeTokens.spacing[4]}`,
  '@media (max-width: 560px)': { flexWrap: 'wrap' }
});
const noteStyle = css({
  margin: `${themeTokens.spacing[1]} 0 0`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const noProjectsStyle = css({
  margin: `${themeTokens.spacing[3]} 0 0`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.small}`
});
