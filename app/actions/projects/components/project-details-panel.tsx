import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';
import { formatCurrency } from '#app/utils/format-currency.ts';
import { Card } from '#app/ui/card.tsx';
import { ProgressBar } from '#app/ui/progress-bar.tsx';
import { SectionHeading } from '#app/ui/section-heading.tsx';
import type { ProjectDetailData } from '#app/actions/projects/types/project-detail.ts';

type ProjectDetailsPanelProps = Pick<ProjectDetailData, 'client' | 'project' | 'summary'>;

export const ProjectDetailsPanel = (handle: Handle<ProjectDetailsPanelProps>) => {
  return () => {
    const { client, project, summary } = handle.props;
    const details = [
      { label: 'Client', value: client.name },
      {
        label: 'Hourly rate',
        value:
          client.hourlyRateMinor === null || client.hourlyRateMinor === undefined
            ? 'Not set'
            : formatCurrency(client.hourlyRateMinor, client.currency)
      },
      { label: 'Started', value: project.startedOn ?? 'Not set' },
      { label: 'Completed', value: project.completedOn ?? 'Not completed' }
    ];
    const invoiceCap =
      project.invoiceCapMinor === null
        ? null
        : formatCurrency(project.invoiceCapMinor, client.currency);
    const hourCap = project.hourCapMinutes === null ? null : project.hourCapMinutes / 60;
    const progress = project.hourCapMinutes
      ? Math.min(100, (summary.trackedSeconds / (project.hourCapMinutes * 60)) * 100)
      : null;

    return (
      <Card
        as='section'
        padding='comfortable'
      >
        <SectionHeading title='Details' />
        <dl mix={detailsListStyle}>
          {details.map((detail) => (
            <div
              key={detail.label}
              mix={detailRowStyle}
            >
              <dt mix={detailLabelStyle}>{detail.label}</dt>
              <dd mix={detailValueStyle}>{detail.value}</dd>
            </div>
          ))}
          {client.contactName ? (
            <div mix={detailRowStyle}>
              <dt mix={detailLabelStyle}>Contact</dt>
              <dd mix={detailValueStyle}>{client.contactName}</dd>
            </div>
          ) : null}
          {client.email ? (
            <div mix={detailRowStyle}>
              <dt mix={detailLabelStyle}>Email</dt>
              <dd mix={detailValueStyle}>
                <a
                  href={`mailto:${client.email}`}
                  mix={detailLinkStyle}
                >
                  {client.email}
                </a>
              </dd>
            </div>
          ) : null}
          {client.phone ? (
            <div mix={detailRowStyle}>
              <dt mix={detailLabelStyle}>Phone</dt>
              <dd mix={detailValueStyle}>{client.phone}</dd>
            </div>
          ) : null}
          {hourCap !== null ? (
            <div mix={detailRowStyle}>
              <dt mix={detailLabelStyle}>Time budget</dt>
              <dd mix={detailValueStyle}>
                {summary.trackedTime} / {hourCap}h
                {progress !== null ? (
                  <div mix={progressBarSpacingStyle}>
                    <ProgressBar
                      label='Project time budget'
                      value={progress}
                    />
                  </div>
                ) : null}
              </dd>
            </div>
          ) : null}
          {invoiceCap ? (
            <div mix={detailRowStyle}>
              <dt mix={detailLabelStyle}>Invoice cap</dt>
              <dd mix={detailValueStyle}>{invoiceCap}</dd>
            </div>
          ) : null}
        </dl>
        {project.notes ? (
          <div mix={notesStyle}>
            <h3 mix={notesHeadingStyle}>Notes</h3>
            <p mix={notesTextStyle}>{project.notes}</p>
          </div>
        ) : null}
      </Card>
    );
  };
};

const detailsListStyle = css({ display: 'grid', gap: `${themeTokens.spacing[3]}`, margin: 0 });
const detailRowStyle = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(82px, 0.75fr) minmax(0, 1.25fr)',
  gap: `${themeTokens.spacing[3]}`
});
const detailLabelStyle = css({
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const detailValueStyle = css({
  minWidth: 0,
  margin: 0,
  color: `${themeTokens.palette.text.primary}`,
  fontSize: `${themeTokens.typography.size.small}`,
  overflowWrap: 'anywhere'
});
const detailLinkStyle = css({ color: `${themeTokens.palette.primary.dark}` });
const progressBarSpacingStyle = css({ marginTop: `${themeTokens.spacing[2]}` });
const notesStyle = css({
  marginTop: `${themeTokens.spacing[4]}`,
  paddingTop: `${themeTokens.spacing[4]}`,
  borderTop: `1px solid ${themeTokens.palette.divider}`
});
const notesHeadingStyle = css({ margin: 0, fontSize: `${themeTokens.typography.size.small}` });
const notesTextStyle = css({
  margin: `${themeTokens.spacing[2]} 0 0`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`,
  whiteSpace: 'pre-wrap'
});
