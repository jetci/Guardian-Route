// Sentry integration disabled - install @sentry/react if needed
// import * as Sentry from '@sentry/react';

export const initSentry = () => {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

  if (!sentryDsn) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  console.warn('Sentry not installed. Install @sentry/react to enable error tracking.');
  
  // Uncomment when @sentry/react is installed:
  /*
  try {
    Sentry.init({
      dsn: sentryDsn,
      environment: import.meta.env.MODE,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      beforeSend(event, _hint) {
        // Filter out development errors
        if (import.meta.env.MODE === 'development') {
          console.log('Sentry Event (dev):', event);
          return null;
        }
        return event;
      },
    });

    console.log('Sentry initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
  */
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  console.error('Error captured:', error, context);
  // Sentry.captureException(error) when installed
};

export const captureMessage = (message: string, level: string = 'info') => {
  console.log(`[${level}] ${message}`);
  // Sentry.captureMessage(message, level) when installed
};

export const setUser = (user: { id: string; email: string; role: string }) => {
  console.log('User set:', user);
  // Sentry.setUser(user) when installed
};

export const clearUser = () => {
  console.log('User cleared');
  // Sentry.setUser(null) when installed
};
