import type { Handle, RemixNode } from 'remix/ui';
import { css } from 'remix/ui';

import { theme, themeTokens } from '../../theme/tokens.ts';
import { Document } from '../document.tsx';
import { WorkspaceSidebar } from './sidebar.tsx';
import { WorkspaceTopbar } from './topbar.tsx';

type WorkspaceLayoutProps = {
  activePage: 'overview' | 'clients' | 'projects';
  children: RemixNode;
  csrfToken: string;
  pageTitle: string;
};

export const WorkspaceLayout = (handle: Handle<WorkspaceLayoutProps>) => {
  return () => (
    <Document title={`${handle.props.pageTitle} · AJ Webdev Work Tracker`}>
      <div mix={theme}>
        <div mix={shellStyle}>
          <WorkspaceSidebar activePage={handle.props.activePage} />
          <main mix={mainStyle}>
            <WorkspaceTopbar
              csrfToken={handle.props.csrfToken}
              pageTitle={handle.props.pageTitle}
            />
            {handle.props.children}
            <footer mix={footerStyle}>AJ Webdev Work Tracker</footer>
          </main>
        </div>
      </div>
    </Document>
  );
};

const shellStyle = css({
  display: 'grid',
  gridTemplateColumns: '238px minmax(0, 1fr)',
  minHeight: '100vh',
  '@media (max-width: 900px)': { gridTemplateColumns: '1fr' }
});

const mainStyle = css({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  padding: `${themeTokens.spacing[6]} clamp(${themeTokens.spacing[5]}, 4vw, 54px) 48px`,
  maxWidth: '1600px',
  width: '100%',
  margin: '0 auto'
});

const footerStyle = css({
  marginTop: 'auto',
  paddingTop: `${themeTokens.spacing[6]}`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`,
  textAlign: 'center'
});
