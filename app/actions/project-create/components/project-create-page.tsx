import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { routes } from '#app/routes.ts';
import { themeTokens } from '#app/theme/tokens.ts';
import { Button } from '#app/ui/button.tsx';
import { Card } from '#app/ui/card.tsx';
import { TextField } from '#app/ui/text-field.tsx';
import { WorkspaceLayout } from '#app/actions/workspace/components/layout.tsx';

type ProjectCreatePageProps = {
  csrfToken: string;
  clients: Array<{ id: string; name: string }>;
  error: 'invalid' | 'client' | null;
};

export const ProjectCreatePage = (handle: Handle<ProjectCreatePageProps>) => {
  return () => (
    <WorkspaceLayout
      activePage='projects'
      csrfToken={handle.props.csrfToken}
      pageTitle='New project'
    >
      <div mix={pageStyle}>
        <Button
          href={routes.projects.href()}
          variant='quiet'
          mix={backButtonStyle}
        >
          ← All projects
        </Button>
        <h1 mix={headingStyle}>New project</h1>
        <p mix={descriptionStyle}>New projects start as active and can be tracked right away.</p>
        <Card padding={handle.props.clients.length ? 'comfortable' : 'none'}>
          {handle.props.clients.length ? (
            <form
              method='post'
              action={routes.projectCreate.action.href()}
              data-rmx-document
              mix={formStyle}
            >
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
                  {handle.props.error === 'client'
                    ? 'Choose an active client and try again.'
                    : 'Enter a project name of 1 to 200 characters and try again.'}
                </p>
              ) : null}
              <label mix={fieldLabelStyle}>
                <span>Client</span>
                <select
                  name='clientId'
                  required
                  mix={fieldStyle}
                >
                  {handle.props.clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.name}
                    </option>
                  ))}
                </select>
              </label>
              <TextField
                label='Project name'
                name='name'
                required
                minLength={1}
                maxLength={200}
              />
              <label mix={fieldLabelStyle}>
                <span>
                  Description <span mix={optionalStyle}>Optional</span>
                </span>
                <textarea
                  name='description'
                  rows={4}
                  maxLength={4000}
                  mix={fieldStyle}
                />
              </label>
              <div mix={actionsStyle}>
                <Button
                  href={routes.projects.href()}
                  variant='quiet'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  variant='primary'
                >
                  Create project
                </Button>
              </div>
            </form>
          ) : (
            <div mix={emptyStyle}>
              <h2 mix={emptyHeadingStyle}>No active clients</h2>
              <p mix={emptyTextStyle}>
                A project needs an active client. Add or reactivate a client, then come back here.
              </p>
              <Button
                href={routes.clients.href()}
                variant='primary'
              >
                View clients
              </Button>
            </div>
          )}
        </Card>
      </div>
    </WorkspaceLayout>
  );
};

const pageStyle = css({ paddingTop: `${themeTokens.spacing[5]}`, maxWidth: '780px' });
const backButtonStyle = css({ marginBottom: `${themeTokens.spacing[5]}` });
const headingStyle = css({
  margin: 0,
  fontSize: 'clamp(27px, 4vw, 35px)',
  lineHeight: 1.15,
  letterSpacing: '-0.045em'
});
const descriptionStyle = css({
  margin: `${themeTokens.spacing[2]} 0 ${themeTokens.spacing[5]}`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const formStyle = css({
  display: 'grid',
  gap: `${themeTokens.spacing[4]}`
});
const fieldLabelStyle = css({
  display: 'grid',
  gap: `${themeTokens.spacing[1]}`,
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
  resize: 'vertical'
});
const optionalStyle = css({
  color: `${themeTokens.palette.text.muted}`,
  fontWeight: `${themeTokens.typography.weight.medium}`
});
const errorStyle = css({
  margin: 0,
  color: `${themeTokens.palette.error.dark}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const actionsStyle = css({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: `${themeTokens.spacing[2]}`
});
const emptyStyle = css({ padding: `${themeTokens.spacing[6]}` });
const emptyHeadingStyle = css({ margin: 0, fontSize: `${themeTokens.typography.size.section}` });
const emptyTextStyle = css({
  margin: `${themeTokens.spacing[2]} 0 ${themeTokens.spacing[4]}`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`
});
