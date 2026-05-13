import { Pipe, PipeTransform } from '@angular/core';
import { PasswordStrength } from '../../core/models';

@Pipe({ name: 'strengthLabel', standalone: true })
export class StrengthLabelPipe implements PipeTransform {
  transform(strength: PasswordStrength): string {
    const map: Record<PasswordStrength, string> = {
      weak: 'Слабый',
      fair: 'Средний',
      good: 'Хороший',
      strong: 'Надёжный',
    };
    return map[strength];
  }
}
