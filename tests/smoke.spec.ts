import { test, expect } from '@playwright/test';

test.describe('Dev Portfolio & China Sourcing Smoke Test Suite', () => {
  test('landing page renders all 8 sections in specified sequence', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    const sections = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return [];
      return Array.from(main.children).map((el) => {
        if (el.id) return el.id;
        if (el.querySelector('h1')) return 'hero';
        if (el.textContent?.includes('B2B и e-commerce')) return 'proof';
        return el.tagName.toLowerCase();
      });
    });

    expect(sections).toEqual(['hero', 'proof', 'solution', 'stack', 'approach', 'contacts']);

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('hero displays required identity, role, subtitle, and status', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Михаил Соболев');
    await expect(page.getByText('Веб-разработчик: сайты и сервисы для приёма заказов')).toBeVisible();
    await expect(page.getByText('Делаю быстрые, понятные сайты под задачу: от макета до запуска')).toBeVisible();
    await expect(page.getByText('Открыт к B2B заказам и разработке сервисов')).toBeVisible();
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

    await page.click('button:has-text("Посмотреть демо")');
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

    expect(pageText).toContain('6 272 ₽');
    expect(pageText).toContain('4 830 ₽');
    expect(pageText).toContain('242 ₽');
    expect(pageText).toContain('1 200 ₽');
    expect(pageText).not.toContain('Страховка груза (2%)');
  });

  test('demo form validates legitimate marketplace URLs and rejects deceptive domains', async ({ page }) => {
    await page.goto('/demo');
    const urlInput = page.locator('input[placeholder*="1688.com"]');

    // Fill deceptive link
    await urlInput.fill('https://1688.com.attacker.com/offer/123');
    await expect(page.getByText('Поддерживаются ссылки только на 1688')).toBeVisible();

    // Fill valid link
    await urlInput.fill('https://detail.1688.com/offer/71239841.html');
    await expect(page.getByText('Поддерживаются ссылки только на 1688')).not.toBeVisible();
  });

  test('demo order submission: mock 500 does not append order to table', async ({ page }) => {
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
    expect(afterOrders).toBe(initialOrders);
    await expect(page.getByText('Ошибка сервиса')).toBeVisible();
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
});
