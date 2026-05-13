import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { GeneratorOptions, PasswordService } from '../../core/services/password.service';
import { StrengthColorPipe } from '../../shared/pipes/strength-color.pipe';
import { StrengthLabelPipe } from '../../shared/pipes/strength-label.pipe';

@Component({
  selector: 'app-generator',
  imports: [
    FormsModule,
    RouterLink,
    TuiTextfield,
    TuiButton,
    TuiIcon,
    StrengthColorPipe,
    StrengthLabelPipe,
  ],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratorComponent {
  private readonly passwordService = inject(PasswordService);

  readonly options = signal<GeneratorOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  readonly generated = signal('');
  readonly copied = signal(false);

  get strength() {
    return this.passwordService.getStrength(this.generated());
  }

  get strengthScore() {
    return this.passwordService.getStrengthScore(this.generated());
  }

  generate(): void {
    this.generated.set(this.passwordService.generate(this.options()));
    this.copied.set(false);
  }

  copyToClipboard(): void {
    if (!this.generated()) return;
    navigator.clipboard.writeText(this.generated()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  updateOption<K extends keyof GeneratorOptions>(key: K, value: GeneratorOptions[K]): void {
    this.options.update((opts) => ({ ...opts, [key]: value }));
  }
}
