import { ClerkProvider } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

// Clerk's own dark theme only swaps colour variables, and every colour is set
// here from the site palette (index.css), so no theme package is needed.
// Literal values instead of var(--...) keep Clerk's generated shades working
// in browsers without relative-colour support.
const palette = {
  dark: {
    colorBackground: '#111111',
    colorForeground: '#f0f0f0',
    colorMutedForeground: '#888888',
    colorPrimary: '#f0f0f0',
    colorPrimaryForeground: '#0a0a0a',
    colorNeutral: '#ffffff',
    colorBorder: 'rgba(255, 255, 255, 0.1)',
    colorInput: '#1a1a1a',
    colorInputForeground: '#f0f0f0',
  },
  light: {
    colorBackground: '#f0f0f0',
    colorForeground: '#111111',
    colorMutedForeground: '#666666',
    colorPrimary: '#111111',
    colorPrimaryForeground: '#e8e8e8',
    colorNeutral: '#000000',
    colorBorder: 'rgba(0, 0, 0, 0.1)',
    colorInput: '#e6e6e6',
    colorInputForeground: '#111111',
  },
};

// Matches the guestbook composer: 20px card, pill buttons, hairline border.
function buildAppearance(colors) {
  const pill = { borderRadius: '999px', boxShadow: 'none' };
  return {
    variables: {
      ...colors,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontFamilyButtons: "'Plus Jakarta Sans', sans-serif",
      borderRadius: '0.75rem',
    },
    elements: {
      // Centre the modal vertically (Clerk anchors it near the top by default)
      modalBackdrop: { alignItems: 'center', padding: '1rem' },
      modalContent: { margin: 'auto' },
      cardBox: {
        borderRadius: '20px',
        border: `1px solid ${colors.colorBorder}`,
        boxShadow: 'none',
        background: colors.colorBackground,
      },
      card: { background: 'transparent', boxShadow: 'none', border: 0 },
      footer: { background: 'transparent', borderTop: `1px solid ${colors.colorBorder}` },
      headerTitle: { fontWeight: 600, letterSpacing: '-0.01em' },
      headerSubtitle: { color: colors.colorMutedForeground },
      socialButtonsBlockButton: {
        ...pill,
        width: '100%',
        border: `1px solid ${colors.colorBorder}`,
        background: colors.colorInput,
      },
      formButtonPrimary: { ...pill, fontWeight: 500 },
      formFieldInput: { boxShadow: 'none', border: `1px solid ${colors.colorBorder}` },
    },
  };
}

const appearance = {
  dark: buildAppearance(palette.dark),
  light: buildAppearance(palette.light),
};

export default function ClerkThemeProvider({ children, ...props }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  return (
    <ClerkProvider
      {...props}
      appearance={appearance[theme] || appearance.light}
      // In-app navigation for Clerk redirects (sign-out, after sign-in) instead of a full page reload
      routerPush={to => navigate(to)}
      routerReplace={to => navigate(to, { replace: true })}
    >
      {children}
    </ClerkProvider>
  );
}
