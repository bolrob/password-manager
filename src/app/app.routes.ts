import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/vault', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'vault',
    canActivate: [authGuard],
    loadChildren: () => import('./features/vault/vault.routes').then((m) => m.VAULT_ROUTES),
  },
  {
    path: 'generator',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/generator/generator.component').then((m) => m.GeneratorComponent),
  },
  { path: '**', redirectTo: '/vault' },
];
