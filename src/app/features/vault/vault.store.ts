import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import {
  CredentialFilter,
  CredentialService,
} from '../../core/services/credential.service';
import { Credential, CredentialCategory } from '../../core/models';

interface VaultState {
  credentials: Credential[];
  selected: Credential | null;
  loading: boolean;
  error: string | null;
  filter: CredentialFilter;
}

const initialState: VaultState = {
  credentials: [],
  selected: null,
  loading: false,
  error: null,
  filter: {},
};

export const VaultStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    filteredCredentials: computed(() => {
      const all = store.credentials();
      const { search, category, tags, isExpired } = store.filter();

      return all.filter((c) => {
        if (search) {
          const q = search.toLowerCase();
          if (!c.title.toLowerCase().includes(q) && !c.username.toLowerCase().includes(q)) {
            return false;
          }
        }
        if (category && c.category !== category) return false;
        if (isExpired !== undefined && c.isExpired !== isExpired) return false;
        if (tags?.length && !tags.some((t) => c.tags.includes(t))) return false;
        return true;
      });
    }),
    totalCount: computed(() => store.credentials().length),
    expiredCount: computed(() => store.credentials().filter((c) => c.isExpired).length),
    categoryStats: computed(() => {
      const counts: Partial<Record<CredentialCategory, number>> = {};
      for (const c of store.credentials()) {
        counts[c.category] = (counts[c.category] ?? 0) + 1;
      }
      return counts;
    }),
  })),
  withMethods((store, service = inject(CredentialService)) => ({
    loadAll(filter?: CredentialFilter): void {
      patchState(store, { loading: true, error: null });
      if (filter) patchState(store, { filter });
      service.getAll(store.filter()).subscribe({
        next: (credentials) => patchState(store, { credentials, loading: false }),
        error: (err) => patchState(store, { error: err.message, loading: false }),
      });
    },

    selectCredential(id: string): void {
      const found = store.credentials().find((c) => c.id === id) ?? null;
      patchState(store, { selected: found });
    },

    clearSelected(): void {
      patchState(store, { selected: null });
    },

    setFilter(filter: CredentialFilter): void {
      patchState(store, { filter });
    },

    create(dto: Parameters<CredentialService['create']>[0]): void {
      patchState(store, { loading: true });
      service.create(dto).subscribe({
        next: (c) => patchState(store, { credentials: [...store.credentials(), c], loading: false }),
        error: (err) => patchState(store, { error: err.message, loading: false }),
      });
    },

    update(id: string, dto: Parameters<CredentialService['update']>[1]): void {
      patchState(store, { loading: true });
      service.update(id, dto).subscribe({
        next: (updated) =>
          patchState(store, {
            credentials: store.credentials().map((c) => (c.id === id ? updated : c)),
            selected: updated,
            loading: false,
          }),
        error: (err) => patchState(store, { error: err.message, loading: false }),
      });
    },

    delete(id: string): void {
      service.delete(id).subscribe({
        next: () =>
          patchState(store, {
            credentials: store.credentials().filter((c) => c.id !== id),
            selected: null,
          }),
        error: (err) => patchState(store, { error: err.message }),
      });
    },
  })),
);
