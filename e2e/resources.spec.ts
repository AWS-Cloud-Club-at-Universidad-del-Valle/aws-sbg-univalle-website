import { expect, test } from '@playwright/test';
import { RESOURCE_TITLES } from './helpers/mock-apis';

test.describe('Recursos', () => {
  test('muestra la guía de recursos oficiales de AWS', async ({ page }) => {
    await page.goto('/resources');

    await expect(page.getByRole('heading', { level: 1, name: 'Recursos' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Explora los recursos' })).toBeVisible();

    for (const title of RESOURCE_TITLES) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
    }

    await expect(
      page.getByRole('link', { name: /Visitar AWS Skill Builder/ }),
    ).toHaveAttribute('href', 'https://skillbuilder.aws/');
  });
});
