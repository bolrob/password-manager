import { Pipe, PipeTransform } from '@angular/core';
import { PasswordStrength } from '../../core/models';

@Pipe({ name: 'strengthColor', standalone: true })
export class StrengthColorPipe implements PipeTransform {
  transform(strength: PasswordStrength): string {
    const map: Record<PasswordStrength, string> = {
      weak: 'var(--tui-status-negative)',
      fair: 'var(--tui-status-warning)',
      good: 'var(--tui-status-positive)',
      strong: 'var(--tui-status-info)',
    };
    return map[strength];
  }
}
