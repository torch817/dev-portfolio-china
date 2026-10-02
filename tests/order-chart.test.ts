import assert from 'node:assert';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { OrderChart } from '../src/components/demo/OrderChart.tsx';
import { normalizeChartSlices, CIRCUMFERENCE } from '../src/utils/pricing.ts';

function runTests() {
  console.log('--- Starting OrderChart Unit & Smoke Tests ---');

  // Test 1: Standard cost breakdown renders SVG with role, aria-label, title, desc
  {
    const html = renderToStaticMarkup(
      React.createElement(OrderChart, {
        goodsCostRub: 4830,
        commissionRub: 242,
        shippingRub: 1200,
        totalRub: 6272,
      })
    );

    assert(html.includes('role="img"'), 'OrderChart should include role="img"');
    assert(
      html.includes('aria-label="Диаграмма структуры затрат"'),
      'OrderChart should include aria-label for chart'
    );
    assert(
      html.includes('viewBox="0 0 120 120"'),
      'OrderChart should have responsive viewBox="0 0 120 120"'
    );
    assert(html.includes('<title'), 'OrderChart should include <title> element');
    assert(html.includes('<desc'), 'OrderChart should include <desc> element');

    // Check legend items
    assert(html.includes('Товары'), 'Legend should include Товары');
    assert(html.includes('Комиссия'), 'Legend should include Комиссия');
    assert(html.includes('Доставка'), 'Legend should include Доставка');

    // Check colors
    assert(html.includes('#3b82f6'), 'Should use blue #3b82f6 for goods');
    assert(html.includes('#60a5fa'), 'Should use light blue #60a5fa for commission');
    assert(html.includes('#94a3b8'), 'Should use slate #94a3b8 for shipping');

    // Center display
    assert(html.includes('Итого'), 'Center should include label "Итого"');
    assert(html.includes('6 272 ₽') || html.includes('6 272 ₽'), 'Center should display formatted total');

    // Check no NaN in SVG attributes or text
    assert(!html.includes('NaN'), 'Rendered SVG must not contain NaN');

    console.log('✓ Test 1: Standard cost breakdown renders SVG correctly with accessible attributes');
  }

  // Test 2: Slices strictly sum to 100% across multiple input distributions
  {
    const testCases = [
      { goods: 4830, shipping: 1200, comm: 242 },
      { goods: 100, shipping: 100, comm: 100 },
      { goods: 333, shipping: 333, comm: 334 },
      { goods: 9999, shipping: 1, comm: 1 },
      { goods: 1, shipping: 1, comm: 9998 },
      { goods: 1250000, shipping: 350000, comm: 62500 },
      { goods: 7, shipping: 13, comm: 29 },
    ];

    for (const { goods, shipping, comm } of testCases) {
      const data = normalizeChartSlices(goods, shipping, comm);
      assert.strictEqual(data.hasData, true);
      const totalPercent = data.segments.reduce((acc, s) => acc + s.percent, 0);
      assert.strictEqual(
        totalPercent,
        100,
        `Slices for (${goods}, ${shipping}, ${comm}) must strictly sum to 100%, got ${totalPercent}`
      );
    }

    console.log('✓ Test 2: Slices strictly sum to 100% across all distribution test cases');
  }

  // Test 3: Zero values / zero total renders placeholder without NaN or errors
  {
    const html = renderToStaticMarkup(
      React.createElement(OrderChart, {
        goodsCostRub: 0,
        commissionRub: 0,
        shippingRub: 0,
        totalRub: 0,
      })
    );

    assert(html.includes('role="img"'), 'Zero-state should still have role="img"');
    assert(html.includes('0 ₽'), 'Zero-state should display 0 ₽ in total/legend');
    assert(
      html.includes('Диаграмма структуры затрат: нет данных'),
      'Zero-state should have descriptive title indicating no data'
    );
    assert(!html.includes('NaN'), 'Zero-state must not generate NaN values in dasharray or text');
    assert(
      html.includes('stroke-dasharray="0 289.'),
      'Zero-state circles should have stroke-dasharray="0 289..."'
    );

    console.log('✓ Test 3: Zero state renders cleanly without NaN');
  }

  // Test 4: Segmented Horizontal Distribution Bar renders without errors
  {
    const html = renderToStaticMarkup(
      React.createElement(OrderChart, {
        goodsCostRub: 4830,
        shippingRub: 1200,
        commissionRub: 242,
        totalRub: 6272,
      })
    );

    assert(html.includes('role="progressbar"'), 'Distribution bar should include role="progressbar"');
    assert(
      html.includes('aria-label="Распределение затрат"'),
      'Distribution bar should have aria-label'
    );
    assert(
      html.includes('h-3 w-full rounded-full overflow-hidden flex bg-surface border border-default'),
      'Distribution bar container should match expected style classes'
    );

    // 4830 / 6272 = 77% (>= 8% -> visible text)
    // 1200 / 6272 = 19% (>= 8% -> visible text)
    // 242 / 6272 = 4% (< 8% -> hidden text inside bar)
    assert(html.includes('>77%<'), 'Segment >= 8% should display internal text label');
    assert(html.includes('>19%<'), 'Segment >= 8% should display internal text label');
    assert(!html.includes('>4%<'), 'Segment < 8% should hide internal text label to prevent clipping');

    console.log('✓ Test 4: Horizontal distribution bar renders without errors and respects >= 8% threshold');
  }

  // Test 5: Segment calculation math and dash offset ordering
  {
    const html = renderToStaticMarkup(
      React.createElement(OrderChart, {
        goodsCostRub: 5000,
        shippingRub: 2500,
        commissionRub: 2500,
        totalRub: 10000,
      })
    );

    // 50% goods, 25% shipping, 25% commission
    assert(html.includes('(50%)'), 'Goods should be 50%');
    assert(html.includes('(25%)'), 'Shipping / commission should be 25%');

    // Circumference ~ 289.026...
    // Goods length ~ 144.51
    assert(html.includes('stroke-dasharray="144.'), 'First segment should cover ~50% of circumference');
    assert(html.includes('stroke-dashoffset="0"'), 'First segment starts at offset 0');
    assert(html.includes('stroke-dashoffset="-144.'), 'Second segment offset matches first segment length');
    assert(html.includes('stroke-dashoffset="-216.'), 'Third segment offset matches goods + shipping length');

    console.log('✓ Test 5: Accurate proportional stroke-dasharray and offsets ordering');
  }

  // Test 6: Reduced motion and transition utility check
  {
    const html = renderToStaticMarkup(
      React.createElement(OrderChart, {
        goodsCostRub: 1000,
        commissionRub: 100,
        shippingRub: 500,
        totalRub: 1600,
        className: 'custom-chart-class',
      })
    );

    assert(
      html.includes('motion-reduce:transition-none'),
      'SVG circles and bars should include motion-reduce:transition-none for a11y'
    );
    assert(
      html.includes('custom-chart-class'),
      'Component should pass custom className to root container'
    );

    console.log('✓ Test 6: Reduced motion class and custom className support verified');
  }

  console.log('--- All 6 OrderChart Unit & Smoke Tests Passed Successfully ---');
}

runTests();
