import type { Handle, RemixNode } from 'remix/ui';
import { css } from 'remix/ui';
import { ImportMap } from 'remix/ui/server';

import { scriptEntry } from '#app/assets.ts';

export interface DocumentProps {
  children?: RemixNode;
  head?: RemixNode;
  title?: string;
}

const DEFAULT_TITLE = 'AJ Webdev Work Tracker';

export const Document = (handle: Handle<DocumentProps>) => {
  return () => {
    const { children, head, title = DEFAULT_TITLE } = handle.props;
    const { href, importMap, preloads } = scriptEntry;

    return (
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1'
          />
          <meta
            name='color-scheme'
            content='light dark'
          />
          <link
            rel='icon'
            type='image/svg+xml'
            href='/favicon.svg'
          />
          <title>{title}</title>
          {head}
          <ImportMap value={importMap} />
          {preloads.map((preloadHref) => (
            <link
              key={preloadHref}
              rel='modulepreload'
              href={preloadHref}
            />
          ))}
          <script
            type='module'
            src={href}
          ></script>
        </head>
        <body mix={css({ margin: 0 })}>{children}</body>
      </html>
    );
  };
};
