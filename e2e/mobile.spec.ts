import { expect, test } from '@playwright/test';

test.describe('Navegación móvil', () => {
  test('abre, navega y cierra el menú hamburger', async ({ page }) => {
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Abrir menú' });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const menu = page.getByRole('navigation', { name: 'Menú principal' });
    await expect(menu.getByRole('link', { name: 'Recursos', exact: true })).toBeVisible();
    await menu.getByRole('link', { name: 'Recursos', exact: true }).click();

    await expect(page).toHaveURL(/\/resources\/?$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Recursos' })).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('Escape cierra el menú abierto', async ({ page }) => {
    await page.goto('/about');

    const toggle = page.getByRole('button', { name: 'Abrir menú' });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
