import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

async function bootstrap() {
  if (typeof window !== 'undefined') {
    const { worker } = await import('./app/mock/browser');
    await worker
      .start({
        onUnhandledRequest(request, print) {
          // Navigation requests are handled by Angular Router — ignore silently
          if (request.mode === 'navigate') return;
          print.warning();
        },
        serviceWorker: { url: `${document.baseURI}mockServiceWorker.js` },
      })
      .catch((err) => console.warn('[MSW] Worker failed to start:', err));
  }
  await bootstrapApplication(App, appConfig);
}

bootstrap().catch(console.error);
