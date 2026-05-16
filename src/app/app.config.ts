import { DOCUMENT } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { TUI_ICON_RESOLVER, provideTaiga } from '@taiga-ui/core';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideTaiga(),
    {
      provide: TUI_ICON_RESOLVER,
      deps: [DOCUMENT],
      useFactory: (doc: Document) => (icon: string) => {
        const base = doc.baseURI.replace(/\/$/, '');
        const name = icon.replace(/^@tui\./, '');
        return `${base}/assets/taiga-ui/icons/${name}.svg`;
      },
    },
  ],
};
