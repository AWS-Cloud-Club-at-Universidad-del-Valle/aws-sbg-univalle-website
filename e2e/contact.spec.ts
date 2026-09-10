import { expect, test } from '@playwright/test';
import { CORE_TEAM_NAMES } from './helpers/mock-apis';

test.describe('Contacto', () => {
  test('presenta al Core Team completo', async ({ page }) => {
    await page.goto('/contact');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Conoce a nuestro equipo' }),
    ).toBeVisible();

    for (const name of CORE_TEAM_NAMES) {
      await expect(page.getByRole('heading', { name })).toBeVisible();
    }

    const leader = page.locator('article').filter({
      has: page.getByRole('heading', { name: 'Juan Manuel Hoyos Contreras' }),
    });
    await expect(leader.getByRole('link', { name: /LinkedIn/i })).toBeVisible();
    await expect(leader.getByRole('link', { name: /GitHub/i })).toBeVisible();
  });
});
