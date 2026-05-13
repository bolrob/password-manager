import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TuiButton, TuiError, TuiTextfield } from '@taiga-ui/core';
import { CredentialService } from '../../../core/services/credential.service';
import { PasswordService } from '../../../core/services/password.service';
import { CredentialCategory } from '../../../core/models';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../../../shared/utils/category.utils';
import { StrengthColorPipe } from '../../../shared/pipes/strength-color.pipe';
import { StrengthLabelPipe } from '../../../shared/pipes/strength-label.pipe';
import { VaultStore } from '../vault.store';

@Component({
  selector: 'app-vault-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    TuiTextfield,
    TuiButton,
    TuiError,
    StrengthLabelPipe,
    StrengthColorPipe,
  ],
  templateUrl: './vault-form.component.html',
  styleUrl: './vault-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VaultFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly credentialService = inject(CredentialService);
  private readonly passwordService = inject(PasswordService);
  readonly store = inject(VaultStore);

  readonly categoryLabels = CATEGORY_LABELS;
  readonly allCategories: CredentialCategory[] = ALL_CATEGORIES;
  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly showPassword = signal(false);
  readonly tagsInput = signal('');

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    url: [''],
    notes: [''],
    category: ['other' as CredentialCategory, Validators.required],
    tags: [[] as string[]],
    isFavorite: [false],
    isExpired: [false],
    reminderDate: [''],
  });

  get passwordStrength() {
    return this.passwordService.getStrength(this.form.get('password')?.value ?? '');
  }

  get passwordScore() {
    return this.passwordService.getStrengthScore(this.form.get('password')?.value ?? '');
  }

  get editId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    const id = this.editId;
    if (id) {
      this.isEditMode.set(true);
      this.credentialService.getById(id).subscribe((cred) => {
        this.form.patchValue(cred);
        this.tagsInput.set(cred.tags.join(', '));
      });
    }
  }

  generatePassword(): void {
    const pwd = this.passwordService.generate({
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    });
    this.form.get('password')?.setValue(pwd);
  }

  syncTags(): void {
    const tags = this.tagsInput()
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    this.form.get('tags')?.setValue(tags);
  }

  submit(): void {
    this.syncTags();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const raw = this.form.getRawValue();
    const dto = {
      title: raw.title ?? '',
      username: raw.username ?? '',
      password: raw.password ?? '',
      url: raw.url ?? undefined,
      notes: raw.notes ?? undefined,
      category: (raw.category ?? 'other') as CredentialCategory,
      tags: raw.tags ?? [],
      isFavorite: raw.isFavorite ?? false,
      isExpired: raw.isExpired ?? false,
      reminderDate: raw.reminderDate ?? undefined,
    };

    const id = this.editId;
    if (id) {
      this.store.update(id, dto);
    } else {
      this.store.create(dto);
    }
    this.router.navigate(['/vault']);
  }
}
