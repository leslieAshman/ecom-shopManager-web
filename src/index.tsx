import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import apolloClient from './graphql/client';
import i18n from './i18n';
import { SnackbarProvider } from 'notistack';
import FallbackError from './components/FallbackError';
import './index.css';
import App from './App';
import * as Sentry from '@sentry/react';

// Only for production
if (process.env.REACT_APP_SENTRY_URL) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_URL,
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
    // Performance Monitoring
    tracesSampleRate: 0,
    // Session Replay
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}

const AppWithWrappers = () => {
  return (
    <React.StrictMode>
      <Sentry.ErrorBoundary fallback={<FallbackError />} showDialog={false}>
        <ApolloProvider client={apolloClient}>
          <Router>
            <I18nextProvider i18n={i18n}>
              <SnackbarProvider
                autoHideDuration={3000}
                preventDuplicate
                maxSnack={1}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Suspense fallback="">
                  <App />
                </Suspense>
              </SnackbarProvider>
            </I18nextProvider>
          </Router>
        </ApolloProvider>
      </Sentry.ErrorBoundary>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<AppWithWrappers />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
