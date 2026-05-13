import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/login');
  await page.getByPlaceholder('demo@example.com').fill('demo@example.com');
  await page.getByPlaceholder('Введите пароль').fill('Demo1234!');
  await page.getByRole('button', { name: 'Войти' }).click();
  await page.goto('/generator');
});

test.describe('Password Generator', () => {
  test('should display generator page', async ({ page }) => {
    await expect(page.getByText('Генератор паролей')).toBeVisible();
  });

  test('should generate a password on button click', async ({ page }) => {
    await page.getByRole('button', { name: 'Сгенерировать' }).click();
    const pwd = await page.locator('.result-password').textContent();
    expect(pwd?.length).toBeGreaterThan(0);
  });

  test('should show strength indicator after generation', async ({ page }) => {
    await page.getByRole('button', { name: 'Сгенерировать' }).click();
    await expect(page.locator('.strength-label')).toBeVisible();
  });

  test('should copy generated password', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: 'Сгенерировать' }).click();
    await page.getByRole('button', { name: 'Копировать' }).click();
    await expect(page.getByText('Скопировано!')).toBeVisible();
  });
});
