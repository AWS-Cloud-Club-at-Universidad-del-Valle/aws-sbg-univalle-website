import { expect, test } from '@playwright/test';
import { mockBackendApis, mockEventsApiFailure } from './helpers/mock-apis';

test.describe('Eventos', () => {
  test.skip(
    !!process.env.CI,
    'Se omite en CI porque depende de mocks locales de la API de eventos.',
  );

  test('lista próximos eventos, filtra y pagina', async ({ page }) => {
    await mockBackendApis(page);
    await page.goto('/events');

    await expect(page.getByRole('heading', { level: 1, name: 'Eventos' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Próximos eventos' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await expect(page.getByRole('status')).toContainText(/eventos/);
    await expect(page.locator('a.event-card')).toHaveCount(12);
    await expect(page.getByRole('navigation', { name: 'Paginación de eventos' })).toBeVisible();

    await page.getByRole('button', { name: 'Siguiente' }).click();
    await expect(page.getByText(/Página 2 de/)).toBeVisible();
    await expect(page.locator('a.event-card')).toHaveCount(2);

    await page.locator('#filter-type').selectOption('CHARLA');
    await expect(page.getByRole('heading', { name: 'Charla Cloud Practitioner' })).toBeVisible();
    await expect(page.locator('a.event-card')).toHaveCount(1);

    await page.getByRole('button', { name: 'Limpiar filtros' }).click();
    await expect(page.locator('#filter-type')).toHaveValue('');
    await expect(page.locator('a.event-card')).toHaveCount(12);
  });

  test('la pestaña de realizados muestra eventos pasados', async ({ page }) => {
    await mockBackendApis(page);
    await page.goto('/events');

    await page.getByRole('tab', { name: 'Eventos realizados' }).click();
    await expect(page.getByRole('tab', { name: 'Eventos realizados' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByRole('heading', { name: 'Hackathon Cloud Challenge' })).toBeVisible();
    await expect(page.locator('a.event-card')).toHaveCount(1);
  });

  test('un filtro sin coincidencias muestra el estado vacío', async ({ page }) => {
    await mockBackendApis(page);
    await page.goto('/events');

    await page.locator('#filter-type').selectOption('HACKATHON');
    await expect(page.getByText('No hay eventos que coincidan con los filtros.')).toBeVisible();
  });

  test('abre el detalle desde una tarjeta', async ({ page }) => {
    await mockBackendApis(page);
    await page.goto('/events');

    await page.getByRole('heading', { name: 'Charla Cloud Practitioner' }).click();
    await expect(page).toHaveURL(/\/events\/detalle\?id=evt-charla-1/);
    await expect(page.locator('#detail-content h1')).toHaveText('Charla Cloud Practitioner');
    await expect(page.getByRole('link', { name: 'Volver a eventos' })).toHaveAttribute(
      'href',
      '/events',
    );
  });

  test('detalle sin id y detalle inexistente muestran error', async ({ page }) => {
    await mockBackendApis(page);

    await page.goto('/events/detalle');
    await expect(page.getByRole('alert')).toContainText('No se especificó un evento válido.');

    await page.goto('/events/detalle?id=no-existe');
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.locator('#detail-error').getByRole('link', { name: 'Volver a eventos' })).toBeVisible();
  });

  test('si la API falla se puede reintentar', async ({ page }) => {
    await mockEventsApiFailure(page);
    await page.goto('/events');
    await expect(page.getByRole('alert')).toBeVisible();

    await page.unrouteAll({ behavior: 'ignoreErrors' });
    await mockBackendApis(page);
    await page.getByRole('button', { name: 'Reintentar' }).click();
    await expect(page.locator('a.event-card').first()).toBeVisible();
  });
});
