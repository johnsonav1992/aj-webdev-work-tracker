import { css } from 'remix/ui';

export type AccentTone = 'green' | 'blue' | 'amber';

/** The single source of truth for the app's visual design. */
export const themeTokens = {
  palette: {
    primary: { main: '#4ea7ff', dark: '#7cc4ff', active: '#348be0', contrastText: '#071018' },
    success: {
      main: '#83f7b0',
      light: 'rgb(131 247 176 / 12%)'
    },
    warning: {
      main: '#ffd166',
      light: 'rgb(255 209 102 / 12%)'
    },
    info: {
      main: '#7cc4ff',
      dark: '#4ea7ff',
      light: 'rgb(78 167 255 / 14%)'
    },
    error: {
      main: '#ff7777',
      dark: '#ffb4b4',
      light: 'rgb(255 119 119 / 14%)'
    },
    text: { primary: '#f6f7fb', secondary: '#b7bbc9', muted: '#777d91' },
    background: {
      default: '#111217',
      paper: '#191b23',
      subtle: 'rgb(255 255 255 / 4%)',
      hover: 'rgb(255 255 255 / 7%)'
    },
    divider: 'rgb(255 255 255 / 11%)',
    dividerStrong: 'rgb(255 255 255 / 20%)',
    focus: '#9ed8ff'
  },
  spacing: { 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '24px', 6: '32px', 8: '48px' },
  shape: { large: '8px', pill: '9999px' },
  typography: {
    fontFamily:
      "Ubuntu, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    size: {
      caption: '10px',
      small: '14px',
      body: '16px',
      section: '18px',
      metric: '29px',
      metricSmall: '23px',
      timer: '36px'
    },
    weight: { medium: 500, semibold: 600, bold: 700 }
  },
  elevation: {
    low: '0 12px 30px rgb(0 0 0 / 28%)',
    primaryAction: '0 16px 34px rgb(78 167 255 / 24%)'
  }
} as const;

export const theme = css({
  '& *, & *::before, & *::after': { boxSizing: 'border-box' },
  position: 'relative',
  minHeight: '100vh',
  colorScheme: 'dark',
  background: `linear-gradient(135deg, ${themeTokens.palette.background.default} 0%, ${themeTokens.palette.background.paper} 48%, ${themeTokens.palette.background.default} 100%)`,
  color: themeTokens.palette.text.primary,
  fontFamily: themeTokens.typography.fontFamily,
  fontSize: themeTokens.typography.size.body,
  lineHeight: 1.5,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  '&::before': {
    content: '""',
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    pointerEvents: 'none',
    background: `linear-gradient(90deg, rgb(78 167 255 / 9%), transparent 34%, ${themeTokens.palette.success.main}14 72%, transparent)`,
    maskImage: 'linear-gradient(to bottom, black, transparent 76%)'
  },
  '& > *': { position: 'relative', zIndex: 1 },
  '& button, & input': { font: 'inherit' },
  '& button:focus-visible, & a:focus-visible, & input:focus-visible': {
    outline: `2px solid ${themeTokens.palette.focus}`,
    outlineOffset: themeTokens.spacing[1]
  }
});

export const eyebrowStyle = css({
  margin: 0,
  color: themeTokens.palette.text.muted,
  fontSize: themeTokens.typography.size.caption,
  fontWeight: themeTokens.typography.weight.bold,
  letterSpacing: '0.08em',
  lineHeight: 1.3,
  textTransform: 'uppercase'
});
