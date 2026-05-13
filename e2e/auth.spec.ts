import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page at /auth/login', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByText('PassVault')).toBeVisible();
    await expect(page.getByPlaceholder('demo@example.com')).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('link', { name: 'Зарегистрироваться' }).click();
    await expect(page).toHaveURL(/\/auth\/register/);
    await expect(page.getByText('Регистрация')).toBeVisible();
  });

  test('should login with demo credentials and redirect to vault', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByPlaceholder('demo@example.com').fill('demo@example.com');
    await page.getByPlaceholder('Введите пароль').fill('Demo1234!');
    await page.getByRole('button', { name: 'Войти' }).click();
    await expect(page).toHaveURL(/\/vault/);
    await expect(page.getByText('PassVault')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByPlaceholder('demo@example.com').fill('wrong@email.com');
    await page.getByPlaceholder('Введите пароль').fill('wrongpass');
    await page.getByRole('button', { name: 'Войти' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should redirect unauthenticated user from vault to login', async ({ page }) => {
    await page.goto('/vault');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
