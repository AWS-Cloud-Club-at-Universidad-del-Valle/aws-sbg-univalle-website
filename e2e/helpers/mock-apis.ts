import type { Page, Route } from '@playwright/test';

function isoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export type MockEvent = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  modality: 'VIRTUAL' | 'PRESENCIAL' | 'HIBRIDO';
  eventType: 'CHARLA' | 'WORKSHOP' | 'HACKATHON';
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  location?: string;
  description?: string;
  registrationUrl?: string;
};

function buildCatalog(): MockEvent[] {
  const upcomingWorkshops: MockEvent[] = Array.from({ length: 13 }, (_, i) => ({
    id: `evt-workshop-${i + 1}`,
    title: `Workshop CDK ${i + 1}`,
    date: isoDate(i + 2),
    startTime: '10:00',
    endTime: '13:00',
    modality: 'PRESENCIAL',
    eventType: 'WORKSHOP',
    status: 'UPCOMING',
    location: 'Edificio E, Universidad del Valle',
    description: 'Sesión práctica de AWS CDK para estudiantes.',
    registrationUrl: 'https://www.meetup.com/aws-sbg-at-university-of-the-valley-cali/',
  }));

  return [
    {
      id: 'evt-charla-1',
      title: 'Charla Cloud Practitioner',
      date: isoDate(5),
      startTime: '16:00',
      endTime: '18:00',
      modality: 'VIRTUAL',
      eventType: 'CHARLA',
      status: 'UPCOMING',
      location: 'Google Meet',
      description: 'Orientación para la certificación AWS Cloud Practitioner.',
    },
    {
      id: 'evt-hackathon-past',
      title: 'Hackathon Cloud Challenge',
      date: isoDate(-10),
      startTime: '08:00',
      endTime: '18:00',
      modality: 'PRESENCIAL',
      eventType: 'HACKATHON',
      status: 'COMPLETED',
      location: 'Auditorio Principal',
      description: '48 horas construyendo soluciones con AWS.',
    },
    ...upcomingWorkshops,
  ];
}

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

function isEventsApi(url: URL): boolean {
  return (
    url.hostname === 'events.sbg.test' ||
    url.hostname.endsWith('execute-api.us-east-1.amazonaws.com')
  );
}

function eventsPath(url: URL): string {
  return url.pathname.replace(/^\/(prod|dev)/, '') || '/';
}

export async function mockBackendApis(page: Page): Promise<void> {
  const catalog = buildCatalog();

  await page.route((url) => isEventsApi(new URL(url)), async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = eventsPath(url);

    if (request.method() === 'POST' && path.includes('/community/proposals')) {
      await json(route, { message: 'created', id: 'prop-1', status: 'PENDING' }, 201);
      return;
    }

    const detailMatch = path.match(/^\/events\/([^/]+)\/?$/);
    if (request.method() === 'GET' && detailMatch) {
      const id = decodeURIComponent(detailMatch[1]);
      const event = catalog.find((item) => item.id === id);
      if (!event) {
        await json(route, { error: 'not_found', message: 'El evento no existe.' }, 404);
        return;
      }
      await json(route, event);
      return;
    }

    if (request.method() === 'GET' && /^\/events\/?$/.test(path)) {
      const type = url.searchParams.get('type');
      const modality = url.searchParams.get('modality');
      const items = catalog.filter((item) => {
        if (type && item.eventType !== type) return false;
        if (modality && item.modality !== modality) return false;
        return true;
      });
      await json(route, {
        items,
        pagination: {
          page: 1,
          limit: 100,
          total: items.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
      return;
    }

    await route.continue();
  });
}

export async function mockEventsApiFailure(page: Page): Promise<void> {
  await page.route((url) => isEventsApi(new URL(url)), async (route) => {
    const path = eventsPath(new URL(route.request().url()));
    if (route.request().method() === 'GET' && path.includes('/events')) {
      await route.abort('failed');
      return;
    }
    await route.continue();
  });
}

export const NAV_ITEMS = [
  { href: '/', label: 'Inicio' },
  { href: '/about', label: 'Nosotros' },
  { href: '/certificate', label: 'Certifícate' },
  { href: '/events', label: 'Eventos' },
  { href: '/resources', label: 'Recursos' },
  { href: '/participate', label: 'Participa' },
  { href: '/contact', label: 'Contacto' },
] as const;

export const CHALLENGE_SLUGS = [
  'portafolios-estudiantiles',
  'app-alta-demanda',
  'red-segura',
  'backend-tienda-online',
  'plataforma-datos-educativos',
  'security-incident',
  'cost-optimization',
  'architecture-challenge',
] as const;

export const RESOURCE_TITLES = [
  'AWS Skill Builder',
  'AWS Academy',
  'AWS Certification',
  'AWS Workshops',
  'AWS Builder Center',
] as const;

export const CORE_TEAM_NAMES = [
  'Juan Manuel Hoyos Contreras',
  'Sebastián Cifuentes Flórez',
  'Pablo Nicolás Marín González',
  'Aura María Peláez',
  'Miguel Ángel Sanclemente Mejía',
  'Jann Carlo Martinez',
] as const;
