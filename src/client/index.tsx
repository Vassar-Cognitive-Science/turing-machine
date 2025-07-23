import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@xyflow/react/dist/style.css';

import App from '../common/components/AppModern';
import PageNotFound from '../common/components/PageNotFoundModern';
import GradingPage from '../common/components/GradingPage';

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    // Increase base font size
    fontSize: 16, // Default is 14
    // Increase all typography variants
    h1: { fontSize: '3rem' }, // Default is 2.125rem
    h2: { fontSize: '2.5rem' }, // Default is 1.5rem
    h3: { fontSize: '2rem' }, // Default is 1.17rem
    h4: { fontSize: '1.75rem' }, // Default is 1rem
    h5: { fontSize: '1.5rem' }, // Default is 0.83rem
    h6: { fontSize: '1.25rem' }, // Default is 0.75rem
    subtitle1: { fontSize: '1.125rem' }, // Default is 1rem
    subtitle2: { fontSize: '1rem' }, // Default is 0.875rem
    body1: { fontSize: '1.125rem' }, // Default is 1rem
    body2: { fontSize: '1rem' }, // Default is 0.875rem
    caption: { fontSize: '0.875rem' }, // Default is 0.75rem
    overline: { fontSize: '0.875rem' }, // Default is 0.75rem
    button: { fontSize: '1rem' }, // Default is 0.875rem
  },
  components: {
    // Increase default icon sizes
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem', // Default is 1.5rem, increase to 2rem
        },
      },
    },
  },
});

// For now, we'll temporarily keep some global state initialization
// This will be replaced with Zustand stores in the next phase
const preloadedState = (window as any).__PRELOADED_STATE__;

// Initialize the React app
const container = document.getElementById('container');
if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);

function AppWrapper(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/grade" element={<GradingPage />} />
          <Route path="/:id" element={<App />} />
          <Route path="/error/404" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

root.render(<AppWrapper />);