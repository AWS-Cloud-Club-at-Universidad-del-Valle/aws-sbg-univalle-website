import { expect, test } from '@playwright/test';
import { CHALLENGE_SLUGS } from './helpers/mock-apis';

test.describe('Certifícate', () => {
  test('explica el programa y lista los 8 retos', async ({ page }) => {
    await page.goto('/certificate');

    await expect(page).toHaveTitle(/Certifícate \| AWS SBG Univalle/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Certifícate con');
    await expect(page.getByText('AWS Certified Cloud Practitioner')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Cohorte 1/ })).toBeVisible();

    for (const slug of CHALLENGE_SLUGS) {
      await expect(page.locator(`a[href="/certificate/challenges/${slug}"]`)).toBeVisible();
    }
  });

  test('el hub de retos muestra el flujo y las 8 tarjetas', async ({ page }) => {
    await page.goto('/certificate/challenges');

    await expect(page).toHaveTitle(/Retos AWS CDK \| AWS SBG Univalle/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('construyendo');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Certifícate');
    await expect(page.getByText('Entiende')).toBeVisible();
    await expect(page.getByText('Boss Fight').first()).toBeVisible();
    await expect(page.locator('a.ch-card')).toHaveCount(8);
  });

  test('un reto individual tiene breadcrumb, contenido y navegación', async ({ page }) => {
    await page.goto('/certificate/challenges/portafolios-estudiantiles');

    await expect(page).toHaveTitle(/Reto 1:/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Plataforma de Portafolios Estudiantiles' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Objetivo' })).toBeVisible();
    const pager = page.getByRole('navigation', { name: 'Navegación entre retos' }).first();
    await expect(pager).toBeVisible();
    await expect(pager.getByRole('link', { name: /Reto siguiente/ })).toHaveAttribute(
      'href',
      '/certificate/challenges/app-alta-demanda',
    );
  });

  test('todos los slugs de retos responden 200', async ({ page }) => {
    for (const slug of CHALLENGE_SLUGS) {
      const response = await page.goto(`/certificate/challenges/${slug}`);
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator('h1')).toBeVisible();
    }
  });
});
