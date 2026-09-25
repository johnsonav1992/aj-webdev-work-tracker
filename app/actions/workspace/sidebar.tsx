import type { Handle, RemixNode } from 'remix/ui';
import { css } from 'remix/ui';
import { eyebrowStyle, themeTokens } from '../../theme/tokens.ts';
import { Avatar } from '../../ui/avatar.tsx';
import { ClockIcon } from '../../ui/icons/clock-icon.tsx';
import { GridIcon } from '../../ui/icons/grid-icon.tsx';
import { MoreIcon } from '../../ui/icons/more-icon.tsx';
import { PaymentsIcon } from '../../ui/icons/payments-icon.tsx';
import { ProjectsIcon } from '../../ui/icons/projects-icon.tsx';
import { UsersIcon } from '../../ui/icons/users-icon.tsx';
import { routes } from '../../routes.ts';
import { BrandMark } from '../brand-mark.tsx';

type NavItem = { label: string; href: string; icon: RemixNode; active?: boolean };
type WorkspaceSidebarProps = { activePage: 'overview' | 'projects' };

export const WorkspaceSidebar = (handle: Handle<WorkspaceSidebarProps>) => {
  return () => {
    const navigation: NavItem[] = [
      {
        label: 'Overview',
        href: routes.home.href(),
        icon: <GridIcon />,
        active: handle.props.activePage === 'overview'
      },
      { label: 'Clients', href: '#clients', icon: <UsersIcon /> },
      {
        label: 'Projects',
        href: routes.projects.href(),
        icon: <ProjectsIcon />,
        active: handle.props.activePage === 'projects'
      },
      { label: 'Time tracking', href: '#time-tracking', icon: <ClockIcon /> },
      { label: 'Payments', href: '#payments', icon: <PaymentsIcon /> }
    ];

    return (
      <aside
        mix={css({
          position: 'sticky',
          top: 0,
          alignSelf: 'start',
          height: '100vh',
          padding: `${themeTokens.spacing[6]} ${themeTokens.spacing[3]} ${themeTokens.spacing[4]}`,
          borderRight: `1px solid ${themeTokens.palette.divider}`,
          background: `${themeTokens.palette.background.paper}`,
          display: 'flex',
          flexDirection: 'column',
          '@media (max-width: 900px)': {
            position: 'relative',
            height: 'auto',
            padding: `${themeTokens.spacing[3]} ${themeTokens.spacing[5]}`,
            borderRight: 0,
            borderBottom: `1px solid ${themeTokens.palette.divider}`
          }
        })}
      >
        <a
          href={routes.home.href()}
          mix={css({
            display: 'flex',
            alignItems: 'center',
            gap: `${themeTokens.spacing[3]}`,
            padding: `0 ${themeTokens.spacing[2]}`,
            color: `${themeTokens.palette.text.primary}`,
            textDecoration: 'none'
          })}
        >
          <BrandMark />
          <span>
            <strong
              mix={css({
                display: 'block',
                fontSize: `${themeTokens.typography.size.body}`,
                letterSpacing: '-0.02em'
              })}
            >
              AJ Webdev
            </strong>
            <small
              mix={css({
                display: 'block',
                color: `${themeTokens.palette.text.muted}`,
                fontSize: `${themeTokens.typography.size.caption}`
              })}
            >
              Work tracker
            </small>
          </span>
        </a>

        <p
          mix={[
            eyebrowStyle,
            css({
              margin: `${themeTokens.spacing[8]} ${themeTokens.spacing[3]} ${themeTokens.spacing[2]}`,
              '@media (max-width: 900px)': { display: 'none' }
            })
          ]}
        >
          Workspace
        </p>
        <nav
          aria-label='Main navigation'
          mix={css({
            display: 'grid',
            gap: `${themeTokens.spacing[1]}`,
            '@media (max-width: 900px)': {
              display: 'flex',
              overflowX: 'auto',
              marginTop: `${themeTokens.spacing[3]}`
            }
          })}
        >
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              mix={css({
                display: 'flex',
                alignItems: 'center',
                gap: `${themeTokens.spacing[3]}`,
                minHeight: '39px',
                padding: `0 ${themeTokens.spacing[3]}`,
                borderRadius: `${themeTokens.shape.large}`,
                background: item.active ? `${themeTokens.palette.success.light}` : 'transparent',
                color: item.active
                  ? `${themeTokens.palette.success.main}`
                  : `${themeTokens.palette.text.secondary}`,
                fontSize: `${themeTokens.typography.size.small}`,
                fontWeight: item.active
                  ? `${themeTokens.typography.weight.bold}`
                  : `${themeTokens.typography.weight.medium}`,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                '&:hover': {
                  background: item.active
                    ? `${themeTokens.palette.success.light}`
                    : `${themeTokens.palette.background.hover}`
                }
              })}
            >
              <span mix={css({ display: 'grid', placeItems: 'center', width: '18px' })}>
                {item.icon}
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        <div mix={css({ marginTop: 'auto', '@media (max-width: 900px)': { display: 'none' } })}>
          <a
            href='#settings'
            mix={css({
              display: 'flex',
              alignItems: 'center',
              gap: `${themeTokens.spacing[3]}`,
              padding: `${themeTokens.spacing[3]} ${themeTokens.spacing[2]} ${themeTokens.spacing[1]}`,
              color: `${themeTokens.palette.text.secondary}`,
              textDecoration: 'none'
            })}
          >
            <Avatar initials='AJ' />
            <span mix={css({ minWidth: 0, flex: 1 })}>
              <strong
                mix={css({
                  display: 'block',
                  color: `${themeTokens.palette.text.primary}`,
                  fontSize: `${themeTokens.typography.size.small}`
                })}
              >
                Alex Johnson
              </strong>
              <small
                mix={css({
                  color: `${themeTokens.palette.text.muted}`,
                  fontSize: `${themeTokens.typography.size.caption}`
                })}
              >
                Account settings
              </small>
            </span>
            <MoreIcon />
          </a>
        </div>
      </aside>
    );
  };
};
