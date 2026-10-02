import assert from 'node:assert';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { OrderChart } from '../src/components/demo/OrderChart.tsx';

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
    assert(html.includes('#3b82f6'), 'Should use accent color #3b82f6 for goods');
    assert(html.includes('#60a5fa'), 'Should use status blue #60a5fa for commission');
    assert(html.includes('#94a3b8'), 'Should use neutral status #94a3b8 for shipping');

    // Check no NaN in SVG attributes
    assert(!html.includes('NaN'), 'Rendered SVG must not contain NaN');

    console.log('✓ Test 1: Standard cost breakdown renders SVG correctly with a11y attributes');
  }

  // Test 2: Zero values / zero total renders placeholder without NaN or errors
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

    console.log('✓ Test 2: Zero state renders cleanly without NaN');
  }

  // Test 3: Segment calculation math and dash offset ordering
  {
    const html = renderToStaticMarkup(
      React.createElement(OrderChart, {
        goodsCostRub: 5000,
        commissionRub: 2500,
        shippingRub: 2500,
        totalRub: 10000,
      })
    );

    // 50% goods, 25% commission, 25% shipping
    assert(html.includes('(50%)'), 'Goods should be 50%');
    assert(html.includes('(25%)'), 'Commission should be 25%');

    // Circumference ~ 289.03
    // Goods length ~ 144.51
    assert(html.includes('stroke-dasharray="144.'), 'First segment should cover ~50% of circumference');
    assert(html.includes('stroke-dashoffset="0"'), 'First segment starts at offset 0');
    assert(html.includes('stroke-dashoffset="-144.'), 'Second segment offset matches first segment length');

    console.log('✓ Test 3: Accurate proportional stroke-dasharray and offsets');
  }

  // Test 4: Reduced motion and transition utility check
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
      'SVG circles should include motion-reduce:transition-none for a11y'
    );
    assert(
      html.includes('custom-chart-class'),
      'Component should pass custom className to root container'
    );

    console.log('✓ Test 4: Reduced motion class and custom className support verified');
  }

  console.log('--- All OrderChart Unit & Smoke Tests Passed Successfully ---');
}

runTests();
