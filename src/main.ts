import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

async function bootstrap() {
  if (typeof window !== 'undefined') {
    const { worker } = await import('./app/mock/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    }).catch((err) => console.warn('[MSW] Worker failed to start:', err));
  }
  await bootstrapApplication(App, appConfig);
}

bootstrap().catch(console.error);
