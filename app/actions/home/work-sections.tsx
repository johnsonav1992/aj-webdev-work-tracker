import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { ArrowIcon } from '../../ui/icons/arrow-icon.tsx';
import { Panel } from '../../ui/panel.tsx';
import { Button } from '../../ui/button.tsx';
import { SectionHeading } from '../../ui/section-heading.tsx';
import type { HomeDashboardData } from './dashboard-types.ts';
import { ProjectRow } from './project-row.tsx';
import { TimeRow } from './time-row.tsx';

export type WorkSectionsProps = Pick<HomeDashboardData, 'projects' | 'timeEntries'>;

export const WorkSections = (handle: Handle<WorkSectionsProps>) => {
  return () => (
    <div mix={css({ display: 'grid', gap: `${themeTokens.spacing[4]}`, minWidth: 0 })}>
      <Panel>
        <div mix={cardPaddingStyle}>
          <SectionHeading
            eyebrow='Your work'
            title='Projects'
            action={
              <Button
                href='#projects'
                variant='quiet'
              >
                All projects <ArrowIcon />
              </Button>
            }
          />
          <div mix={css({ display: 'grid' })}>
            {handle.props.projects.length ? (
              handle.props.projects.map((project) => (
                <ProjectRow
                  key={project.id}
                  {...project}
                />
              ))
            ) : (
              <p mix={emptyStateStyle}>Projects you add will appear here.</p>
            )}
          </div>
        </div>
      </Panel>

      <Panel>
        <div mix={cardPaddingStyle}>
          <SectionHeading
            eyebrow='Latest entries'
            title='Recent time'
            action={
              <Button
                href='#time-tracking'
                variant='quiet'
              >
                View time <ArrowIcon />
              </Button>
            }
          />
          {handle.props.timeEntries.length ? (
            handle.props.timeEntries.map((entry) => (
              <TimeRow
                key={entry.id}
                {...entry}
              />
            ))
          ) : (
            <p mix={emptyStateStyle}>Logged time will appear here.</p>
          )}
        </div>
      </Panel>
    </div>
  );
};

const cardPaddingStyle = css({ padding: `${themeTokens.spacing[5]}` });

const emptyStateStyle = css({
  margin: 0,
  padding: `${themeTokens.spacing[4]} 0`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.small}`
});
