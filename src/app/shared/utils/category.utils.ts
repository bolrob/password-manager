import { CredentialCategory } from '../../core/models';

export const CATEGORY_LABELS: Record<CredentialCategory, string> = {
  social: 'Соцсети',
  banking: 'Банки',
  work: 'Работа',
  email: 'Почта',
  other: 'Другое',
};

export const CATEGORY_ICONS: Record<CredentialCategory, string> = {
  social: '@tui.users',
  banking: '@tui.landmark',
  work: '@tui.briefcase',
  email: '@tui.mail',
  other: '@tui.folder',
};

export const ALL_CATEGORIES: CredentialCategory[] = ['social', 'banking', 'work', 'email', 'other'];
