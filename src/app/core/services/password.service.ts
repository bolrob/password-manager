import { Injectable } from '@angular/core';
import { PasswordStrength } from '../models';

export interface GeneratorOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private readonly UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  private readonly NUMBERS = '0123456789';
  private readonly SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  generate(options: GeneratorOptions): string {
    let chars = '';
    const required: string[] = [];

    if (options.uppercase) {
      chars += this.UPPERCASE;
      required.push(this.randomChar(this.UPPERCASE));
    }
    if (options.lowercase) {
      chars += this.LOWERCASE;
      required.push(this.randomChar(this.LOWERCASE));
    }
    if (options.numbers) {
      chars += this.NUMBERS;
      required.push(this.randomChar(this.NUMBERS));
    }
    if (options.symbols) {
      chars += this.SYMBOLS;
      required.push(this.randomChar(this.SYMBOLS));
    }

    if (!chars) return '';

    const remaining = Array.from(
      { length: options.length - required.length },
      () => this.randomChar(chars),
    );

    return this.shuffle([...required, ...remaining]).join('');
  }

  getStrength(password: string): PasswordStrength {
    if (!password || password.length < 6) return 'weak';

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'fair';
    if (score <= 5) return 'good';
    return 'strong';
  }

  getStrengthScore(password: string): number {
    const map: Record<PasswordStrength, number> = { weak: 25, fair: 50, good: 75, strong: 100 };
    return map[this.getStrength(password)];
  }

  private randomChar(chars: string): string {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  private shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
