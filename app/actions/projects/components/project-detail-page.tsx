import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';
import { formatStatusLabel } from '#app/utils/format-status-label.ts';
import { Button } from '#app/ui/button.tsx';
import { StatusBadge } from '#app/ui/status-badge.tsx';
import { routes } from '#app/routes.ts';
import { WorkspaceLayout } from '#app/actions/workspace/components/layout.tsx';
import { ProjectDetailsPanel } from './project-details-panel.tsx';
import { ProjectHistory } from './project-history.tsx';
import { ProjectSummary } from './project-summary.tsx';
import type { ProjectDetailData } from '#app/actions/projects/types/project-detail.ts';
import { projectStatusTone } from '#app/actions/projects/utils/project-status.ts';

type ProjectDetailPageProps = {
  csrfToken: string;
  data: ProjectDetailData | null;
};

export const ProjectDetailPage = (handle: Handle<ProjectDetailPageProps>) => {
  return () => {
    const data = handle.props.data;

    return (
      <WorkspaceLayout
        activePage='projects'
        csrfToken={handle.props.csrfToken}
        pageTitle={data?.project.name ?? 'Project'}
      >
        <div mix={pageStyle}>
          <Button
            href={routes.projects.href()}
            variant='quiet'
            mix={backButtonStyle}
          >
            ← All projects
          </Button>
          {data ? (
            <>
              <header mix={headingStyle}>
                <div mix={headingTextStyle}>
                  <p mix={clientNameStyle}>{data.client.name}</p>
                  <h1 mix={titleStyle}>{data.project.name}</h1>
                </div>
                <StatusBadge tone={projectStatusTone[data.project.status]}>
                  {formatStatusLabel(data.project.status)}
                </StatusBadge>
              </header>
              {data.project.description ? (
                <p mix={descriptionStyle}>{data.project.description}</p>
              ) : null}
              <ProjectSummary summary={data.summary} />
              <div mix={contentGridStyle}>
                <ProjectHistory
                  payments={data.payments}
                  timeEntries={data.timeEntries}
                />
                <ProjectDetailsPanel
                  client={data.client}
                  project={data.project}
                  summary={data.summary}
                />
              </div>
            </>
          ) : (
            <section mix={notFoundStyle}>
              <h1 mix={notFoundTitleStyle}>Project not found</h1>
              <p mix={notFoundTextStyle}>
                This project may have been removed or you may not have access.
              </p>
            </section>
          )}
        </div>
      </WorkspaceLayout>
    );
  };
};

const pageStyle = css({ paddingTop: `${themeTokens.spacing[5]}` });
const backButtonStyle = css({ marginBottom: `${themeTokens.spacing[5]}` });
const headingStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: `${themeTokens.spacing[4]}`
});
const headingTextStyle = css({ minWidth: 0 });
const clientNameStyle = css({
  margin: 0,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const titleStyle = css({
  margin: `${themeTokens.spacing[1]} 0 0`,
  fontSize: 'clamp(27px, 4vw, 35px)',
  lineHeight: 1.15,
  letterSpacing: '-0.045em',
  overflowWrap: 'anywhere'
});
const descriptionStyle = css({
  maxWidth: '760px',
  margin: `${themeTokens.spacing[3]} 0 0`,
  color: `${themeTokens.palette.text.secondary}`
});
const contentGridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.5fr) minmax(280px, 0.85fr)',
  alignItems: 'start',
  gap: `${themeTokens.spacing[4]}`,
  marginTop: `${themeTokens.spacing[4]}`,
  '@media (max-width: 900px)': { gridTemplateColumns: '1fr' }
});
const notFoundStyle = css({
  marginTop: `${themeTokens.spacing[4]}`,
  padding: `${themeTokens.spacing[6]}`,
  border: `1px solid ${themeTokens.palette.divider}`,
  borderRadius: `${themeTokens.shape.large}`,
  background: `${themeTokens.palette.background.paper}`
});
const notFoundTitleStyle = css({ margin: 0, fontSize: `${themeTokens.typography.size.section}` });
const notFoundTextStyle = css({
  margin: `${themeTokens.spacing[2]} 0 0`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`
});
