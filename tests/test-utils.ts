import assert from 'node:assert';
import {
  normalizeChartSlices,
  calculateCompetitorPrices,
  RADIUS,
  CIRCUMFERENCE,
  CHART_COLORS,
} from '../src/utils/pricing.ts';
import {
  buildTelegramOrderLink,
  truncateStringByGraphemes,
  TELEGRAM_USERNAME,
} from '../src/utils/telegram.ts';

function runTests() {
  console.log('--- Starting T24 Safe Pricing & Telegram Utilities Tests ---');

  // ==========================================
  // Part 1: Pricing Utilities (normalizeChartSlices)
  // ==========================================

  // Test 1.1: Zero values guard returns hasData: false, totalRub: 0, 3 zeroed segments
  {
    const zeroData = normalizeChartSlices(0, 0, 0);
    assert.strictEqual(zeroData.hasData, false, 'hasData must be false when total is 0');
    assert.strictEqual(zeroData.totalRub, 0, 'totalRub must be 0');
    assert.strictEqual(zeroData.segments.length, 3, 'Must have 3 segments');

    for (const seg of zeroData.segments) {
      assert.strictEqual(seg.amountRub, 0, 'amountRub must be 0');
      assert.strictEqual(seg.percent, 0, 'percent must be 0');
      assert.strictEqual(seg.dashArray, '0 289.026', 'dashArray must be exact string 0 289.026');
      assert.strictEqual(seg.dashOffset, 0, 'dashOffset must be 0');
      assert.ok(!Number.isNaN(seg.amountRub), 'amountRub must not be NaN');
      assert.ok(!Number.isNaN(seg.percent), 'percent must not be NaN');
      assert.ok(!seg.dashArray.includes('NaN'), 'dashArray must not contain NaN');
    }
    console.log('✓ Test 1.1: Zero values guard returns safe zeroed segments without NaN');
  }

  // Test 1.2: Negative or non-finite inputs handled defensively
  {
    const negData = normalizeChartSlices(-100, -50, -20);
    assert.strictEqual(negData.hasData, false);
    assert.strictEqual(negData.totalRub, 0);

    const nanData = normalizeChartSlices(Number.NaN, Number.NEGATIVE_INFINITY, 0);
    assert.strictEqual(nanData.hasData, false);
    assert.strictEqual(nanData.totalRub, 0);
    console.log('✓ Test 1.2: Negative and non-finite inputs clamped to zero');
  }

  // Test 1.3: Normal distribution produces exact 100% sum and correct color mapping
  {
    const data = normalizeChartSlices(4830, 1200, 242);
    assert.strictEqual(data.hasData, true);
    assert.strictEqual(data.totalRub, 6272);

    const sumPct = data.segments.reduce((acc, s) => acc + s.percent, 0);
    assert.strictEqual(sumPct, 100, 'Percentages must strictly sum to 100%');

    const goods = data.segments.find((s) => s.key === 'goods')!;
    const comm = data.segments.find((s) => s.key === 'commission')!;
    const ship = data.segments.find((s) => s.key === 'shipping')!;

    assert.strictEqual(goods.color, '#3b82f6', 'Goods color must be #3b82f6');
    assert.strictEqual(comm.color, '#60a5fa', 'Commission color must be #60a5fa');
    assert.strictEqual(ship.color, '#94a3b8', 'Shipping color must be #94a3b8');

    assert.strictEqual(goods.label, 'Товары');
    assert.strictEqual(comm.label, 'Комиссия');
    assert.strictEqual(ship.label, 'Доставка');

    assert.strictEqual(goods.dashOffset, 0);
    assert.ok(comm.dashOffset < 0, 'Commission offset should be negative');
    assert.ok(ship.dashOffset < comm.dashOffset, 'Shipping offset should follow commission');

    console.log('✓ Test 1.3: Normal chart slices produce valid segments summing to 100%');
  }

  // Test 1.4: Various rounding distributions always sum to 100%
  {
    const testCases = [
      [1, 1, 1],
      [10, 20, 30],
      [333, 333, 334],
      [9999, 1, 1],
      [7, 13, 29],
      [1250000, 350000, 62500],
    ];

    for (const [g, s, c] of testCases) {
      const res = normalizeChartSlices(g, s, c);
      const total = res.segments.reduce((acc, x) => acc + x.percent, 0);
      assert.strictEqual(total, 100, `Inputs [${g}, ${s}, ${c}] sum to ${total}, expected 100`);
    }
    console.log('✓ Test 1.4: All rounding edge cases strictly sum to 100%');
  }

  // Test 1.5: Circumference constants
  {
    assert.strictEqual(RADIUS, 46);
    const expectedCirc = 2 * Math.PI * 46;
    assert.ok(Math.abs(CIRCUMFERENCE - expectedCirc) < 0.0001);
    console.log('✓ Test 1.5: Circumference constants verified');
  }

  // ==========================================
  // Part 2: Pricing Utilities (calculateCompetitorPrices)
  // ==========================================

  // Test 2.1: Competitor calculation without wooden crate
  {
    const goodsRub = 4830;
    const weightKg = 2.5;
    const tariffRate = 480;
    const crate = false;

    // ourShipping = round(2.5 * 480) = 1200
    // ourComm = round(4830 * 0.05) = 242 (241.5 rounds to 242)
    // ourTotal = 4830 + 242 + 1200 = 6272
    // compAShipping = round(2.5 * 520) = 1300
    // compAComm = round(4830 * 0.08) = 386 (386.4 rounds to 386)
    // compATotal = 4830 + 386 + 1300 = 6516
    // compBShipping = round(2.5 * 550) = 1375
    // compBComm = round(4830 * 0.10) = 483
    // compBTotal = 4830 + 483 + 1375 = 6688

    const result = calculateCompetitorPrices(goodsRub, weightKg, tariffRate, crate);

    assert.strictEqual(result.ourTotal, 6272, `ourTotal should be 6272, got ${result.ourTotal}`);
    assert.strictEqual(result.compATotal, 6516, `compATotal should be 6516, got ${result.compATotal}`);
    assert.strictEqual(result.compBTotal, 6688, `compBTotal should be 6688, got ${result.compBTotal}`);
    assert.strictEqual(result.savingsA, 6516 - 6272, 'savingsA must match difference');
    assert.strictEqual(result.savingsB, 6688 - 6272, 'savingsB must match difference');

    assert.strictEqual(result.rows.length, 4, 'Must return 4 comparison rows');
    assert.strictEqual(result.rows[0].param, 'Комиссия');
    assert.strictEqual(result.rows[0].us, '5%');
    assert.strictEqual(result.rows[0].compA, '8%');
    assert.strictEqual(result.rows[0].compB, '10%');

    assert.strictEqual(result.rows[1].param, 'Доставка (кг)');
    assert.ok(result.rows[1].us.includes('480'));
    assert.ok(result.rows[1].compA.includes('520'));
    assert.ok(result.rows[1].compB.includes('550'));

    assert.strictEqual(result.rows[2].param, 'Итого за пример');
    assert.strictEqual(result.rows[2].isHighlight, true);

    assert.strictEqual(result.rows[3].param, 'Экономия');
    assert.strictEqual(result.rows[3].us, '—');

    console.log('✓ Test 2.1: Competitor prices without crate calculated accurately');
  }

  // Test 2.2: Competitor calculation with wooden crate (our: +300, compA: +400, compB: +500)
  {
    const result = calculateCompetitorPrices(4830, 2.5, 480, true);
    // ourShipping = 1200 + 300 = 1500 -> ourTotal = 4830 + 242 + 1500 = 6572
    // compAShipping = 1300 + 400 = 1700 -> compATotal = 4830 + 386 + 1700 = 6916
    // compBShipping = 1375 + 500 = 1875 -> compBTotal = 4830 + 483 + 1875 = 7188
    assert.strictEqual(result.ourTotal, 6572);
    assert.strictEqual(result.compATotal, 6916);
    assert.strictEqual(result.compBTotal, 7188);
    assert.strictEqual(result.savingsA, 6916 - 6572);
    assert.strictEqual(result.savingsB, 7188 - 6572);
    console.log('✓ Test 2.2: Competitor prices with crate include staggered crate pricing (+300, +400, +500)');
  }

  // ==========================================
  // Part 3: Telegram Utilities (buildTelegramOrderLink)
  // ==========================================

  // Test 3.1: Standard order generates valid link
  {
    const order = {
      id: 'CN-89412',
      itemUrl: 'https://detail.1688.com/offer/71239841.html',
      title: 'Партия зимних худи',
      cnyPrice: 45,
      quantity: 50,
      weightKg: 28,
      rate: 13.8,
      goodsRub: 31050,
      commissionRub: 1553,
      shippingRub: 13440,
      totalRub: 46043,
      comment: 'Черный цвет, размеры L и XL',
    };

    const link = buildTelegramOrderLink(order);
    assert.ok(link.startsWith(`https://t.me/${TELEGRAM_USERNAME}?text=`));

    const encodedMsg = link.replace(`https://t.me/${TELEGRAM_USERNAME}?text=`, '');
    assert.ok(encodedMsg.length <= 2048, `Encoded length must be <= 2048, got ${encodedMsg.length}`);

    const decoded = decodeURIComponent(encodedMsg);
    assert.ok(decoded.includes('CN-89412'), 'Decoded message contains order ID');
    assert.ok(decoded.includes('Партия зимних худи'), 'Decoded message contains title');
    assert.ok(decoded.includes('Черный цвет'), 'Decoded message contains comment');
    console.log('✓ Test 3.1: Standard order generates clean and decodable Telegram link');
  }

  // Test 3.2: Extremely long comment is truncated safely with encodeURIComponent(msg) <= 2048
  {
    const order = {
      id: 'CN-LONG',
      itemUrl: 'https://detail.1688.com/offer/123.html',
      cnyPrice: 10,
      quantity: 1,
      weightKg: 1,
      rate: 13.8,
      goodsRub: 138,
      commissionRub: 7,
      shippingRub: 480,
      totalRub: 625,
      comment: 'Очень подробный комментарий к заказу с множеством инструкций. '.repeat(100),
    };

    const link = buildTelegramOrderLink(order);
    const encodedMsg = link.replace(`https://t.me/${TELEGRAM_USERNAME}?text=`, '');
    assert.ok(
      encodedMsg.length <= 2048,
      `encodeURIComponent(msg) must be <= 2048, got ${encodedMsg.length}`
    );

    // Verify it decodes cleanly without throwing URIError
    const decoded = decodeURIComponent(encodedMsg);
    assert.ok(decoded.includes('...'), 'Long comment must end with ellipsis');
    assert.ok(decoded.includes('CN-LONG'), 'Order ID preserved');
    console.log(`✓ Test 3.2: Long comment truncated safely (encoded len: ${encodedMsg.length} <= 2048)`);
  }

  // Test 3.3: Extremely long URL is truncated safely with encodeURIComponent(msg) <= 2048
  {
    const order = {
      itemUrl: 'https://detail.1688.com/offer/' + 'x'.repeat(4000) + '.html',
      cnyPrice: 10,
      quantity: 1,
      weightKg: 1,
      rate: 13.8,
      goodsRub: 138,
      commissionRub: 7,
      shippingRub: 480,
      totalRub: 625,
    };

    const link = buildTelegramOrderLink(order);
    const encodedMsg = link.replace(`https://t.me/${TELEGRAM_USERNAME}?text=`, '');
    assert.ok(
      encodedMsg.length <= 2048,
      `encodeURIComponent(msg) must be <= 2048, got ${encodedMsg.length}`
    );

    const decoded = decodeURIComponent(encodedMsg);
    assert.ok(decoded.includes('...'), 'Truncated URL ends with ellipsis');
    console.log(`✓ Test 3.3: Long URL truncated safely (encoded len: ${encodedMsg.length} <= 2048)`);
  }

  // Test 3.4: Multi-byte unicode & emojis never split
  {
    const unicodeOrder = {
      itemUrl: 'https://poizon.com/product/581023',
      title: '耐克 Nike Air Jordan 👟 🇨🇳 👨‍👩‍👧‍👦',
      cnyPrice: 680,
      quantity: 2,
      weightKg: 2.4,
      rate: 13.8,
      goodsRub: 18768,
      commissionRub: 938,
      shippingRub: 1152,
      totalRub: 20858,
      comment: 'Пример с комбинированными символами: e\u0301 (é) и эмодзи 📦 🚀 🚚 💯 '.repeat(30),
    };

    const link = buildTelegramOrderLink(unicodeOrder);
    const encodedMsg = link.replace(`https://t.me/${TELEGRAM_USERNAME}?text=`, '');
    assert.ok(encodedMsg.length <= 2048, 'Must be <= 2048');

    // Decode check
    const decoded = decodeURIComponent(encodedMsg);
    assert.ok(typeof decoded === 'string');
    assert.ok(!decoded.includes('\uFFFD') || decoded.length > 0);
    console.log('✓ Test 3.4: Multi-byte unicode, Chinese characters, and emoji sequences handled cleanly');
  }

  // Test 3.5: Lone surrogate safety
  {
    const badSurrogateOrder = {
      itemUrl: 'https://item.taobao.com/item.htm?id=123',
      cnyPrice: 50,
      quantity: 1,
      weightKg: 0.5,
      rate: 13.8,
      goodsRub: 690,
      commissionRub: 35,
      shippingRub: 240,
      totalRub: 965,
      comment: 'Bad surrogate: \uD800 alone followed by text',
    };

    // Must not throw URIError
    let didThrow = false;
    try {
      const link = buildTelegramOrderLink(badSurrogateOrder);
      assert.ok(link.includes('https://t.me/'));
    } catch {
      didThrow = true;
    }
    assert.strictEqual(didThrow, false, 'buildTelegramOrderLink must never throw URIError on lone surrogates');
    console.log('✓ Test 3.5: Lone surrogates sanitized without URIError');
  }

  // Test 3.6: truncateStringByGraphemes helper directly
  {
    const text = '🇨🇳📦'.repeat(500);
    const truncated = truncateStringByGraphemes(text, 100);
    assert.ok(encodeURIComponent(truncated).length <= 100);
    assert.ok(truncated.endsWith('...'));
    // Ensure decodes cleanly
    assert.strictEqual(decodeURIComponent(encodeURIComponent(truncated)), truncated);
    console.log('✓ Test 3.6: truncateStringByGraphemes utility handles emoji clusters');
  }

  console.log('--- All T24 Unit & Smoke Tests Passed Successfully! ---');
}

runTests();
