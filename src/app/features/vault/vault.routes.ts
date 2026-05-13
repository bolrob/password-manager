import { Routes } from '@angular/router';

export const VAULT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./vault-list/vault-list.component').then((m) => m.VaultListComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./vault-form/vault-form.component').then((m) => m.VaultFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./vault-form/vault-form.component').then((m) => m.VaultFormComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./vault-detail/vault-detail.component').then((m) => m.VaultDetailComponent),
  },
];
