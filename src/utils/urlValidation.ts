export const ALLOWED_MARKETPLACE_DOMAINS = [
  '1688.com',
  'taobao.com',
  'tmall.com',
  'poizon.com',
  'dewu.com',
] as const;

export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
  normalizedUrl?: string;
  platform?: string;
}

export function normalizeMarketplaceUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function validateMarketplaceUrl(rawUrl: string): UrlValidationResult {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Введите ссылку на товар' };
  }

  let parsed: URL;
  try {
    const normalized = normalizeMarketplaceUrl(trimmed);
    parsed = new URL(normalized);
  } catch {
    return {
      isValid: false,
      error: 'Некорректный формат URL (пример: https://detail.1688.com/...)',
    };
  }

  // 1. Only http and https protocols are supported
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      isValid: false,
      error: 'Поддерживаются только протоколы http:// и https://',
    };
  }

  // 2. Reject custom ports
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    return {
      isValid: false,
      error: 'Ссылки с нестандартными портами не поддерживаются',
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 3. Exact domain and subdomain matching
  const matchedDomain = ALLOWED_MARKETPLACE_DOMAINS.find(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );

  if (!matchedDomain) {
    return {
      isValid: false,
      error: 'Поддерживаются ссылки только на 1688, Taobao, Tmall и Poizon (Dewu)',
    };
  }

  let platform = '1688';
  if (matchedDomain === 'taobao.com') platform = 'Taobao';
  else if (matchedDomain === 'tmall.com') platform = 'Tmall';
  else if (matchedDomain === 'poizon.com' || matchedDomain === 'dewu.com') platform = 'Poizon';

  return {
    isValid: true,
    normalizedUrl: parsed.toString(),
    platform,
  };
}
