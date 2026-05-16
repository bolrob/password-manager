import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiError, TuiTextfield } from '@taiga-ui/core';
import { AuthService } from '../../../core/services/auth.service';

interface TestAccount {
  name: string;
  email: string;
  password: string;
  description: string;
}

const TEST_ACCOUNTS: TestAccount[] = [
  {
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'Demo1234!',
    description: 'Веб-сервисы, соцсети, банки',
  },
  {
    name: 'Alice Dev',
    email: 'alice@example.com',
    password: 'Alice1234!',
    description: 'DevOps, облака, CI/CD',
  },
  {
    name: 'Bob Admin',
    email: 'bob@example.com',
    password: 'Bob1234!',
    description: 'Серверы, базы данных, мониторинг',
  },
];

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TuiTextfield, TuiButton, TuiError],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly testAccounts = TEST_ACCOUNTS;

  fillTestAccount(account: TestAccount): void {
    this.form.setValue({ email: account.email, password: account.password });
    this.error.set(null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.form.getRawValue() as { email: string; password: string }).subscribe({
      next: () => this.router.navigate(['/vault']),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Ошибка входа');
        this.loading.set(false);
      },
    });
  }
}
