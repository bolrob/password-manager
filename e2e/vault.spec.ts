import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/login');
  await page.getByPlaceholder('demo@example.com').fill('demo@example.com');
  await page.getByPlaceholder('Введите пароль').fill('Demo1234!');
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page).toHaveURL(/\/vault/);
});

test.describe('Vault', () => {
  test('should display credential list', async ({ page }) => {
    await expect(page.getByRole('list', { name: 'Список записей' })).toBeVisible();
    await expect(page.getByText('GitHub')).toBeVisible();
  });

  test('should filter credentials by search query', async ({ page }) => {
    await page.getByLabel('Поиск записей').fill('GitHub');
    await expect(page.getByText('GitHub')).toBeVisible();
    await expect(page.getByText('Gmail')).not.toBeVisible();
  });

  test('should navigate to create form', async ({ page }) => {
    await page.getByRole('link', { name: 'Добавить' }).click();
    await expect(page).toHaveURL(/\/vault\/new/);
    await expect(page.getByText('Новая запись')).toBeVisible();
  });

  test('should create a new credential', async ({ page }) => {
    await page.goto('/vault/new');
    await page.getByPlaceholder('Например: GitHub').fill('Test Site');
    await page.getByPlaceholder('user@example.com').fill('user@test.com');
    await page.getByPlaceholder('Введите или сгенерируйте').fill('SecurePass1!');
    await page.getByRole('button', { name: 'Создать' }).click();
    await expect(page).toHaveURL(/\/vault$/);
    await expect(page.getByText('Test Site')).toBeVisible();
  });

  test('should show expired credentials section', async ({ page }) => {
    await page.getByRole('button', { name: /Устаревшие/ }).click();
    await expect(page.getByText('Gmail')).toBeVisible();
  });
});
