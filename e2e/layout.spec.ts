import { expect, test } from '@playwright/test';
import { NAV_ITEMS } from './helpers/mock-apis';

test.describe('Layout, navegación y SEO básico', () => {
  test('cada página tiene skip link, un main y footer', async ({ page }) => {
    for (const item of NAV_ITEMS) {
      await page.goto(item.href);

      const skip = page.getByRole('link', { name: 'Ir al contenido principal' });
      await expect(skip).toHaveAttribute('href', '#main-content');

      await expect(page.locator('main#main-content')).toHaveCount(1);
      await expect(page.getByRole('contentinfo')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    }
  });

  test('el menú principal cubre todas las rutas del sitio', async ({ page }) => {
    await page.goto('/');
    const menu = page.getByRole('navigation', { name: 'Menú principal' });

    for (const item of NAV_ITEMS) {
      await expect(menu.getByRole('link', { name: item.label, exact: true })).toHaveAttribute(
        'href',
        item.href,
      );
    }
  });

  test('navegar por el menú marca la página activa', async ({ page }) => {
    await page.goto('/');
    const menu = page.getByRole('navigation', { name: 'Menú principal' });

    await menu.getByRole('link', { name: 'Nosotros', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/?$/);
    await expect(menu.getByRole('link', { name: 'Nosotros', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await menu.getByRole('link', { name: 'Contacto', exact: true }).click();
    await expect(page).toHaveURL(/\/contact\/?$/);
    await expect(menu.getByRole('link', { name: 'Contacto', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(menu.getByRole('link', { name: 'Nosotros', exact: true })).not.toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('el footer incluye navegación, recursos AWS y redes', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByRole('contentinfo');

    await expect(footer.getByRole('heading', { name: 'Navegación' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Eventos' })).toHaveAttribute('href', '/events');
    await expect(footer.getByRole('link', { name: 'AWS Skill Builder' })).toBeVisible();
    await expect(footer.getByRole('list', { name: 'Redes sociales' })).toBeVisible();
  });

  test('títulos de página siguen el patrón del sitio', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Inicio \| AWS SBG Univalle/);

    await page.goto('/about');
    await expect(page).toHaveTitle(/Nosotros \| AWS SBG Univalle/);

    await page.goto('/resources');
    await expect(page).toHaveTitle(/Recursos \| AWS SBG Univalle/);
  });

  test('robots.txt está publicado', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain('User-agent');
    expect(body).toContain('Sitemap:');
  });
});
