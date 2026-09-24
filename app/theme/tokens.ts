import { css } from 'remix/ui'

export const theme = css({
  '--ink': '#18231f',
  '--ink-soft': '#52615a',
  '--muted': '#78847d',
  '--line': '#e5e9e5',
  '--canvas': '#f5f7f4',
  '--surface': '#ffffff',
  '--green': '#24785a',
  '--green-dark': '#19583f',
  '--green-soft': '#e8f3ec',
  '--amber': '#b87328',
  '--amber-soft': '#fbf0df',
  '--blue': '#4c7187',
  '--blue-soft': '#eaf1f5',
  '--red': '#a64d46',
  '--red-soft': '#f8eae8',
  '& *, & *::before, & *::after': { boxSizing: 'border-box' },
  margin: 0,
  minHeight: '100vh',
  background: 'var(--canvas)',
  color: 'var(--ink)',
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: '14px',
  lineHeight: 1.5,
  WebkitFontSmoothing: 'antialiased',
  '& button, & input': { font: 'inherit' },
  '& button:focus-visible, & a:focus-visible, & input:focus-visible': {
    outline: '3px solid #9ac7ad',
    outlineOffset: '2px',
  },
})

export const panelStyle = css({
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: '14px',
  boxShadow: '0 2px 7px rgb(24 35 31 / 3%)',
})

export const quietButtonStyle = css({
  appearance: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  minHeight: '38px',
  padding: '8px 12px',
  border: '1px solid var(--line)',
  borderRadius: '9px',
  background: 'var(--surface)',
  color: 'var(--ink)',
  fontWeight: 600,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'background 140ms ease, border-color 140ms ease',
  '&:hover': { background: '#f7f9f7', borderColor: '#cbd4cd' },
})

export const primaryButtonStyle = css({
  appearance: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  minHeight: '40px',
  padding: '9px 14px',
  border: '1px solid var(--green)',
  borderRadius: '9px',
  background: 'var(--green)',
  color: '#fff',
  fontWeight: 650,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'background 140ms ease, border-color 140ms ease, transform 140ms ease',
  '&:hover': { background: 'var(--green-dark)', borderColor: 'var(--green-dark)' },
  '&:active': { transform: 'translateY(1px)' },
})

export const eyebrowStyle = css({
  margin: 0,
  color: 'var(--muted)',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.09em',
  lineHeight: 1.3,
  textTransform: 'uppercase',
})
