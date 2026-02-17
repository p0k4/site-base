import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should navigate to login page', async ({ page }) => {
        await page.click('text=Entrar');
        await expect(page).toHaveURL(/.*login/);
        await expect(page.locator('h1, h2')).toContainText(/login|entrar/i);
    });

    test('should show validation errors for empty login form', async ({ page }) => {
        await page.goto('/login');

        // Try to submit empty form
        await page.click('button[type="submit"]');

        // Should show validation errors or stay on page
        await expect(page).toHaveURL(/.*login/);
    });

    test('should navigate to register page', async ({ page }) => {
        await page.click('text=Registar');
        await expect(page).toHaveURL(/.*register/);
        await expect(page.locator('h1, h2')).toContainText(/regist/i);
    });

    test('should show validation errors for empty register form', async ({ page }) => {
        await page.goto('/register');

        // Try to submit empty form
        await page.click('button[type="submit"]');

        // Should show validation errors or stay on page
        await expect(page).toHaveURL(/.*register/);
    });
});

test.describe('Authenticated User Flow', () => {
    test.skip('should login successfully with valid credentials', async ({ page }) => {
        // This test requires a test user to be created
        await page.goto('/login');

        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Should redirect to dashboard or home
        await expect(page).not.toHaveURL(/.*login/);
    });
});
