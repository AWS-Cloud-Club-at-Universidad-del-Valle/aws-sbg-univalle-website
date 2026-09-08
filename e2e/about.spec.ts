import { expect, test } from '@playwright/test';

test.describe('Nosotros', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('presenta identidad, misión, visión y CTA', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Nosotros' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '¿Quiénes somos?' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Misión' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Visión' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '¡Únete a la comunidad!' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Únete en LinkedIn' })).toBeVisible();
  });

  test('expone los canales sociales del grupo', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'WhatsApp del AWS SBG Univalle' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Instagram del AWS SBG Univalle' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'YouTube del AWS SBG Univalle' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Enviar correo al AWS SBG Univalle' })).toHaveAttribute(
      'href',
      'mailto:aws.cloud.club@correounivalle.edu.co',
    );
  });
});
