import { expect, test } from '@playwright/test';

test.describe('Inicio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('muestra hero, propuesta de valor y CTAs', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('futuro en la nube');
    await expect(page.getByRole('link', { name: 'Únete al grupo' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver eventos' })).toHaveAttribute(
      'href',
      '#eventos',
    );
  });

  test('incluye quiénes somos, beneficios, FAQ y Meetup', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /AWS Student Builder Group/ }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aprendizaje práctico' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '¿Por qué unirte?' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aprende tecnología cloud real' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Síguenos en\s+Meetup/ }),
    ).toBeVisible();
  });

  test('el acordeón de preguntas abre y cierra respuestas', async ({ page }) => {
    const question = page.getByText('¿Necesito saber programar para unirme?');
    const details = page.locator('details').filter({ hasText: '¿Necesito saber programar para unirme?' });

    await question.scrollIntoViewIfNeeded();
    await expect(details).not.toHaveAttribute('open');

    await question.click();
    await expect(details).toHaveAttribute('open', '');
    await expect(
      page.getByText(/No\. Tenemos rutas para todos los niveles/),
    ).toBeVisible();

    await question.click();
    await expect(details).not.toHaveAttribute('open');
  });
});
