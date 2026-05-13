import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiBadge, TuiChip } from '@taiga-ui/kit';
import { CredentialCategory } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { CredentialService } from '../../../core/services/credential.service';
import { PasswordService } from '../../../core/services/password.service';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../../../shared/utils/category.utils';
import { VaultStore } from '../vault.store';

@Component({
  selector: 'app-vault-list',
  imports: [FormsModule, RouterLink, TuiTextfield, TuiButton, TuiIcon, TuiTitle, TuiBadge, TuiChip],
  templateUrl: './vault-list.component.html',
  styleUrl: './vault-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VaultListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly credentialService = inject(CredentialService);

  readonly store = inject(VaultStore);
  readonly passwordService = inject(PasswordService);
  readonly categoryLabels = CATEGORY_LABELS;
  readonly allCategories = ALL_CATEGORIES;

  searchQuery = '';
  selectedCategory: CredentialCategory | '' = '';
  showExpiredOnly = false;

  readonly visiblePasswords = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.store.loadAll();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  applyFilter(): void {
    this.store.setFilter({
      search: this.searchQuery || undefined,
      category: (this.selectedCategory as CredentialCategory) || undefined,
      isExpired: this.showExpiredOnly ? true : undefined,
    });
    this.store.loadAll();
  }

  togglePasswordVisibility(id: string): void {
    const current = new Set(this.visiblePasswords());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.visiblePasswords.set(current);
  }

  isPasswordVisible(id: string): boolean {
    return this.visiblePasswords().has(id);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }

  toggleExpired(id: string, isExpired: boolean): void {
    this.store.update(id, { isExpired: !isExpired });
  }

  delete(id: string): void {
    if (confirm('Удалить запись?')) {
      this.store.delete(id);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  exportData(): void {
    this.credentialService.export().subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'passwords-export.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
