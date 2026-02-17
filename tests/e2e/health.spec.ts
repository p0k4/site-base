import { test, expect } from '@playwright/test';

test.describe('Health Check', () => {
    test('API health endpoint should return ok', async ({ request }) => {
        const response = await request.get('http://localhost:4000/health');

        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data.status).toBe('ok');
        expect(data.database).toBe('connected');
        expect(data).toHaveProperty('timestamp');
        expect(data).toHaveProperty('uptime');
    });

    test('Frontend should load successfully', async ({ page }) => {
        await page.goto('/');

        // Check that the page loaded
        await expect(page).toHaveTitle(/.*Marketplace.*/i);

        // Check for main navigation
        await expect(page.locator('header')).toBeVisible();
    });
});
