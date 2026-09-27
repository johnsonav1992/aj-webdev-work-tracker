import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';
import { formatCurrency } from '#app/utils/format-currency.ts';
import { formatStatusLabel } from '#app/utils/format-status-label.ts';
import { Avatar } from '#app/ui/avatar.tsx';
import { ProgressBar } from '#app/ui/progress-bar.tsx';
import { StatusBadge } from '#app/ui/status-badge.tsx';
import { Card } from '#app/ui/card.tsx';
import { routes } from '#app/routes.ts';
import type { ProjectCardData } from '#app/actions/projects/types/projects.ts';
import { projectStatusTone } from '#app/actions/projects/utils/project-status.ts';

type ProjectCardProps = {
  project: ProjectCardData;
};

export const ProjectCard = (handle: Handle<ProjectCardProps>) => {
  return () => {
    const project = handle.props.project;
    const statusLabel = formatStatusLabel(project.status);
    const trackedCap = project.hourCap ? `${project.hourCap / 60}h` : null;
    const invoiceCap =
      project.invoiceCapMinor === null
        ? null
        : formatCurrency(project.invoiceCapMinor, project.currency);

    return (
      <Card
        as='article'
        padding='compact'
      >
        <header mix={headerStyle}>
          <Avatar
            initials={project.initials}
            tint={project.accent}
          />
          <div mix={titleStyle}>
            <p mix={clientStyle}>{project.client}</p>
            <h2 mix={projectTitleStyle}>
              <a
                href={routes.project.href({ projectId: project.id })}
                mix={titleLinkStyle}
              >
                {project.name}
              </a>
            </h2>
          </div>
          <StatusBadge tone={projectStatusTone[project.status]}>{statusLabel}</StatusBadge>
        </header>
        {project.description ? <p mix={descriptionStyle}>{project.description}</p> : null}
        <div mix={statsStyle}>
          <div>
            <span mix={statLabelStyle}>Time tracked</span>
            <strong mix={statValueStyle}>{project.trackedTime}</strong>
          </div>
          <div>
            <span mix={statLabelStyle}>Work value</span>
            <strong mix={statValueStyle}>{project.loggedValue}</strong>
          </div>
          <div>
            <span mix={statLabelStyle}>Sessions</span>
            <strong mix={statValueStyle}>{project.entryCount}</strong>
          </div>
        </div>
        {project.progress !== null ? (
          <div mix={progressSectionStyle}>
            <div mix={progressHeaderStyle}>
              <span>Time budget</span>
              <span>
                {project.trackedTime} <span aria-hidden='true'>/</span> {trackedCap}
              </span>
            </div>
            <ProgressBar
              label={`${project.name} time budget`}
              value={project.progress}
            />
          </div>
        ) : null}
        <footer mix={footerStyle}>
          <span>
            {project.completedOn
              ? `Completed ${project.completedOn}`
              : project.startedOn
                ? `Started ${project.startedOn}`
                : 'No start date'}
          </span>
          {invoiceCap ? <span>Budget {invoiceCap}</span> : null}
        </footer>
      </Card>
    );
  };
};

const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: `${themeTokens.spacing[3]}`
});
const titleStyle = css({ minWidth: 0, flex: 1 });
const clientStyle = css({
  margin: 0,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`
});
const projectTitleStyle = css({
  margin: `${themeTokens.spacing[1]} 0 0`,
  overflowWrap: 'anywhere',
  fontSize: `${themeTokens.typography.size.section}`,
  lineHeight: 1.25
});
const titleLinkStyle = css({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': { color: `${themeTokens.palette.primary.dark}` }
});
const descriptionStyle = css({
  margin: `${themeTokens.spacing[3]} 0 0`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const statsStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: `${themeTokens.spacing[3]}`,
  marginTop: `${themeTokens.spacing[4]}`,
  paddingTop: `${themeTokens.spacing[3]}`,
  borderTop: `1px solid ${themeTokens.palette.divider}`
});
const statLabelStyle = css({
  display: 'block',
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`
});
const statValueStyle = css({
  display: 'block',
  marginTop: `${themeTokens.spacing[1]}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const progressSectionStyle = css({ marginTop: `${themeTokens.spacing[3]}` });
const progressHeaderStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  gap: `${themeTokens.spacing[2]}`,
  marginBottom: `${themeTokens.spacing[2]}`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`
});
const footerStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: `${themeTokens.spacing[2]}`,
  marginTop: `${themeTokens.spacing[3]}`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`
});
