import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';
import type { AccentTone } from '#app/theme/types/accent-tone.ts';
import type { ProjectStatus } from '#app/db/types/project.ts';
import { formatStatusLabel } from '#app/utils/format-status-label.ts';
import { Avatar } from '#app/ui/avatar.tsx';
import { ProgressBar } from '#app/ui/progress-bar.tsx';
import { StatusBadge } from '#app/ui/status-badge.tsx';
import { projectStatusTone } from '#app/actions/projects/utils/project-status.ts';

export interface ProjectRowProps {
  initials: string;
  name: string;
  client: string;
  progress: number | null;
  timeSummary: string;
  status: ProjectStatus;
  rate: string;
  tone: AccentTone;
}

export const ProjectRow = (handle: Handle<ProjectRowProps>) => {
  return () => {
    const hasProgress = handle.props.progress !== null;

    return (
      <div
        mix={css({
          display: 'grid',
          gridTemplateColumns: hasProgress
            ? '36px minmax(0, 1fr) 110px auto'
            : '36px minmax(0, 1fr) auto',
          gap: `${themeTokens.spacing[3]}`,
          alignItems: 'center',
          padding: `${themeTokens.spacing[3]} 0`,
          borderTop: `1px solid ${themeTokens.palette.divider}`,
          '@media (max-width: 650px)': {
            gridTemplateColumns: hasProgress
              ? '36px minmax(0, 1fr) auto'
              : '36px minmax(0, 1fr) auto'
          }
        })}
      >
        <Avatar
          initials={handle.props.initials}
          tint={handle.props.tone}
        />
        <div mix={css({ minWidth: 0 })}>
          <div
            mix={css({
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: `${themeTokens.spacing[2]}`
            })}
          >
            <strong mix={css({ fontSize: `${themeTokens.typography.size.small}` })}>
              {handle.props.name}
            </strong>
            <StatusBadge tone={projectStatusTone[handle.props.status]}>
              {formatStatusLabel(handle.props.status)}
            </StatusBadge>
          </div>
          <p
            mix={css({
              margin: `${themeTokens.spacing[1]} 0 0`,
              color: `${themeTokens.palette.text.muted}`,
              fontSize: `${themeTokens.typography.size.caption}`
            })}
          >
            {handle.props.client} <span aria-hidden='true'>·</span> {handle.props.timeSummary}
          </p>
          {hasProgress ? (
            <div
              mix={css({
                display: 'none',
                marginTop: `${themeTokens.spacing[2]}`,
                '@media (max-width: 650px)': { display: 'block' }
              })}
            >
              <ProgressBar
                label={`${handle.props.name} time budget`}
                value={handle.props.progress!}
                variant='gradient'
              />
            </div>
          ) : null}
        </div>
        {hasProgress ? (
          <div mix={css({ '@media (max-width: 650px)': { display: 'none' } })}>
            <ProgressBar
              label={`${handle.props.name} time budget`}
              value={handle.props.progress!}
              variant='gradient'
            />
          </div>
        ) : null}
        <strong
          mix={css({
            fontSize: `${themeTokens.typography.size.caption}`,
            textAlign: 'right',
            whiteSpace: 'nowrap'
          })}
        >
          {handle.props.rate}
        </strong>
      </div>
    );
  };
};
