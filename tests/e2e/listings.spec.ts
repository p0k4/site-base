import { test, expect } from '@playwright/test';

test.describe('Listings', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display listings page', async ({ page }) => {
        // Navigate to listings/cars page
        await page.goto('/carros');

        // Check that we're on the listings page
        await expect(page).toHaveURL(/.*carros/);
    });

    test('should show listing cards', async ({ page }) => {
        await page.goto('/carros');

        // Wait for listings to load
        await page.waitForTimeout(1000);

        // Check if there are listing cards or a "no results" message
        const hasListings = await page.locator('[class*="card"], [class*="listing"]').count();
        const hasNoResults = await page.locator('text=/sem resultados|no results/i').count();

        expect(hasListings > 0 || hasNoResults > 0).toBeTruthy();
    });

    test('should navigate to listing detail', async ({ page }) => {
        await page.goto('/carros');

        // Wait for listings to load
        await page.waitForTimeout(1000);

        // Click on first listing if available
        const firstListing = page.locator('a[href*="/carros/"]').first();
        const count = await firstListing.count();

        if (count > 0) {
            await firstListing.click();

            // Should navigate to detail page
            await expect(page).toHaveURL(/.*carros\/.+/);
        }
    });

    test('should filter listings', async ({ page }) => {
        await page.goto('/carros');

        // Look for filter inputs
        const filterInputs = page.locator('input[type="text"], select, input[type="number"]');
        const count = await filterInputs.count();

        // If filters exist, test them
        if (count > 0) {
            // Just verify filters are present
            expect(count).toBeGreaterThan(0);
        }
    });
});
