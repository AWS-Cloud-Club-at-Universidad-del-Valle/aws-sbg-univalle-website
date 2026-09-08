import { expect, test } from '@playwright/test';
import { mockBackendApis } from './helpers/mock-apis';

test.describe('Participa', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendApis(page);
    await page.goto('/participate');
  });

  test('presenta las formas de participación y el formulario', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: 'Participa en la Comunidad' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: '¿Cómo puedes participar?' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dar una charla' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Proponer un workshop' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Proponer un taller' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ser voluntario' })).toBeVisible();
    await expect(page.locator('#proposal-form')).toBeVisible();
  });

  test('una tarjeta preselecciona el tipo y lleva al formulario', async ({ page }) => {
    await page.getByRole('button', { name: 'Participar: Ser voluntario' }).click();

    await expect(page.locator('#participate-form')).toBeInViewport();
    await expect(page.locator('input[name="type"][value="VOLUNTEER"]')).toBeChecked();
    await expect(page.locator('#talk-fields')).toBeHidden();
  });

  test('valida campos obligatorios al enviar vacío', async ({ page }) => {
    await page.locator('#submit-btn').click();

    await expect(page.locator('#firstName-error')).toHaveText('Este campo es obligatorio.');
    await expect(page.locator('#lastName-error')).toHaveText('Este campo es obligatorio.');
    await expect(page.locator('#email-error')).toHaveText('Este campo es obligatorio.');
    await expect(page.locator('#consent-error')).toContainText('Debes aceptar');
  });

  test('rechaza un correo inválido', async ({ page }) => {
    await page.locator('#firstName').fill('Ana');
    await page.locator('#lastName').fill('López');
    await page.locator('#email').fill('correo-invalido');
    await page.locator('#consent').check();
    await page.locator('#title').fill('Intro a Lambda');
    await page.locator('#description').fill('Una charla introductoria sobre AWS Lambda.');
    await page.locator('label.radio-pill', { hasText: 'Virtual' }).click();
    await page.locator('label.level-card', { hasText: '100 — Introductorio' }).click();
    await page.locator('#submit-btn').click();

    await expect(page.locator('#email-error')).toHaveText(
      'Ingresa un correo electrónico válido.',
    );
  });

  test('envía una charla válida y muestra confirmación', async ({ page }) => {
    await page.locator('#firstName').fill('Ana');
    await page.locator('#lastName').fill('López');
    await page.locator('#email').fill('ana.lopez@correounivalle.edu.co');
    await page.locator('#title').fill('Intro a Lambda');
    await page.locator('#description').fill('Una charla introductoria sobre AWS Lambda.');
    await page.locator('label.radio-pill', { hasText: 'Virtual' }).click();
    await page.locator('label.level-card', { hasText: '100 — Introductorio' }).click();
    await page.locator('#consent').check();
    await page.locator('#submit-btn').click();

    await expect(page.getByRole('heading', { name: '¡Gracias por participar!' })).toBeVisible();
    await expect(page.locator('#proposal-form')).toBeHidden();

    await page.locator('#form-reset').click();
    await expect(page.locator('#proposal-form')).toBeVisible();
  });

  test('un voluntario no necesita campos de charla', async ({ page }) => {
    await page.locator('label.chip', { hasText: 'Ser voluntario' }).click();
    await page.locator('#firstName').fill('Carlos');
    await page.locator('#lastName').fill('Ruiz');
    await page.locator('#email').fill('carlos.ruiz@correounivalle.edu.co');
    await page.locator('#consent').check();
    await page.locator('#submit-btn').click();

    await expect(page.getByRole('heading', { name: '¡Gracias por participar!' })).toBeVisible();
  });
});
