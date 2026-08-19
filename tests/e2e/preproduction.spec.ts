import { expect, type Page, test } from '@playwright/test';

const ROUTES = [
  '/',
  '/venta-bicicletas-miami-platja/',
  '/taller-bicicletas-miami-platja/',
  '/alquiler-bicicletas-miami-platja/',
  '/contacto/',
] as const;

const MOBILE_LINKS = [
  { name: 'Inicio', path: '/', hash: '#inicio' },
  { name: 'Venta', path: '/venta-bicicletas-miami-platja/' },
  { name: 'Taller', path: '/taller-bicicletas-miami-platja/' },
  { name: 'Alquiler', path: '/alquiler-bicicletas-miami-platja/' },
  { name: 'Contacto', path: '/contacto/' },
] as const;

const expectedSitemapUrls = [
  'https://eolobikes.com/',
  'https://eolobikes.com/venta-bicicletas-miami-platja/',
  'https://eolobikes.com/taller-bicicletas-miami-platja/',
  'https://eolobikes.com/alquiler-bicicletas-miami-platja/',
  'https://eolobikes.com/contacto/',
] as const;

const normalizePath = (path: string) =>
  path === '/' ? '/' : `${path.replace(/\/$/, '')}/`;

const criticalConsoleMessages = (messages: string[]) =>
  messages.filter(
    (message) =>
      !/Failed to load resource: net::ERR_BLOCKED_BY_CLIENT/i.test(message),
  );

const collectCriticalBrowserErrors = (page: Page) => {
  const messages: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      messages.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    messages.push(error.message);
  });

  return messages;
};

const expectNoHorizontalScroll = async (page: Page) => {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    return Math.max(root.scrollWidth, body.scrollWidth) - root.clientWidth;
  });

  expect(overflow, 'horizontal overflow in CSS pixels').toBeLessThanOrEqual(1);
};

const expectMobileMenuOpen = async (page: Page) => {
  const toggle = page.getByRole('button', { name: /cerrar men[uú]/i });
  const menu = page.locator('[data-mobile-menu]');

  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();

  await expect
    .poll(
      () => menu.evaluate((element) => element.getBoundingClientRect().height),
      { message: 'open menu reaches a real rendered height' },
    )
    .toBeGreaterThan(40);

  const state = await menu.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      ariaHidden: element.getAttribute('aria-hidden'),
      height: element.getBoundingClientRect().height,
      hidden: element.hidden,
      inert: element.hasAttribute('inert'),
      opacity: Number.parseFloat(style.opacity),
      pointerEvents: style.pointerEvents,
      scrollHeight: element.scrollHeight,
    };
  });

  expect(state.hidden, 'open menu hidden attribute').toBe(false);
  expect(state.inert, 'open menu inert attribute').toBe(false);
  expect(state.ariaHidden, 'open menu aria-hidden').toBe('false');
  expect(state.height, 'open menu rendered height').toBeGreaterThan(40);
  expect(state.scrollHeight, 'open menu scrollHeight').toBeGreaterThan(40);
  expect(state.opacity, 'open menu opacity').toBeGreaterThan(0.95);
  expect(state.pointerEvents, 'open menu pointer-events').toBe('auto');
};

const expectMobileMenuClosed = async (page: Page) => {
  const toggle = page.getByRole('button', { name: /abrir men[uú]/i });
  const menu = page.locator('[data-mobile-menu]');

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toHaveAttribute('aria-hidden', 'true');

  await expect
    .poll(
      () =>
        menu.evaluate((element) => ({
          hidden: element.hidden,
          inert: element.hasAttribute('inert'),
          pointerEvents: window.getComputedStyle(element).pointerEvents,
        })),
      { message: 'closed menu eventually hidden and inert' },
    )
    .toEqual({ hidden: true, inert: true, pointerEvents: 'none' });

  const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
  expect(bodyOverflow, 'body overflow after menu close').toBe('');
};

const openMobileMenu = async (page: Page) => {
  const toggle = page.getByRole('button', { name: /abrir men[uú]/i });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expectMobileMenuOpen(page);
};

