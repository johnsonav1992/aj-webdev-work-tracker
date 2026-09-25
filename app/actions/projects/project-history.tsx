import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { Panel } from '../../ui/panel.tsx';
import { SectionHeading } from '../../ui/section-heading.tsx';
import { StatusBadge } from '../../ui/status-badge.tsx';
import type { ProjectDetailData } from './project-detail-types.ts';

type ProjectHistoryProps = Pick<ProjectDetailData, 'payments' | 'timeEntries'>;

export const ProjectHistory = (handle: Handle<ProjectHistoryProps>) => {
  return () => (
    <div mix={historyStyle}>
      <Panel>
        <section mix={panelContentStyle}>
          <SectionHeading title='Time entries' />
          {handle.props.timeEntries.length ? (
            <div mix={tableOverflowStyle}>
              <table mix={tableStyle}>
                <thead>
                  <tr>
                    <th scope='col'>Date</th>
                    <th scope='col'>Work</th>
                    <th scope='col'>Duration</th>
                    <th scope='col'>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {handle.props.timeEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td mix={nowrapStyle}>{entry.date}</td>
                      <td mix={workCellStyle}>
                        <span>{entry.description}</span>
                        {entry.status === 'running' ? (
                          <StatusBadge tone='blue'>Running</StatusBadge>
                        ) : null}
                      </td>
                      <td mix={nowrapStyle}>{entry.duration}</td>
                      <td>{entry.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p mix={emptyTextStyle}>No time entries recorded.</p>
          )}
        </section>
      </Panel>

      <Panel>
        <section mix={panelContentStyle}>
          <SectionHeading title='Payments' />
          {handle.props.payments.length ? (
            <div mix={paymentListStyle}>
              {handle.props.payments.map((payment) => (
                <article
                  key={payment.id}
                  mix={paymentRowStyle}
                >
                  <div mix={paymentMainStyle}>
                    <strong>{payment.amount}</strong>
                    <span mix={paymentMetaStyle}>
                      {payment.date} <span aria-hidden='true'>·</span> {payment.method}
                    </span>
                    {payment.notes ? <span mix={paymentMetaStyle}>{payment.notes}</span> : null}
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

const historyStyle = css({ display: 'grid', gap: `${themeTokens.spacing[4]}`, minWidth: 0 });
const panelContentStyle = css({ padding: `${themeTokens.spacing[5]}` });
const tableOverflowStyle = css({ overflowX: 'auto', maxWidth: '100%' });
const tableStyle = css({
  width: '100%',
  minWidth: '540px',
  borderCollapse: 'collapse',
  textAlign: 'left',
  fontSize: `${themeTokens.typography.size.small}`,
  '& th': {
    padding: `0 ${themeTokens.spacing[3]} ${themeTokens.spacing[2]} 0`,
    color: `${themeTokens.palette.text.muted}`,
    fontSize: `${themeTokens.typography.size.caption}`,
    fontWeight: `${themeTokens.typography.weight.semibold}`
  },
  '& td': {
    padding: `${themeTokens.spacing[3]} ${themeTokens.spacing[3]} ${themeTokens.spacing[3]} 0`,
    borderTop: `1px solid ${themeTokens.palette.divider}`,
    verticalAlign: 'top'
  }
});
const nowrapStyle = css({ whiteSpace: 'nowrap' });
const workCellStyle = css({
  display: 'flex',
  alignItems: 'start',
  gap: `${themeTokens.spacing[2]}`
});
const emptyTextStyle = css({
  margin: 0,
  padding: `${themeTokens.spacing[3]} 0 0`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const paymentListStyle = css({ display: 'grid' });
const paymentRowStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  gap: `${themeTokens.spacing[3]}`,
  padding: `${themeTokens.spacing[3]} 0`,
  borderTop: `1px solid ${themeTokens.palette.divider}`
});
const paymentMainStyle = css({ display: 'grid', gap: `${themeTokens.spacing[1]}` });
const paymentMetaStyle = css({
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`
});
