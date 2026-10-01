import assert from 'node:assert';
import healthHandler from '../api/health.ts';
import orderHandler from '../api/order.ts';

function createMockRes() {
  const res: any = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: null as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    setHeader(name: string, value: string) {
      this.headers[name] = value;
      return this;
    },
    json(data: any) {
      this.body = data;
      return this;
    },
  };
  return res;
}

function createMockReq(method: string, body?: any, headers?: Record<string, string>) {
  return {
    method,
    body,
    headers: headers || {},
  };
}

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

async function runTests() {
  console.log('--- Starting API Serverless Function Tests ---');

  // Test 1: GET /api/health returns 200 { ok: true, status: 'healthy' }
  {
    const req = createMockReq('GET');
    const res = createMockRes();
    await healthHandler(req, res);
    assert.strictEqual(res.statusCode, 200, 'GET /api/health should return 200');
    assert.strictEqual(res.body?.ok, true, 'GET /api/health should have ok: true');
    console.log('✓ Test 1: GET /api/health returns 200 { ok: true }');
  }

  // Test 2: POST /api/health returns 405 Method Not Allowed
  {
    const req = createMockReq('POST', { foo: 'bar' });
    const res = createMockRes();
    await healthHandler(req, res);
    assert.strictEqual(res.statusCode, 405, 'POST /api/health should return 405');
    assert.strictEqual(res.body?.error, 'Method Not Allowed');
    console.log('✓ Test 2: POST /api/health returns 405 Method Not Allowed');
  }

  // Test 3: GET /api/order returns 405 Method Not Allowed
  {
    const req = createMockReq('GET');
    const res = createMockRes();
    await orderHandler(req, res);
    assert.strictEqual(res.statusCode, 405, 'GET /api/order should return 405');
    console.log('✓ Test 3: GET /api/order returns 405 Method Not Allowed');
  }

  // Test 4: POST /api/order rejects empty or missing payload
  {
    const req = createMockReq('POST', null);
    const res = createMockRes();
    await orderHandler(req, res);
    assert.strictEqual(res.statusCode, 400, 'POST /api/order empty should return 400');
    console.log('✓ Test 4: POST /api/order empty payload returns 400');
  }

  // Test 5: POST /api/order rejects deceptive hosts
  {
    const deceptiveHosts = [
      'https://1688.com.attacker.com/item/1',
      'https://evil-taobao.com/item',
      'https://fake-poizon.com/prod',
      'https://1688.com:8080/offer/1',
      'javascript:alert(1)',
    ];

    for (const itemUrl of deceptiveHosts) {
      const req = createMockReq('POST', {
        itemUrl,
        cnyPrice: 50,
        quantity: 1,
        weightKg: 1,
      });
      const res = createMockRes();
      await orderHandler(req, res);
      assert.strictEqual(
        res.statusCode,
        400,
        `Deceptive host ${itemUrl} must be rejected with 400, got ${res.statusCode}`
      );
    }
    console.log('✓ Test 5: POST /api/order rejects deceptive host variations');
  }

  // Test 6: POST /api/order rejects invalid numbers (<= 0)
  {
    const req = createMockReq('POST', {
      itemUrl: 'https://detail.1688.com/offer/69410294.html',
      cnyPrice: -10,
      quantity: 0,
      weightKg: -2,
    });
    const res = createMockRes();
    await orderHandler(req, res);
    assert.strictEqual(res.statusCode, 400, 'Negative prices/qty must return 400');
    console.log('✓ Test 6: POST /api/order rejects invalid quantities and negative numbers');
  }

  // Test 7: POST /api/order rejects oversized payloads (> 10 KB) with 413
  {
    const largeComment = 'A'.repeat(12 * 1024); // 12 KB
    const req = createMockReq('POST', {
      itemUrl: 'https://detail.1688.com/offer/69410294.html',
      cnyPrice: 50,
      quantity: 1,
      weightKg: 1,
      comment: largeComment,
    });
    const res = createMockRes();
    await orderHandler(req, res);
    assert.strictEqual(res.statusCode, 413, 'Oversized payload must return 413 Payload Too Large');
    assert.ok(res.body?.error?.includes('Payload Too Large'));
    console.log('✓ Test 7: POST /api/order rejects oversized payload with 413');
  }

  // Test 8: POST /api/order handles valid order in demo mode (no secrets set) -> 200
  {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;

    const req = createMockReq('POST', {
      id: 'CN-12345',
      itemUrl: 'https://detail.1688.com/offer/69410294.html',
      cnyPrice: 35,
      quantity: 10,
      weightKg: 2.5,
      comment: 'Sample test order',
    });
    const res = createMockRes();
    await orderHandler(req, res);
    assert.strictEqual(res.statusCode, 200, 'Valid demo order should return 200');
    assert.strictEqual(res.body?.success, true);
    assert.strictEqual(res.body?.orderId, 'CN-12345');
    console.log('✓ Test 8: Valid order in demo mode returns deterministic 200');
  }

  // Test 9: POST /api/order sends Telegram notification and returns 200 on success
  {
    process.env.TELEGRAM_BOT_TOKEN = 'secret-token-12345';
    process.env.TELEGRAM_CHAT_ID = 'chat-98765';

    let fetchCalled = false;
    globalThis.fetch = async (url: any, init: any) => {
      fetchCalled = true;
      assert.ok(url.toString().includes('secret-token-12345'));
      const parsedBody = JSON.parse(init.body);
      assert.strictEqual(parsedBody.chat_id, 'chat-98765');
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const req = createMockReq('POST', {
      id: 'CN-TG-01',
      itemUrl: 'https://item.taobao.com/item.htm?id=68219401',
      cnyPrice: 120,
      quantity: 5,
      weightKg: 2,
    });
    const res = createMockRes();
    await orderHandler(req, res);
    assert.ok(fetchCalled, 'Telegram fetch should have been called');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body?.success, true);
    console.log('✓ Test 9: Telegram notification succeeds with 200');
  }

  // Test 10: POST /api/order handles Telegram non-2xx response -> 502, never leaks secrets
  {
    process.env.TELEGRAM_BOT_TOKEN = 'secret-token-leak-check';
    process.env.TELEGRAM_CHAT_ID = 'chat-fail';

    globalThis.fetch = async () => {
      return new Response(JSON.stringify({ ok: false, description: 'Unauthorized' }), {
        status: 401,
      });
    };

    const req = createMockReq('POST', {
      id: 'CN-TG-FAIL',
      itemUrl: 'https://poizon.com/product/581023',
      cnyPrice: 680,
      quantity: 1,
      weightKg: 1.2,
    });
    const res = createMockRes();
    await orderHandler(req, res);
    assert.strictEqual(res.statusCode, 502, 'Telegram non-2xx must return 502');
    assert.strictEqual(res.body?.success, false);
    const jsonStr = JSON.stringify(res.body);
    assert.ok(!jsonStr.includes('secret-token-leak-check'), 'Token must never leak in response!');
    console.log('✓ Test 10: Telegram non-2xx returns 502 without secret leakage');
  }

  // Test 11: POST /api/order handles Telegram thrown fetch error -> 502, never leaks secrets
  {
    process.env.TELEGRAM_BOT_TOKEN = 'secret-token-throw-check';
    process.env.TELEGRAM_CHAT_ID = 'chat-throw';

    globalThis.fetch = async () => {
      throw new Error('Network timeout to api.telegram.org');
    };

    const req = createMockReq('POST', {
      id: 'CN-TG-THROW',
      itemUrl: 'https://detail.1688.com/offer/71239841.html',
      cnyPrice: 45,
      quantity: 2,
      weightKg: 1,
    });
    const res = createMockRes();
    await orderHandler(req, res);
    assert.strictEqual(res.statusCode, 502, 'Thrown error must return 502');
    assert.strictEqual(res.body?.success, false);
    const jsonStr = JSON.stringify(res.body);
    assert.ok(!jsonStr.includes('secret-token-throw-check'), 'Token must never leak in response!');
    console.log('✓ Test 11: Thrown fetch error returns 502 without secret leakage');
  }

  // Restore env and fetch
  globalThis.fetch = originalFetch;
  process.env = originalEnv;

  console.log('--- All 11 API Tests Passed Cleanly! ---');
}

runTests().catch((err) => {
  globalThis.fetch = originalFetch;
  process.env = originalEnv;
  console.error('API Test Suite Failed:', err);
  process.exit(1);
});
