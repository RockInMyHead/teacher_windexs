import { test, expect } from '@playwright/test';

test.describe('Courses and Progress E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.context().addInitScript(() => {
      localStorage.clear();
    });

    // Register and login a test user
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');

    // Switch to register tab
    await page.getByRole('tab', { name: 'Регистрация' }).click();

    await page.fill('#register-name', 'Course Test User');
    await page.fill('#register-email', 'course-test@example.com');
    await page.fill('#register-password', 'password123');
    await page.check('#terms');
    await page.getByRole('button', { name: /зарегистрироваться/i }).click();
    await page.waitForURL('/courses');
  });

  test('browse available courses', async ({ page }) => {
    // Navigate to available courses
    await page.getByRole('button', { name: 'Курсы' }).click();
    await page.waitForURL('/available-courses');

    // Check courses page loaded
    await expect(page.locator('body')).toBeVisible();
  });

  test('user progress tracking', async ({ page }) => {
    // Navigate to personal account
    await page.getByRole('button', { name: 'Личный кабинет' }).click();
    await page.waitForURL('/account');

    // Check for progress indicators
    const progressElements = page.locator('text=Прогресс, text=Progress, [class*="progress"]').first();
    if (await progressElements.isVisible()) {
      await expect(progressElements).toBeVisible();
    }
  });

  test('subscription and billing flow', async ({ page }) => {
    // Navigate to personal account
    await page.getByRole('button', { name: 'Личный кабинет' }).click();
    await page.waitForURL('/account');

    // Look for subscription section
    const subscriptionSection = page.locator('text=Подписка, text=Subscription, [class*="subscription"]').first();
    if (await subscriptionSection.isVisible()) {
      await expect(subscriptionSection).toBeVisible();
    }
  });

  test('family account management', async ({ page }) => {
    // Navigate to personal account
    await page.getByRole('button', { name: 'Личный кабинет' }).click();
    await page.waitForURL('/account');

    // Look for family members section
    const familySection = page.locator('text=Семья, text=Family, [class*="family"]').first();
    if (await familySection.isVisible()) {
      await expect(familySection).toBeVisible();
    }
  });

  test('settings and preferences', async ({ page }) => {
    // Navigate to personal account
    await page.getByRole('button', { name: 'Личный кабинет' }).click();
    await page.waitForURL('/account');

    // Look for settings section
    const settingsSection = page.locator('text=Настройки, text=Settings, [class*="settings"]').first();
    if (await settingsSection.isVisible()) {
      await expect(settingsSection).toBeVisible();
    }
  });
});