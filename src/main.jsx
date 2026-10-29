import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ClerkProvider } from '@clerk/react';
import { setLiveCircularFavicon } from './lib/circularFavicon.js';
import App from './App.jsx';
import './index.css';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

setLiveCircularFavicon();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/guestbook">
            <App />
          </ClerkProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
