# PassVault - Менеджер паролей

Веб-приложение для безопасного хранения учётных данных с генерацией паролей, категоризацией, поиском и историей изменений.

**Деплой:** https://bolrob.github.io/password-manager/

---

## Стек

| Технология                 | Версия  |
| -------------------------- | ------- |
| Angular                    | 21      |
| Taiga UI                   | 5       |
| NgRx Signal Store          | 21      |
| MSW (Mock Service Worker)  | 2       |
| Jest + jest-preset-angular | 30 / 16 |
| Playwright                 | 1.60    |
| TypeScript                 | 5.9     |

---

## Структура проекта

```
src/app/
├── core/
│   ├── guards/          # authGuard, noAuthGuard
│   ├── interceptors/    # authInterceptor, errorInterceptor
│   ├── models/          # TypeScript-интерфейсы
│   └── services/        # AuthService, CredentialService, PasswordService
├── features/
│   ├── auth/            # login, register (lazy)
│   ├── vault/           # list, form, detail + VaultStore (lazy)
│   └── generator/       # генератор паролей (lazy)
├── mock/                # MSW handlers + mock data
└── shared/
    ├── pipes/           # strengthColor, strengthLabel
    └── utils/           # category labels/icons
```

---

## Запуск

```bash
# Установить зависимости
npm install

# Запустить dev-сервер (MSW подключится автоматически)
npm start
# Откройте http://localhost:4200
# Демо: demo@example.com / Demo1234!

# Сборка для production
npm run build:prod

# Unit-тесты (Jest)
npm test

# E2E тесты (Playwright)
npm run test:e2e

# Линтеры
npm run lint
npm run lint:styles
npm run format:check
```

---

## Функциональность

- **Авторизация** — вход / регистрация, JWT через localStorage, guards + interceptors
- **Vault** — CRUD записей с логином, паролем, URL, заметками, категорией, тегами
- **Категории** — соцсети, банки, работа, почта, другое
- **Поиск** — по названию и логину, фильтр по категории и флагу «устаревший»
- **Генератор** — настраиваемый генератор с индикатором надёжности
- **История** — автоматическое сохранение предыдущих паролей при обновлении
- **Напоминания** — дата смены пароля
- **Экспорт** — JSON выгрузка всех записей
- **Адаптивная вёрстка** — desktop / tablet / mobile

---

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`):

| Job    | Задачи                                |
| ------ | ------------------------------------- |
| lint   | ESLint, Stylelint, Prettier           |
| test   | Jest unit-тесты                       |
| build  | `ng build --configuration production` |
| deploy | GitHub Pages (только ветка `main`)    |

---

## Документация

- [`docs/plan.md`](docs/plan.md) — план разработки, этапы, риски
- [`docs/ux.md`](docs/ux.md) — персоны, user stories, дизайн-система
