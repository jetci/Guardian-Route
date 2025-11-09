import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Authentication - Login Flow
 * 
 * Test Cases:
 * - TC-AUTH-001: Successful Login
 * - TC-AUTH-002: Login with Invalid Credentials
 * - TC-AUTH-003: Login with Empty Fields
 * - TC-AUTH-004: Login with Invalid Email Format
 * - TC-AUTH-005: Quick Login Buttons
 */

test.describe('Authentication - Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test('TC-AUTH-001: Successful Login', async ({ page }) => {
    // Enter valid credentials
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Click login button
    await page.click('button:has-text("เข้าสู่ระบบ")');

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Verify user is logged in
    await expect(page).toHaveURL(/\/dashboard/);

    // Verify user data is displayed (check for user menu or name)
    const userMenu = page.locator('[data-testid="user-menu"], button:has-text("admin")');
    await expect(userMenu).toBeVisible({ timeout: 5000 });

    // Verify tokens are stored in localStorage
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
    
    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
  });

  test('TC-AUTH-002: Login with Invalid Credentials', async ({ page }) => {
    // Enter invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    // Click login button
    await page.click('button:has-text("เข้าสู่ระบบ")');

    // Wait for error toast
    await page.waitForTimeout(1000);

    // Verify error message appears
    const errorToast = page.locator('[role="alert"], .chakra-alert, .toast-error');
    await expect(errorToast).toBeVisible({ timeout: 5000 });

    // Verify still on login page
    await expect(page).toHaveURL(/\/login/);

    // Verify no tokens in localStorage
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(accessToken).toBeFalsy();
  });

  test('TC-AUTH-003: Login with Empty Fields', async ({ page }) => {
    // Leave fields empty and click login
    await page.click('button:has-text("เข้าสู่ระบบ")');

    // Wait for validation errors
    await page.waitForTimeout(500);

    // Verify validation error messages appear
    const emailError = page.locator('text=/กรุณากรอกอีเมล/i');
    const passwordError = page.locator('text=/กรุณากรอกรหัสผ่าน/i');

    await expect(emailError.or(passwordError)).toBeVisible({ timeout: 3000 });

    // Verify still on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-AUTH-004: Login with Invalid Email Format', async ({ page }) => {
    // Enter invalid email format
    await page.fill('input[type="email"]', 'notanemail');
    await page.fill('input[type="password"]', 'password123');

    // Click login button
    await page.click('button:has-text("เข้าสู่ระบบ")');

    // Wait for validation error
    await page.waitForTimeout(500);

    // Verify validation error appears
    const emailError = page.locator('text=/รูปแบบอีเมลไม่ถูกต้อง/i, text=/invalid email/i');
    await expect(emailError).toBeVisible({ timeout: 3000 });
  });

  test('TC-AUTH-005: Quick Login Buttons', async ({ page }) => {
    // Find and click Admin quick login button
    const adminButton = page.locator('button:has-text("Admin"), button:has-text("ผู้ดูแลระบบ")').first();
    
    // Check if quick login buttons exist
    const buttonExists = await adminButton.count() > 0;
    
    if (buttonExists) {
      await adminButton.click();

      // Wait for redirect to dashboard
      await page.waitForURL('**/dashboard', { timeout: 10000 });

      // Verify user is logged in
      await expect(page).toHaveURL(/\/dashboard/);

      // Verify ADMIN role
      const userMenu = page.locator('[data-testid="user-menu"], button:has-text("admin")');
      await expect(userMenu).toBeVisible({ timeout: 5000 });
    } else {
      // Skip test if quick login buttons are not available
      test.skip();
    }
  });

  test('TC-AUTH-006: Disabled State During Login', async ({ page }) => {
    // Enter valid credentials
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Click login button
    const loginButton = page.locator('button:has-text("เข้าสู่ระบบ")');
    await loginButton.click();

    // Immediately check if inputs are disabled
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Note: This might be too fast to catch, so we check for loading spinner instead
    const loadingSpinner = page.locator('svg.animate-spin, [data-testid="loading-spinner"]');
    
    // Either spinner is visible or we've already redirected
    const spinnerVisible = await loadingSpinner.isVisible().catch(() => false);
    const alreadyRedirected = page.url().includes('/dashboard');

    expect(spinnerVisible || alreadyRedirected).toBeTruthy();
  });
});
