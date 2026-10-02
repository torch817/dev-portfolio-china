const FX_URL = 'https://open.er-api.com/v6/latest/CNY';
const FETCH_TIMEOUT_MS = 5000;
const FALLBACK_RATE = 13.8;

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    if (res.setHeader) {
      res.setHeader('Allow', 'GET');
    }
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (res.setHeader) {
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(FX_URL, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Upstream returned status ${response.status}`);
    }

    const data = await response.json();
    if (
      typeof data?.rates?.RUB === 'number' &&
      !isNaN(data.rates.RUB) &&
      data.rates.RUB > 0
    ) {
      const rate = Number(data.rates.RUB.toFixed(2));
      return res.status(200).json({
        ok: true,
        rate,
        source: 'open.er-api.com',
        timestamp: Date.now(),
      });
    }

    throw new Error('Invalid rate payload from upstream');
  } catch {
    return res.status(200).json({
      ok: true,
      rate: FALLBACK_RATE,
      source: 'fallback',
      timestamp: Date.now(),
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
