import { test, expect } from '@playwright/test';

test.describe('User Journey E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.context().addInitScript(() => {
      localStorage.clear();
    });
  });

  test('complete user registration and assessment flow', async ({ page }) => {
    // Navigate to auth page directly
    await page.goto('/auth');

    // Wait for the app to load
    await page.waitForLoadState('networkidle');

    // Switch to register tab
    await page.getByRole('tab', { name: 'Регистрация' }).click();

    // Check if we're on the register tab
    await expect(page.getByRole('tab', { name: 'Регистрация' })).toHaveAttribute('data-state', 'active');

    // Register a new user using proper selectors
    await page.fill('#register-name', 'Test User E2E');
    await page.fill('#register-email', 'test-e2e@example.com');
    await page.fill('#register-password', 'password123');

    // Accept terms
    await page.check('#terms');

    // Click register button
    await page.getByRole('button', { name: /зарегистрироваться/i }).click();

    // Wait for registration to complete and redirect
    await page.waitForURL('/courses');

    // Verify we're on the courses page (after registration)
    await expect(page).toHaveURL('/courses');
    await expect(page.getByRole('heading', { name: 'Мои курсы' })).toBeVisible();
  });


  test('simple page load test', async ({ page }) => {
    // Simple test to check if pages load
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Windexs-Учитель', { exact: true })).toBeVisible();

    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
    // Just check that page loads without errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('responsive design on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is only for mobile viewports');

    await page.goto('/auth');
    await page.waitForLoadState('networkidle');

    // Switch to register tab
    await page.getByRole('tab', { name: 'Регистрация' }).click();

    // Register on mobile
    await page.fill('#register-name', 'Mobile User');
    await page.fill('#register-email', 'mobile@example.com');
    await page.fill('#register-password', 'password123');
    await page.check('#terms');
    await page.getByRole('button', { name: /зарегистрироваться/i }).click();

    // Check that mobile layout works
    await page.waitForURL('/courses');
    await expect(page.getByRole('heading', { name: 'Мои курсы' })).toBeVisible();

    // Test mobile navigation
    await page.getByRole('link', { name: /личный кабинет/i }).click();
    await page.waitForURL('/account');
    await expect(page.getByText('Личный кабинет')).toBeVisible();
  });
});
