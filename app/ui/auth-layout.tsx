import type { Handle, RemixNode } from 'remix/ui';
import { css } from 'remix/ui';

import { theme, themeTokens, panelStyle } from '../theme/tokens.ts';
import { Document } from '../actions/document.tsx';

export interface AuthLayoutProps {
  title: string;
  description: string;
  children: RemixNode;
}

export const AuthLayout = (handle: Handle<AuthLayoutProps>) => {
  return () => (
    <Document title={`${handle.props.title} · AJ Workbench`}>
      <div mix={theme}>
        <main
          mix={css({
            display: 'grid',
            placeItems: 'center',
            minHeight: '100vh',
            padding: `${themeTokens.spacing[5]}`
          })}
        >
          <div mix={css({ width: '100%', maxWidth: '430px' })}>
            <a
              href='/'
              mix={css({
                display: 'inline-flex',
                marginBottom: `${themeTokens.spacing[4]}`,
                color: `${themeTokens.palette.text.secondary}`,
                fontSize: `${themeTokens.typography.size.small}`,
                fontWeight: `${themeTokens.typography.weight.semibold}`,
                textDecoration: 'none'
              })}
            >
              AJ Workbench
            </a>
            <section
              mix={[
                panelStyle,
                css({
                  padding: `${themeTokens.spacing[6]}`,
                  '@media (max-width: 480px)': { padding: `${themeTokens.spacing[4]}` }
                })
              ]}
            >
              <h1
                mix={css({
                  margin: `0 0 ${themeTokens.spacing[2]}`,
                  fontSize: `${themeTokens.typography.size.metricSmall}`,
                  lineHeight: 1.2,
                  letterSpacing: '-0.025em'
                })}
              >
                {handle.props.title}
              </h1>
              <p
                mix={css({
                  margin: `0 0 ${themeTokens.spacing[5]}`,
                  color: `${themeTokens.palette.text.secondary}`
                })}
              >
                {handle.props.description}
              </p>
              {handle.props.children}
            </section>
          </div>
        </main>
      </div>
    </Document>
  );
};
