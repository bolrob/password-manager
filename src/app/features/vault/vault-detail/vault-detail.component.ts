import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiChip } from '@taiga-ui/kit';
import { CredentialService } from '../../../core/services/credential.service';
import { PasswordService } from '../../../core/services/password.service';
import { Credential } from '../../../core/models';
import { CATEGORY_LABELS } from '../../../shared/utils/category.utils';
import { StrengthLabelPipe } from '../../../shared/pipes/strength-label.pipe';
import { StrengthColorPipe } from '../../../shared/pipes/strength-color.pipe';

@Component({
  selector: 'app-vault-detail',
  imports: [RouterLink, DatePipe, TuiButton, TuiIcon, TuiChip, StrengthLabelPipe, StrengthColorPipe],
  templateUrl: './vault-detail.component.html',
  styleUrl: './vault-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VaultDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly credentialService = inject(CredentialService);
  readonly passwordService = inject(PasswordService);

  readonly credential = signal<Credential | null>(null);
  readonly showPassword = signal(false);
  readonly categoryLabels = CATEGORY_LABELS;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.credentialService.getById(id).subscribe((c) => this.credential.set(c));
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }
}
