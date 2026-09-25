import type { Handle, RemixNode } from 'remix/ui';
import { css } from 'remix/ui';

import { theme, themeTokens, panelStyle } from '../../theme/tokens.ts';
import { Document } from '../document.tsx';
import { BrandMark } from '../brand-mark.tsx';

export interface AuthLayoutProps {
  title: string;
  children: RemixNode;
}

export const AuthLayout = (handle: Handle<AuthLayoutProps>) => {
  return () => (
    <Document title={`${handle.props.title} · AJ Webdev Work Tracker`}>
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
                display: 'flex',
                alignItems: 'center',
                gap: `${themeTokens.spacing[3]}`,
                marginBottom: `${themeTokens.spacing[4]}`,
                color: `${themeTokens.palette.text.secondary}`,
                fontSize: `${themeTokens.typography.size.small}`,
                fontWeight: `${themeTokens.typography.weight.semibold}`,
                textDecoration: 'none'
              })}
            >
              <BrandMark size='medium' />
              <span>AJ Webdev Work Tracker</span>
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
              {handle.props.children}
            </section>
          </div>
        </main>
      </div>
    </Document>
  );
};
