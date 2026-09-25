import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { eyebrowStyle, themeTokens } from '../../theme/tokens.ts';
import { Panel } from '../../ui/panel.tsx';
import type { HomeDashboardData } from './dashboard-types.ts';
import { TimerWidget } from '../public/timer-widget.tsx';

export type TimerCardProps = {
  projectOptions: HomeDashboardData['projectOptions'];
};

export const TimerCard = (handle: Handle<TimerCardProps>) => {
  return () => (
    <Panel>
      <div mix={css({ padding: `${themeTokens.spacing[5]}` })}>
        <div
          mix={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            gap: `${themeTokens.spacing[4]}`,
            marginBottom: `${themeTokens.spacing[4]}`
          })}
        >
          <div>
            <p mix={[eyebrowStyle, css({ marginBottom: `${themeTokens.spacing[1]}` })]}>
              Time tracking
            </p>
            <h2 mix={css({ margin: 0, fontSize: `${themeTokens.typography.size.body}` })}>Timer</h2>
          </div>
          <span
            mix={css({
              color: `${themeTokens.palette.text.muted}`,
              fontSize: `${themeTokens.typography.size.small}`
            })}
          >
            Timer values are not saved to time entries yet.
          </span>
        </div>
        <div
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(135px, 0.62fr)',
            gap: `${themeTokens.spacing[2]}`,
            marginBottom: `${themeTokens.spacing[4]}`,
            '@media (max-width: 560px)': { gridTemplateColumns: '1fr' }
          })}
        >
          <label mix={fieldLabelStyle}>
            <span>Project</span>
            <select
              aria-label='Choose a project'
              mix={fieldStyle}
              defaultValue={handle.props.projectOptions[0]?.id ?? ''}
            >
              {handle.props.projectOptions.length ? (
                handle.props.projectOptions.map((project) => (
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
              aria-label='Task note'
              placeholder='e.g. Build pricing page'
              mix={fieldStyle}
            />
          </label>
        </div>
        <div
          mix={css({
            borderTop: `1px solid ${themeTokens.palette.divider}`,
            paddingTop: `${themeTokens.spacing[4]}`
          })}
        >
          <TimerWidget />
        </div>
      </div>
    </Panel>
  );
};

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
