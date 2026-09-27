import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';
import { formatStatusLabel } from '#app/utils/format-status-label.ts';
import { Button } from '#app/ui/button.tsx';
import { Card } from '#app/ui/card.tsx';
import { SectionHeading } from '#app/ui/section-heading.tsx';
import { StatusBadge } from '#app/ui/status-badge.tsx';
import { routes } from '#app/routes.ts';
import type { ClientDetailData } from '#app/actions/clients/types/client-detail.ts';
import { projectStatusTone } from '#app/actions/projects/utils/project-status.ts';

type ClientWorkProps = Pick<ClientDetailData, 'payments' | 'projects'>;

export const ClientWork = (handle: Handle<ClientWorkProps>) => {
  return () => (
    <div mix={workStyle}>
      <Card
        as='section'
        padding='comfortable'
      >
        <SectionHeading title='Projects' />
        {handle.props.projects.length ? (
          <div mix={listStyle}>
            {handle.props.projects.map((project) => (
              <article
                key={project.id}
                mix={projectRowStyle}
              >
                <div mix={projectMainStyle}>
                  <Button
                    href={routes.project.href({ projectId: project.id })}
                    variant='quiet'
                    mix={projectLinkStyle}
                  >
                    {project.name}
                  </Button>
                  <span mix={metaStyle}>
                    {project.startedOn ?? 'Start date not set'}
                    {project.completedOn ? ` · Completed ${project.completedOn}` : ''}
                  </span>
                </div>
                <div mix={projectStatsStyle}>
                  <StatusBadge tone={projectStatusTone[project.status]}>
                    {formatStatusLabel(project.status)}
                  </StatusBadge>
                  <span>{project.trackedTime}</span>
                  <strong>{project.loggedValue}</strong>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p mix={emptyTextStyle}>No projects for this client.</p>
        )}
      </Card>
      <Card
        as='section'
        padding='comfortable'
      >
        <SectionHeading title='Payments' />
        {handle.props.payments.length ? (
          <div mix={listStyle}>
            {handle.props.payments.map((payment) => (
              <article
                key={payment.id}
                mix={paymentRowStyle}
              >
                <div mix={paymentMainStyle}>
                  <strong>{payment.amount}</strong>
                  <span mix={metaStyle}>
                    {payment.date} · {payment.method}
                    {payment.projectName ? ` · ${payment.projectName}` : ''}
                  </span>
                  {payment.notes ? <span mix={metaStyle}>{payment.notes}</span> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p mix={emptyTextStyle}>No payments recorded.</p>
        )}
      </Card>
    </div>
  );
};

const workStyle = css({ display: 'grid', gap: `${themeTokens.spacing[4]}`, minWidth: 0 });
const listStyle = css({ display: 'grid' });
const projectRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: `${themeTokens.spacing[3]}`,
  padding: `${themeTokens.spacing[3]} 0`,
  borderTop: `1px solid ${themeTokens.palette.divider}`
});
const projectMainStyle = css({ display: 'grid', gap: `${themeTokens.spacing[1]}`, minWidth: 0 });
const projectLinkStyle = css({ justifyContent: 'start', paddingInline: 0, textAlign: 'left' });
const projectStatsStyle = css({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: `${themeTokens.spacing[3]}`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`,
  '& strong': { color: `${themeTokens.palette.text.primary}` }
});
const paymentRowStyle = css({
  padding: `${themeTokens.spacing[3]} 0`,
  borderTop: `1px solid ${themeTokens.palette.divider}`
});
const paymentMainStyle = css({ display: 'grid', gap: `${themeTokens.spacing[1]}` });
const metaStyle = css({
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`,
  overflowWrap: 'anywhere'
});
const emptyTextStyle = css({
  margin: 0,
  padding: `${themeTokens.spacing[3]} 0 0`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.small}`
});
