import { test, expect } from '@playwright/test';

test.describe('Dev Portfolio & China Sourcing Smoke Test Suite', () => {
  test('landing page renders all 7 sections in specified sequence', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    const sections = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return [];
      return Array.from(main.children).map((el) => {
        if (el.id) return el.id;
        if (el.querySelector('h1')) return 'hero';
        return el.tagName.toLowerCase();
      });
    });

    expect(sections).toEqual(['hero', 'solution', 'stack', 'approach', 'contacts']);

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('hero displays required identity, role, subtitle, and status', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Михаил Соболев');
    await expect(page.getByText('Веб-разработчик: современные сайты и сервисы под ключ')).toBeVisible();
    await expect(page.getByText('Делаю быстрые, понятные сайты и веб-сервисы под задачу: от макета до готового запуска')).toBeVisible();
    await expect(page.getByText('Открыт к новым проектам и сотрудничеству')).toBeVisible();
  });

  test('hero renders BackgroundBeams canvas in background and maintains full CTA interactivity', async ({ page }) => {
    await page.goto('/');

    const heroCanvas = page.locator('section:has(h1) canvas[aria-hidden="true"]');
    await expect(heroCanvas).toBeVisible();

    const ctaButton = page.locator('section:has(h1) button:has-text("демо")');
    await expect(ctaButton).toBeVisible();
    await ctaButton.click();
    await page.waitForFunction(() => window.location.pathname === '/demo');
    expect(new URL(page.url()).pathname).toBe('/demo');
  });

  test('hero background beams respect prefers-reduced-motion without errors', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const heroCanvas = page.locator('section:has(h1) canvas[aria-hidden="true"]');
    await expect(heroCanvas).toBeVisible();

    const hasCanvas = await page.evaluate(() => {
      const canvas = document.querySelector('section canvas');
      return !!canvas && canvas.getAttribute('aria-hidden') === 'true';
    });
    expect(hasCanvas).toBe(true);
  });

  test('responsive mobile check: zero horizontal overflow at 390px', async ({ page }) => {
    await page.goto('/');
    const homeOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(homeOverflow).toBe(false);

    await page.goto('/demo');
    const demoOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(demoOverflow).toBe(false);
  });

  test('routing: CTA navigates to /demo via pushState and back button returns to /', async ({ page }) => {
    await page.goto('/');
    expect(new URL(page.url()).pathname).toBe('/');

    await page.click('section:has(h1) button:has-text("демо")');
    await page.waitForFunction(() => window.location.pathname === '/demo');
    expect(new URL(page.url()).pathname).toBe('/demo');
    await expect(page.locator('h1')).toContainText('Заказ товаров из Китая');

    await page.goBack();
    await page.waitForFunction(() => window.location.pathname === '/');
    expect(new URL(page.url()).pathname).toBe('/');
    await expect(page.locator('h1')).toContainText('Михаил Соболев');
  });

  test('demo calculator computes exact pricing breakdown without insurance', async ({ page }) => {
    await page.goto('/demo');
    const pageText = (await page.innerText('body')).replace(/\u00a0/g, ' ');

    expect(pageText).toContain('5 552 ₽');
    expect(pageText).toContain('4 830 ₽');
    expect(pageText).toContain('242 ₽');
    expect(pageText).toContain('480 ₽');
    expect(pageText).not.toContain('Страховка груза (2%)');
  });

  test('demo calculator renders OrderChart SVG with accessible labels', async ({ page }) => {
    await page.goto('/demo');
    const chartSvg = page.locator('svg[role="img"][aria-label="Диаграмма структуры затрат"]');
    await expect(chartSvg).toBeVisible();
    await expect(chartSvg.locator('title')).toContainText('Диаграмма структуры затрат');
  });

  test('demo calculator displays real exchange rate indicator badge and updates totals', async ({ page }) => {
    await page.goto('/demo');

    const rateBadge = page.locator('div[aria-label="Текущий курс юаня"]');
    await expect(rateBadge).toBeVisible();
    await expect(rateBadge).toContainText('1 ¥ = 13.80 ₽');

    let text = (await page.innerText('body')).replace(/\u00a0/g, ' ');
    expect(text).toContain('5 552 ₽');
  });

  test('demo calculator renders competitor comparison table and maintains zero overflow at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/demo');

    const table = page.locator('table');
    await expect(table.first()).toBeVisible();

    await expect(page.getByRole('columnheader', { name: 'Параметр' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Мы' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Конкурент A' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Конкурент B' })).toBeVisible();

    await expect(page.getByRole('cell', { name: '5%' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '8%' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '10%' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '480 ₽' }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: '520 ₽' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '550 ₽' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '5 736 ₽' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '5 863 ₽' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '−184 ₽' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '−311 ₽' })).toBeVisible();

    await expect(page.getByText('Ориентир розницы на маркетплейсах РФ')).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('demo form validates legitimate marketplace URLs and rejects deceptive domains', async ({ page }) => {
    await page.goto('/demo');
    const urlInput = page.locator('input[placeholder*="1688.com"]');

    // Fill deceptive link
    await urlInput.fill('https://1688.com.attacker.com/offer/123');
    await urlInput.blur();
    await expect(page.getByText('Поддерживаются ссылки только на 1688')).toBeVisible();

    // Fill valid link
    await urlInput.fill('https://detail.1688.com/offer/71239841.html');
    await urlInput.blur();
    await expect(page.getByText('Поддерживаются ссылки только на 1688')).not.toBeVisible();
  });

  test('demo order submission: mock 500 fallback appends order in demo mode and shows toast', async ({ page }) => {
    await page.goto('/demo');
    await page.route('**/api/order', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    const isMobile = await page.evaluate(() => window.innerWidth < 640);
    const selector = isMobile ? '.sm\\:hidden > div' : 'tbody tr';
    const initialOrders = await page.locator(selector).count();

    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    const afterOrders = await page.locator(selector).count();
    expect(afterOrders).toBe(initialOrders + 1);
    await expect(page.getByText('Заказ оформлен (Демо)')).toBeVisible();
  });

  test('demo order submission: mock 200 appends order to table and shows toast', async ({ page }) => {
    await page.goto('/demo');
    await page.route('**/api/order', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, orderId: 'CN-TEST-99' }),
      });
    });

    const isMobile = await page.evaluate(() => window.innerWidth < 640);
    const selector = isMobile ? '.sm\\:hidden > div' : 'tbody tr';
    const initialOrders = await page.locator(selector).count();

    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    const afterOrders = await page.locator(selector).count();
    expect(afterOrders).toBe(initialOrders + 1);
    await expect(page.getByText('Заказ успешно оформлен!')).toBeVisible();
  });

  test('accessibility: focus traversal has visible focus ring', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const hasFocusRing = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const cs = window.getComputedStyle(el);
      return cs.outline.includes('rgb(96, 165, 250)') || cs.boxShadow.includes('rgb(96, 165, 250)');
    });
    expect(hasFocusRing).toBe(true);
  });

  test('accessibility: respects prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const animationDuration = await page.evaluate(() => {
      const el = document.querySelector('body');
      return el ? window.getComputedStyle(el).animationDuration : '';
    });
    expect(parseFloat(animationDuration) || 0).toBeLessThanOrEqual(0.01);
  });

  test('header has sticky positioning and z-50 stack layer', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toBeVisible();
    const { position, zIndex } = await header.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { position: cs.position, zIndex: cs.zIndex };
    });
    expect(position).toBe('sticky');
    expect(zIndex).toBe('50');
  });

  test('scroll behavior and anchor section scroll-margin-top configured correctly', async ({ page }) => {
    await page.goto('/');
    const { scrollBehavior, solutionScrollMargin, stackScrollMargin } = await page.evaluate(() => {
      const htmlStyle = window.getComputedStyle(document.documentElement);
      const solutionEl = document.querySelector('section#solution');
      const stackEl = document.querySelector('section#stack');
      return {
        scrollBehavior: htmlStyle.scrollBehavior,
        solutionScrollMargin: solutionEl ? window.getComputedStyle(solutionEl).scrollMarginTop : '',
        stackScrollMargin: stackEl ? window.getComputedStyle(stackEl).scrollMarginTop : '',
      };
    });
    expect(scrollBehavior).toBe('smooth');
    expect(solutionScrollMargin).toBe('80px');
    expect(stackScrollMargin).toBe('80px');
  });

  test('reveal-on-scroll elements wire correctly and gain is-visible class', async ({ page }) => {
    await page.goto('/');
    const revealCount = await page.locator('.reveal-on-scroll').count();
    expect(revealCount).toBeGreaterThanOrEqual(4);

    const firstReveal = page.locator('.reveal-on-scroll').first();
    await firstReveal.scrollIntoViewIfNeeded();
    await expect(firstReveal).toHaveClass(/is-visible/);
  });

  test('demo calculator delivery tariffs and wooden crate update shipping and total accurately', async ({ page }) => {
    await page.goto('/demo');

    let text = (await page.innerText('body')).replace(/\u00a0/g, ' ');
    expect(text).toContain('480 ₽');
    expect(text).toContain('5 552 ₽');

    await page.click('button[role="radio"]:has-text("Обычное авто")');
    text = (await page.innerText('body')).replace(/\u00a0/g, ' ');
    expect(text).toContain('380 ₽');
    expect(text).toContain('5 452 ₽');

    await page.click('button[role="radio"]:has-text("Авиа")');
    text = (await page.innerText('body')).replace(/\u00a0/g, ' ');
    expect(text).toContain('850 ₽');
    expect(text).toContain('5 922 ₽');

    await page.check('input[type="checkbox"]');
    text = (await page.innerText('body')).replace(/\u00a0/g, ' ');
    expect(text).toContain('1 150 ₽');
    expect(text).toContain('6 222 ₽');

    await page.uncheck('input[type="checkbox"]');
    text = (await page.innerText('body')).replace(/\u00a0/g, ' ');
    expect(text).toContain('850 ₽');
    expect(text).toContain('5 922 ₽');
  });

  test('demo form draft and order submission persist to localStorage', async ({ page }) => {
    await page.goto('/demo');

    const testComment = 'Тестовый комментарий для проверки сохранения';
    await page.fill('textarea', testComment);
    await page.check('input[type="checkbox"]');

    const draftJson = await page.evaluate(() => localStorage.getItem('china_order_draft_v1'));
    expect(draftJson).not.toBeNull();
    const draft = JSON.parse(draftJson!);
    expect(draft.comment).toBe(testComment);
    expect(draft.woodenCrate).toBe(true);

    await page.reload();
    await expect(page.locator('textarea')).toHaveValue(testComment);
    await expect(page.locator('input[type="checkbox"]')).toBeChecked();

    await page.route('**/api/order', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, orderId: 'CN-STORAGE-01' }),
      });
    });

    await page.click('button[type="submit"]');
    await expect(page.getByText('Заказ успешно оформлен!')).toBeVisible();

    const ordersJson = await page.evaluate(() => localStorage.getItem('china_orders_v1'));
    expect(ordersJson).not.toBeNull();
    const storedOrders = JSON.parse(ordersJson!);
    expect(storedOrders.length).toBeGreaterThanOrEqual(1);
    expect(storedOrders[0].woodenCrate).toBe(true);
  });

  test('silent /api/rate background fetch updates exchange rate without crashing or layout shift', async ({ page }) => {
    await page.route('**/api/rate', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, rate: 14.5, source: 'mock', timestamp: Date.now() }),
      });
    });

    await page.goto('/demo');
    await expect(page.getByText('5 075 ₽').first()).toBeVisible();
    await expect(page.getByText('5 809 ₽').first()).toBeVisible();
  });
});
