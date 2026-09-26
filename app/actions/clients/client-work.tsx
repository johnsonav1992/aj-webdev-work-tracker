import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { Button } from '../../ui/button.tsx';
import { Panel } from '../../ui/panel.tsx';
import { SectionHeading } from '../../ui/section-heading.tsx';
import { StatusBadge } from '../../ui/status-badge.tsx';
import { routes } from '../../routes.ts';
import type { ClientDetailData } from './client-detail-types.ts';

const statusTone = {
  planned: 'amber',
  active: 'blue',
  completed: 'green',
  archived: 'gray'
} as const;

const paymentMethodLabels: Record<string, string> = {
  bank_transfer: 'Bank transfer',
  card: 'Card',
  check: 'Check',
  cash: 'Cash',
  other: 'Other'
};

type ClientWorkProps = Pick<ClientDetailData, 'payments' | 'projects'>;

export const ClientWork = (handle: Handle<ClientWorkProps>) => {
  return () => (
    <div mix={workStyle}>
      <Panel>
        <section mix={panelContentStyle}>
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
                    <StatusBadge tone={statusTone[project.status]}>
                      {project.status[0]!.toUpperCase() + project.status.slice(1)}
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
        </section>
      </Panel>
      <Panel>
        <section mix={panelContentStyle}>
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
                      {payment.date} · {paymentMethodLabels[payment.method] ?? payment.method}
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
        </section>
      </Panel>
    </div>
  );
};

const workStyle = css({ display: 'grid', gap: `${themeTokens.spacing[4]}`, minWidth: 0 });
const panelContentStyle = css({ padding: `${themeTokens.spacing[5]}` });
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
