import { test, expect } from '@playwright/test';

test('home page loads in English', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('body')).toBeVisible();
  await expect(page).toHaveTitle(/TheoryLane/i);
});

test('refund policy page loads', async ({ page }) => {
  await page.goto('/en/refund');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Refund/i);
});

test('privacy and terms pages load', async ({ page }) => {
  await page.goto('/en/privacy');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Privacy/i);
  await page.goto('/en/terms');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Terms/i);
});
