export type CredentialCategory = 'social' | 'banking' | 'work' | 'email' | 'other';

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordHistoryEntry {
  password: string;
  changedAt: string;
}

export interface Credential {
  id: string;
  userId: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category: CredentialCategory;
  tags: string[];
  isFavorite: boolean;
  isExpired: boolean;
  reminderDate?: string;
  passwordHistory: PasswordHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export type CreateCredentialDto = Omit<Credential, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'passwordHistory'>;

export type UpdateCredentialDto = Partial<CreateCredentialDto>;
