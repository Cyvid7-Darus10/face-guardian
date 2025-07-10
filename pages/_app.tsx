import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css';
import '@/styles/design-system.css';

// Import contexts
import { AppProvider } from '@/contexts/AppContext';
import { FaceRecognitionProvider } from '@/contexts/FaceRecognitionContext';
import { RegistrationProvider } from '@/contexts/RegistrationContext';

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <AppProvider>
        <FaceRecognitionProvider>
          <RegistrationProvider>
            <Component {...pageProps} />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </RegistrationProvider>
        </FaceRecognitionProvider>
      </AppProvider>
    </SessionContextProvider>
  );
}
