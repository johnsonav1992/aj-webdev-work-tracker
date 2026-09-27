import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { WorkspaceLayout } from '#app/actions/workspace/components/layout.tsx';
import { routes } from '#app/routes.ts';
import { themeTokens } from '#app/theme/tokens.ts';
import { Button } from '#app/ui/button.tsx';
import { Card } from '#app/ui/card.tsx';
import { createDataTable } from '#app/ui/data-table.tsx';

type TimeEntryRow = {
  id: string;
  workDate: string;
  project: string;
  client: string;
  duration: string;
  source: string;
  notes: string;
};

type TimePageProps = {
  csrfToken: string;
  today: string;
  error: 'invalid' | 'project' | null;
  data: {
    projectOptions: Array<{ id: string; label: string }>;
    hasRunningEntry: boolean;
    entries: TimeEntryRow[];
  };
};

const TimeEntryTable = createDataTable<TimeEntryRow>();

export const TimePage = (handle: Handle<TimePageProps>) => {
  return () => (
    <WorkspaceLayout
      activePage='time'
      csrfToken={handle.props.csrfToken}
      pageTitle='Time'
    >
      <div mix={pageStyle}>
        <header mix={pageHeaderStyle}>
          <h1 mix={headingStyle}>Time entries</h1>
          <p mix={descriptionStyle}>Review logged work or add time you tracked elsewhere.</p>
        </header>
        {handle.props.data.hasRunningEntry ? (
          <p
            role='status'
            mix={runningNoticeStyle}
          >
            A timer is running. You can manage it from the Overview page.
          </p>
        ) : null}
        <section
          aria-labelledby='manual-entry-heading'
          mix={formSectionStyle}
        >
          <Card>
            <form
              method='post'
              action={routes.time.create.href()}
              data-rmx-document
              mix={formStyle}
            >
              <div>
                <h2
                  id='manual-entry-heading'
                  mix={sectionHeadingStyle}
                >
                  Add time
                </h2>
                <p mix={sectionDescriptionStyle}>Record past work against one of your projects.</p>
              </div>
              <input
                type='hidden'
                name='_csrf'
                value={handle.props.csrfToken}
              />
              {handle.props.error ? (
                <p
                  role='alert'
                  mix={errorStyle}
                >
                  {handle.props.error === 'project'
                    ? 'That project could not be found. Choose a project from the list and try again.'
                    : 'Enter a valid project, date, and duration of at least one minute.'}
                </p>
              ) : null}
              {handle.props.data.projectOptions.length ? (
                <>
                  <label mix={fieldLabelStyle}>
                    <span>Project</span>
                    <select
                      name='projectId'
                      required
                      mix={fieldStyle}
                    >
                      {handle.props.data.projectOptions.map((project) => (
                        <option
                          key={project.id}
                          value={project.id}
                        >
                          {project.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div mix={formRowStyle}>
                    <label mix={fieldLabelStyle}>
                      <span>Work date</span>
                      <input
                        type='date'
                        name='workDate'
                        defaultValue={handle.props.today}
                        required
                        mix={fieldStyle}
                      />
                    </label>
                    <fieldset mix={durationFieldsetStyle}>
                      <legend mix={fieldLabelTextStyle}>Duration</legend>
                      <div mix={durationInputsStyle}>
                        <label mix={fieldLabelStyle}>
                          <span>Hours</span>
                          <input
                            type='number'
                            name='hours'
                            min='0'
                            step='1'
                            defaultValue='0'
                            required
                            inputMode='numeric'
                            mix={fieldStyle}
                          />
                        </label>
                        <label mix={fieldLabelStyle}>
                          <span>Minutes</span>
                          <input
                            type='number'
                            name='minutes'
                            min='0'
                            max='59'
                            step='1'
                            defaultValue='0'
                            required
                            inputMode='numeric'
                            mix={fieldStyle}
                          />
                        </label>
                      </div>
                    </fieldset>
                  </div>
                  <label mix={fieldLabelStyle}>
                    <span>
                      Notes <span mix={optionalStyle}>Optional</span>
                    </span>
                    <textarea
                      name='notes'
                      rows={3}
                      maxLength={2000}
                      mix={fieldStyle}
                    />
                  </label>
                  <div mix={formActionsStyle}>
                    <Button
                      type='submit'
                      variant='primary'
                    >
                      Save time
                    </Button>
                  </div>
                </>
              ) : (
                <div mix={noProjectsStyle}>
                  <p>You’ll need a project before you can record time.</p>
                  <Button
                    href={routes.projectCreate.index.href()}
                    variant='primary'
                  >
                    Create a project
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </section>
        <section
          aria-labelledby='entry-history-heading'
          mix={historySectionStyle}
        >
          <div mix={historyHeadingStyle}>
            <h2
              id='entry-history-heading'
              mix={sectionHeadingStyle}
            >
              Logged time
            </h2>
            <span mix={entryCountStyle}>{handle.props.data.entries.length} entries</span>
          </div>
          <TimeEntryTable
            ariaLabel='Logged time entries'
            columns={[
              {
                id: 'date',
                header: 'Date',
                width: '130px',
                renderCell: (entry) => entry.workDate
              },
              {
                id: 'project',
                header: 'Project',
                rowHeader: true,
                minWidth: '190px',
                renderCell: (entry) => (
                  <span mix={projectCellStyle}>
                    <strong>{entry.project}</strong>
                    <small>{entry.client}</small>
                  </span>
                )
              },
              {
                id: 'duration',
                header: 'Duration',
                width: '110px',
                align: 'end',
                renderCell: (entry) => entry.duration
              },
              {
                id: 'source',
                header: 'Source',
                width: '100px',
                renderCell: (entry) => entry.source
              },
              {
                id: 'notes',
                header: 'Notes',
                minWidth: '220px',
                renderCell: (entry) => entry.notes
              }
            ]}
            rows={handle.props.data.entries}
            getRowId={(entry) => entry.id}
            emptyMessage='No time entries yet. Add past work above or start a timer from Overview.'
          />
        </section>
      </div>
    </WorkspaceLayout>
  );
};

const pageStyle = css({ paddingTop: `${themeTokens.spacing[5]}` });
const pageHeaderStyle = css({ marginBottom: `${themeTokens.spacing[5]}` });
const headingStyle = css({
  margin: 0,
  fontSize: 'clamp(27px, 4vw, 35px)',
  lineHeight: 1.15,
  letterSpacing: '-0.045em'
});
const descriptionStyle = css({
  margin: `${themeTokens.spacing[2]} 0 0`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const runningNoticeStyle = css({
  margin: `0 0 ${themeTokens.spacing[4]}`,
  padding: `${themeTokens.spacing[3]} ${themeTokens.spacing[4]}`,
  border: `1px solid ${themeTokens.palette.info.main}`,
  borderRadius: `${themeTokens.shape.large}`,
  background: `${themeTokens.palette.info.light}`,
  color: `${themeTokens.palette.text.primary}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const formSectionStyle = css({ maxWidth: '760px' });
const formStyle = css({ display: 'grid', gap: `${themeTokens.spacing[4]}` });
const sectionHeadingStyle = css({
  margin: 0,
  fontSize: `${themeTokens.typography.size.section}`,
  letterSpacing: '-0.02em'
});
const sectionDescriptionStyle = css({
  margin: `${themeTokens.spacing[1]} 0 0`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const fieldLabelStyle = css({
  display: 'grid',
  gap: `${themeTokens.spacing[1]}`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`,
  fontWeight: `${themeTokens.typography.weight.semibold}`
});
const fieldLabelTextStyle = css({
  padding: 0,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`,
  fontWeight: `${themeTokens.typography.weight.semibold}`
});
const fieldStyle = css({
  width: '100%',
  minHeight: '42px',
  padding: `${themeTokens.spacing[2]} ${themeTokens.spacing[3]}`,
  border: `1px solid ${themeTokens.palette.dividerStrong}`,
  borderRadius: `${themeTokens.shape.large}`,
  background: `${themeTokens.palette.background.paper}`,
  color: `${themeTokens.palette.text.primary}`,
  font: 'inherit',
  resize: 'vertical',
  '&:focus-visible': {
    outline: `2px solid ${themeTokens.palette.focus}`,
    outlineOffset: themeTokens.spacing[1]
  }
});
const formRowStyle = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: `${themeTokens.spacing[4]}`,
  '@media (max-width: 620px)': { gridTemplateColumns: '1fr' }
});
const durationFieldsetStyle = css({
  minWidth: 0,
  margin: 0,
  padding: 0,
  border: 0
});
const durationInputsStyle = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: `${themeTokens.spacing[3]}`
});
const optionalStyle = css({
  color: `${themeTokens.palette.text.muted}`,
  fontWeight: `${themeTokens.typography.weight.medium}`
});
const formActionsStyle = css({ display: 'flex', justifyContent: 'flex-end' });
const errorStyle = css({
  margin: 0,
  color: `${themeTokens.palette.error.dark}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const noProjectsStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: `${themeTokens.spacing[3]}`,
  color: `${themeTokens.palette.text.secondary}`
});
const historySectionStyle = css({ marginTop: `${themeTokens.spacing[8]}` });
const historyHeadingStyle = css({
  display: 'flex',
  alignItems: 'baseline',
  gap: `${themeTokens.spacing[3]}`,
  marginBottom: `${themeTokens.spacing[3]}`
});
const entryCountStyle = css({
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`
});
const projectCellStyle = css({ display: 'grid', gap: `${themeTokens.spacing[1]}` });
