import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';
import { ArrowIcon } from '#app/ui/icons/arrow-icon.tsx';
import { Card } from '#app/ui/card.tsx';
import { Button } from '#app/ui/button.tsx';
import { SectionHeading } from '#app/ui/section-heading.tsx';
import { routes } from '#app/routes.ts';
import type { HomeDashboardData } from '#app/actions/home/types/dashboard.ts';
import { ProjectRow } from './project-row.tsx';
import { TimeRow } from './time-row.tsx';
import { HomeEmptyState } from './empty-state.tsx';

export type WorkSectionsProps = Pick<HomeDashboardData, 'projects' | 'timeEntries'>;

export const WorkSections = (handle: Handle<WorkSectionsProps>) => {
  return () => (
    <div mix={css({ display: 'grid', gap: `${themeTokens.spacing[4]}`, minWidth: 0 })}>
      <Card padding='comfortable'>
        <SectionHeading
          eyebrow='Workspace'
          title='Projects'
          action={
            <Button
              href={routes.projects.href()}
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
            <HomeEmptyState>No projects yet.</HomeEmptyState>
          )}
        </div>
      </Card>
      <Card padding='comfortable'>
        <SectionHeading
          eyebrow='Time tracking'
          title='Recent entries'
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
          <HomeEmptyState>No time entries yet.</HomeEmptyState>
        )}
      </Card>
    </div>
  );
};
