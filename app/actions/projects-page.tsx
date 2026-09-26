import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../theme/tokens.ts';
import { WorkspaceLayout } from './workspace/layout.tsx';
import { ProjectCard } from './projects/project-card.tsx';
import { ProjectFilters } from './projects/project-filters.tsx';
import type { ProjectsPageData } from './projects/projects-types.ts';
import { ProjectsSummary } from './projects/projects-summary.tsx';

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
        <div>
          <h1 mix={headingStyle}>Projects</h1>
        </div>
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
