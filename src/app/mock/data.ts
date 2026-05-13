import { Credential, User } from '../core/models';

export const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    name: 'Demo User',
    password: 'Demo1234!',
  },
];

export const MOCK_CREDENTIALS: Credential[] = [
  {
    id: 'cred-1',
    userId: 'user-1',
    title: 'GitHub',
    username: 'demo@example.com',
    password: 'Gh!tHub2024',
    url: 'https://github.com',
    category: 'work',
    tags: ['dev', 'git'],
    isFavorite: true,
    isExpired: false,
    passwordHistory: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cred-2',
    userId: 'user-1',
    title: 'Gmail',
    username: 'demo@gmail.com',
    password: 'gm@il2022',
    url: 'https://mail.google.com',
    category: 'email',
    tags: ['google'],
    isFavorite: false,
    isExpired: true,
    reminderDate: '2024-06-01',
    passwordHistory: [{ password: 'oldPass123', changedAt: '2023-01-01T00:00:00Z' }],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cred-3',
    userId: 'user-1',
    title: 'Сбербанк',
    username: '79001234567',
    password: 'Sber#8877',
    url: 'https://sberbank.ru',
    category: 'banking',
    tags: ['банк'],
    isFavorite: true,
    isExpired: false,
    passwordHistory: [],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];
