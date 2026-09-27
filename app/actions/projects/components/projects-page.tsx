import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';
import { routes } from '#app/routes.ts';
import { Button } from '#app/ui/button.tsx';
import { WorkspaceLayout } from '#app/actions/workspace/components/layout.tsx';
import { ProjectCard } from './project-card.tsx';
import { ProjectFilters } from './project-filters.tsx';
import type { ProjectsPageData } from '#app/actions/projects/types/projects.ts';
import { ProjectsSummary } from './projects-summary.tsx';

type ProjectsPageProps = {
  csrfToken: string;
  data: ProjectsPageData;
};

export const ProjectsPage = (handle: Handle<ProjectsPageProps>) => {
  return () => (
    <WorkspaceLayout
      activePage='projects'
      csrfToken={handle.props.csrfToken}
      pageTitle='Projects'
    >
      <div mix={pageStyle}>
        <header mix={pageHeadingStyle}>
          <h1 mix={headingStyle}>Projects</h1>
          <Button
            href={routes.projectCreate.index.href()}
            variant='primary'
          >
            New project
          </Button>
        </header>
        <ProjectsSummary metrics={handle.props.data.metrics} />
        <ProjectFilters
          filters={handle.props.data.filters}
          statusCounts={handle.props.data.statusCounts}
        />
        {handle.props.data.projects.length ? (
          <div mix={projectGridStyle}>
            {handle.props.data.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        ) : (
          <section mix={emptyStyle}>
            <h2 mix={emptyHeadingStyle}>
              {handle.props.data.metrics.total === 0 ? 'No projects yet' : 'No matching projects'}
            </h2>
            <p mix={emptyTextStyle}>
              {handle.props.data.metrics.total === 0
                ? 'Projects will appear here when they are added.'
                : 'Change the status or search term and try again.'}
            </p>
          </section>
        )}
      </div>
    </WorkspaceLayout>
  );
};

const pageStyle = css({ paddingTop: `${themeTokens.spacing[8]}` });
const headingStyle = css({
  margin: `${themeTokens.spacing[2]} 0 0`,
  fontSize: 'clamp(27px, 4vw, 35px)',
  lineHeight: 1.15,
  letterSpacing: '-0.045em'
});
const pageHeadingStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: `${themeTokens.spacing[4]}`
});
const projectGridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: `${themeTokens.spacing[3]}`,
  '@media (max-width: 850px)': { gridTemplateColumns: '1fr' }
});
const emptyStyle = css({
  padding: `${themeTokens.spacing[8]} ${themeTokens.spacing[5]}`,
  border: `1px dashed ${themeTokens.palette.dividerStrong}`,
  borderRadius: `${themeTokens.shape.large}`,
  background: `${themeTokens.palette.background.subtle}`,
  textAlign: 'center'
});
const emptyHeadingStyle = css({ margin: 0, fontSize: `${themeTokens.typography.size.section}` });
const emptyTextStyle = css({
  maxWidth: '460px',
  margin: `${themeTokens.spacing[2]} auto 0`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`
});
