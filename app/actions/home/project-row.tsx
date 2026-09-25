import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { Avatar } from '../../ui/avatar.tsx';
import { StatusBadge } from '../../ui/status-badge.tsx';
import { Progress } from './progress.tsx';

type Tone = 'green' | 'blue' | 'amber';
type ProjectStatus = 'planned' | 'active' | 'completed' | 'archived';

const statusTone: Record<ProjectStatus, 'green' | 'amber' | 'blue' | 'gray'> = {
  planned: 'amber',
  active: 'blue',
  completed: 'green',
  archived: 'gray'
};

export const ProjectRow = (
  handle: Handle<{
    initials: string;
    name: string;
    client: string;
    progress: number | null;
    timeSummary: string;
    status: ProjectStatus;
    rate: string;
    tone: Tone;
  }>
) => {
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
        <Avatar initials={handle.props.initials} tint={handle.props.tone} />
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
            <StatusBadge tone={statusTone[handle.props.status]}>
              {handle.props.status[0]!.toUpperCase() + handle.props.status.slice(1)}
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
              <Progress value={handle.props.progress!} />
            </div>
          ) : null}
        </div>
        {hasProgress ? (
          <div mix={css({ '@media (max-width: 650px)': { display: 'none' } })}>
            <Progress value={handle.props.progress!} />
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
