import { expect, test, type Page } from '@playwright/test';

const endpoint = 'https://kirothon-form.example.test/exec';
const team = 'Nube Tuluá';
const members = [
  { name: 'Ana Torres', email: 'ana@example.com' },
  { name: 'Luis Mora', email: 'luis@example.com' },
  { name: 'Sara Ruiz', email: 'sara@example.com' },
];

async function fillTeam(page: Page, count = members.length) {
  await page.getByLabel('Nombre del equipo').fill(team);
  for (let index = 1; index < count; index++) {
    await page.getByRole('button', { name: 'Agregar integrante' }).click();
  }
  for (const [index, member] of members.slice(0, count).entries()) {
    const group = page.getByRole('group', { name: new RegExp(`^Integrante ${index + 1}`) });
    await group.getByLabel('Nombre completo').fill(member.name);
    await group.getByLabel('Correo').fill(member.email);
  }
  await page.getByRole('checkbox', { name: /Autorizo a AWS SBG Univalle/ }).check();
}

test.describe('Registro para Kirothon', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kirothon');
  });

  test('integra el registro debajo del hero y conserva las secciones de la hackathon', async ({ page }) => {
    const registration = page.getByRole('region', { name: 'Registro para Kirothon' });
    await expect(page.getByRole('timer')).toBeVisible();
    await expect(page.locator('.kirothon > header + section')).toHaveAccessibleName('Registro para Kirothon');
    await expect(registration.getByRole('heading', { name: 'Únete en Meetup' })).toBeVisible();
    await expect(registration.getByRole('heading', { name: 'Inscribe a tu equipo' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '¿Qué es Kiro?' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cómo funciona', exact: true })).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Rúbrica' })).toHaveCount(0);
    await expect(page.getByText('Qué entrega cada equipo')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Premios' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Nos vemos en la Kirothon' })).toBeVisible();
  });

  test('el paso 2 está bloqueado y el checkbox guarda la confirmación', async ({ page }) => {
    const teamField = page.getByLabel('Nombre del equipo');
    const meetup = page.getByRole('checkbox', { name: 'Ya me uní al evento en Meetup' });
    await expect(teamField).toBeDisabled();
    await expect(page.getByText('Primero únete en Meetup')).toBeVisible();
    await meetup.check();
    await expect(teamField).toBeEnabled();
    await expect(page.getByText('Primero únete en Meetup')).toBeHidden();

    await page.reload();
    await expect(meetup).toBeChecked();
    await expect(teamField).toBeEnabled();
    await meetup.uncheck();
    await expect(teamField).toBeDisabled();
  });

  test('abrir Meetup en otra pestaña desbloquea el registro', async ({ page, context }) => {
    const meetup = page.getByRole('link', { name: /Abrir evento en Meetup/ });
    const url = 'https://www.meetup.com/aws-sbg-at-university-of-the-valle/events/317506559/';
    await context.route(url, (route) => route.fulfill({ body: 'Meetup' }));
    const [popup] = await Promise.all([page.waitForEvent('popup'), meetup.click()]);
    await expect(popup).toHaveURL(url);
    await expect(page.getByLabel('Nombre del equipo')).toBeEnabled();
    await page.reload();
    await expect(page.getByLabel('Nombre del equipo')).toBeEnabled();
  });

  test('muestra errores accesibles y enfoca el primer campo inválido', async ({ page }) => {
    await page.getByRole('checkbox', { name: 'Ya me uní al evento en Meetup' }).check();
    await page.getByRole('button', { name: 'Inscribir equipo' }).click();

    const teamField = page.getByLabel('Nombre del equipo');
    await expect(teamField).toBeFocused();
    await expect(teamField).toHaveAttribute('aria-invalid', 'true');
    await expect(teamField).toHaveAccessibleDescription('Escribe un nombre de equipo de 2 a 60 caracteres.');
    await expect(page.getByText('Escribe al menos dos palabras.')).toHaveCount(1);
    await expect(page.getByText('Escribe un correo válido.')).toHaveCount(1);
    await expect(page.getByText('Autoriza el tratamiento de datos para continuar.')).toBeVisible();
  });

  test('permite de 1 a 3 integrantes y no deja agregar un cuarto', async ({ page }) => {
    await page.getByRole('checkbox', { name: 'Ya me uní al evento en Meetup' }).check();
    const add = page.getByRole('button', { name: 'Agregar integrante' });
    const remove = page.getByRole('button', { name: 'Quitar último integrante' });
    await expect(page.getByRole('group', { name: /^Integrante/ })).toHaveCount(1);
    await expect(remove).toBeHidden();
    await add.click();
    await add.click();
    await expect(page.getByRole('group', { name: /^Integrante/ })).toHaveCount(3);
    await expect(add).toBeHidden();
    await remove.click();
    await expect(page.getByRole('group', { name: /^Integrante/ })).toHaveCount(2);
    await expect(add).toBeVisible();
  });

  test('envía un equipo de un solo integrante', async ({ page }) => {
    await page.route(endpoint, async (route) => {
      expect(route.request().postDataJSON().members).toEqual([members[0]]);
      await route.fulfill({ json: { ok: true }, headers: { 'access-control-allow-origin': '*' } });
    });
    await page.getByRole('checkbox', { name: 'Ya me uní al evento en Meetup' }).check();
    await fillTeam(page, 1);
    await page.getByRole('button', { name: 'Inscribir equipo' }).click();
    await expect(page.getByText(`¡El equipo «${team}» quedó inscrito!`)).toBeVisible();
  });

  test('detecta correos repetidos sin distinguir mayúsculas', async ({ page }) => {
    await page.getByRole('checkbox', { name: 'Ya me uní al evento en Meetup' }).check();
    await fillTeam(page);
    const email = page.getByRole('group', { name: /^Integrante 2/ }).getByLabel('Correo');
    await email.fill('ANA@example.com');
    await page.getByRole('button', { name: 'Inscribir equipo' }).click();
    await expect(email).toBeFocused();
    await expect(email).toHaveAccessibleDescription('Este correo ya se indicó para otro integrante.');
  });

  test('envía el equipo y limpia el formulario después de la confirmación', async ({ page }) => {
    await page.route(endpoint, async (route) => {
      const request = route.request();
      expect(request.method()).toBe('POST');
      expect(request.headers()['content-type']).toBe('text/plain;charset=utf-8');
      expect(request.postDataJSON()).toEqual({
        team, members, meetup: true, consent: true,
        submittedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        userAgent: expect.any(String),
      });
      await expect(page.getByRole('button', { name: 'Enviando…' })).toBeDisabled();
      await route.fulfill({ json: { ok: true }, headers: { 'access-control-allow-origin': '*' } });
    });
    await page.getByRole('checkbox', { name: 'Ya me uní al evento en Meetup' }).check();
    await fillTeam(page);
    await page.getByRole('button', { name: 'Inscribir equipo' }).click();
    await expect(page.getByText(`¡El equipo «${team}» quedó inscrito!`)).toBeVisible();
    await expect(page.getByLabel('Nombre del equipo')).toHaveValue('');
    await expect(page.getByRole('checkbox', { name: /Autorizo a AWS SBG Univalle/ })).not.toBeChecked();
  });

  test('muestra el error del servidor y permite reintentar con los mismos datos', async ({ page }) => {
    const error = 'Ya hay un equipo inscrito con ese nombre.';
    let attempts = 0;
    await page.route(endpoint, (route) => route.fulfill({
      json: ++attempts === 1 ? { ok: false, error } : { ok: true },
      headers: { 'access-control-allow-origin': '*' },
    }));
    await page.getByRole('checkbox', { name: 'Ya me uní al evento en Meetup' }).check();
    await fillTeam(page);
    const submit = page.getByRole('button', { name: 'Inscribir equipo' });
    await submit.click();

    await expect(page.getByRole('alert')).toContainText(error);
    await expect(page.getByLabel('Nombre del equipo')).toHaveValue(team);
    await submit.click();
    await expect(page.getByText(`¡El equipo «${team}» quedó inscrito!`)).toBeVisible();
  });
});