const expectHeroEssentialsVisible = async (page: Page) => {
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toBeVisible();

  const ctas = page.locator('#hero-buttons a, [data-hero-buttons] a');
  expect(await ctas.count(), 'hero CTA count').toBeGreaterThan(0);
  await expect(ctas.first()).toBeVisible();

  const invisibleCriticalItems = await page.evaluate(() => {
    const selectors = [
      'h1',
      '#hero-title',
      '#hero-badge',
      '#hero-subtitle',
      '#hero-buttons',
      '[data-hero-title]',
      '[data-hero-subtitle]',
      '[data-hero-buttons]',
      '[data-hero-reveal]',
    ];
    const seen = new Set<Element>();

    return selectors
      .flatMap((selector) => Array.from(document.querySelectorAll<HTMLElement>(selector)))
      .filter((element) => {
        if (seen.has(element)) return false;
        seen.add(element);
        return !element.closest('[aria-hidden="true"]');
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const inViewport =
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom >= 0 &&
          rect.top <= window.innerHeight;
        const hidden =
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          Number.parseFloat(style.opacity) < 0.05;

        if (!inViewport || !hidden) return null;

        return {
          selector:
            element.id ||
            Array.from(element.attributes)
              .map((attribute) => attribute.name)
              .filter((name) => name.startsWith('data-'))
              .join(',') ||
            element.tagName.toLowerCase(),
          opacity: style.opacity,
          display: style.display,
          visibility: style.visibility,
        };
      })
      .filter(Boolean);
  });

  expect(invisibleCriticalItems, 'critical hero/reveal elements invisible').toEqual([]);
};

test.describe('EOLO preproduction QA', () => {
  test('mobile menu supports real clicks, navigation, Escape and no horizontal scroll', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expectNoHorizontalScroll(page);

    await openMobileMenu(page);

    const mobileMenu = page.locator('[data-mobile-menu]');
    for (const link of MOBILE_LINKS) {
      const item = mobileMenu.getByRole('link', { name: link.name });
      await expect(item).toBeVisible();
      await item.click({ trial: true });
    }

    await page.keyboard.press('Escape');
    await expectMobileMenuClosed(page);
    await expectNoHorizontalScroll(page);

    for (const link of MOBILE_LINKS) {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await openMobileMenu(page);

      await mobileMenu.getByRole('link', { name: link.name }).click();

      await expect
        .poll(() => {
          const url = new URL(page.url());
          return {
            hash: url.hash,
            path: normalizePath(url.pathname),
          };
        })
        .toEqual({ path: link.path, hash: link.hash ?? '' });

      await expectMobileMenuClosed(page);
      await expectNoHorizontalScroll(page);
    }
  });

  for (const route of ROUTES) {
    test(`route ${route} loads with visible H1, visible HERO and no critical console errors`, async ({
      page,
    }) => {
      const browserErrors = collectCriticalBrowserErrors(page);
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

      expect(response?.status(), `${route} response status`).toBe(200);
      await page.waitForTimeout(2_500);

      await expectHeroEssentialsVisible(page);
      await expectNoHorizontalScroll(page);
      expect(criticalConsoleMessages(browserErrors), `${route} browser console/page errors`).toEqual(
        [],
      );
    });
  }

  test('HERO content remains visible without IntersectionObserver and with reduced motion', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'IntersectionObserver', {
        configurable: true,
        value: undefined,
      });
    });

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1_000);

    await expectHeroEssentialsVisible(page);
    await expectNoHorizontalScroll(page);
  });

  test('robots.txt and sitemap.xml expose the canonical production routes', async ({
    request,
  }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status(), 'robots.txt status').toBe(200);

    const robotsText = await robots.text();
    expect(robotsText).toContain('Sitemap: https://eolobikes.com/sitemap.xml');
    expect(robotsText).not.toContain('sitemap-index.xml');

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status(), 'sitemap.xml status').toBe(200);

    const sitemapText = await sitemap.text();
    for (const url of expectedSitemapUrls) {
      expect(sitemapText).toContain(`<loc>${url}</loc>`);
    }
  });
});
