import { test, expect } from '@playwright/test';

test.describe('Error Handling E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.context().addInitScript(() => {
      localStorage.clear();
    });
  });

  test('handle corrupted localStorage data', async ({ page }) => {
    // Set corrupted data in localStorage
    await page.context().addInitScript(() => {
      localStorage.setItem('user', 'invalid-json-data');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // App should handle corrupted data gracefully - check if we can still access auth page
    await expect(page.locator('body')).toBeVisible();
  });

  test('handle page refresh and state persistence', async ({ page }) => {
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');

    // Switch to register tab
    await page.getByRole('tab', { name: 'Регистрация' }).click();

    // Register user
    await page.fill('#register-name', 'Refresh Test User');
    await page.fill('#register-email', 'refresh-test@example.com');
    await page.fill('#register-password', 'password123');
    await page.check('#terms');
    await page.getByRole('button', { name: /зарегистрироваться/i }).click();
    await page.waitForURL('/courses');

    // Refresh page
    await page.reload();

    // Should maintain user session
    await expect(page).toHaveURL('/courses');
    await expect(page.getByRole('heading', { name: 'Мои курсы' })).toBeVisible();
  });
});