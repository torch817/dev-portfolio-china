export interface TelegramOrderQuote {
  id?: string;
  itemUrl: string;
  title?: string;
  cnyPrice: number;
  quantity: number;
  weightKg: number;
  rate: number;
  goodsRub: number;
  commissionRub: number;
  shippingRub: number;
  totalRub: number;
  comment?: string;
}

export type TelegramOrderPayload = TelegramOrderQuote;

export const TELEGRAM_USERNAME = 'whhwheqkkwk';

/**
 * Sanitizes unpaired / lone surrogates to avoid URIError during encodeURIComponent.
 */
function sanitizeSurrogates(str: string): string {
  if (!str) return '';
  if (typeof (str as unknown as { toWellFormed?: () => string }).toWellFormed === 'function') {
    return (str as unknown as { toWellFormed: () => string }).toWellFormed();
  }
  return str.replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
    '\uFFFD'
  );
}

/**
 * Extracts grapheme clusters safely without splitting multi-byte UTF-8,
 * surrogate pairs, flags, or combining characters.
 */
function getGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && (Intl as unknown as { Segmenter?: new (loc?: string, opt?: { granularity: string }) => { segment: (input: string) => Iterable<{ segment: string }> } }).Segmenter) {
    const SegmenterClass = (Intl as unknown as { Segmenter: new (loc?: string, opt?: { granularity: string }) => { segment: (input: string) => Iterable<{ segment: string }> } }).Segmenter;
    const segmenter = new SegmenterClass(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

/**
 * Truncates an arbitrary string safely by graphemes so encodeURIComponent(result).length <= maxEncodedLength.
 */
export function truncateStringByGraphemes(str: string, maxEncodedLength: number): string {
  const safeStr = sanitizeSurrogates(str);
  if (encodeURIComponent(safeStr).length <= maxEncodedLength) {
    return safeStr;
  }
  const graphemes = getGraphemes(safeStr);
  const ellipsis = '...';
  if (encodeURIComponent(ellipsis).length > maxEncodedLength) {
    return '';
  }

  let low = 0;
  let high = graphemes.length;
  let best = '';

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const candidate = graphemes.slice(0, mid).join('') + ellipsis;
    if (encodeURIComponent(candidate).length <= maxEncodedLength) {
      best = candidate;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return best;
}

function formatMessageLines(
  order: TelegramOrderQuote,
  comment?: string,
  title?: string,
  url?: string
): string {
  const effectiveUrl = url ?? order.itemUrl;
  const lines: string[] = [
    'Здравствуйте! Хочу оформить заказ из Китая:',
    order.id ? `📦 Заказ: ${order.id}` : '',
    title ? `🏷 Товар: ${title}` : '',
    `🔗 Ссылка: ${effectiveUrl}`,
    `🔢 Количество: ${order.quantity} шт.`,
    `💵 Цена: ${order.cnyPrice} ¥ (курс ${order.rate} ₽/¥)`,
    `⚖️ Вес: ${order.weightKg} кг`,
    '',
    'Расчёт стоимости:',
    `• Товары: ${order.goodsRub.toLocaleString('ru-RU')} ₽`,
    `• Комиссия: ${order.commissionRub.toLocaleString('ru-RU')} ₽`,
    `• Доставка: ${order.shippingRub.toLocaleString('ru-RU')} ₽`,
    `💰 Итого: ${order.totalRub.toLocaleString('ru-RU')} ₽`,
    comment ? `\n📝 Комментарий: ${comment}` : '',
  ].filter((line) => line !== '');

  return lines.join('\n');
}

/**
 * Creates structured plain-text / Markdown message for @whhwheqkkwk.
 * Truncates long fields (e.g. comment / URL) before encoding so
 * encodeURIComponent(msg) is strictly <= 2048 characters. Never splits UTF-8 characters.
 * Returns https://t.me/whhwheqkkwk?text=${encodeURIComponent(text)}
 */
export function buildTelegramOrderLink(
  order: {
    id?: string;
    itemUrl: string;
    title?: string;
    cnyPrice: number;
    quantity: number;
    weightKg: number;
    rate: number;
    goodsRub: number;
    commissionRub: number;
    shippingRub: number;
    totalRub: number;
    comment?: string;
  },
  maxEncodedLength: number = 2048
): string {
  let comment = order.comment ? sanitizeSurrogates(order.comment) : undefined;
  let title = order.title ? sanitizeSurrogates(order.title) : undefined;
  let url = sanitizeSurrogates(order.itemUrl);

  let msg = formatMessageLines(order, comment, title, url);
  if (encodeURIComponent(msg).length <= maxEncodedLength) {
    return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(msg)}`;
  }

  // 1. Truncate comment if present
  if (comment) {
    const graphemes = getGraphemes(comment);
    let low = 0;
    let high = graphemes.length;
    let bestComment = '';
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const candidate = graphemes.slice(0, mid).join('') + '...';
      const testMsg = formatMessageLines(order, candidate, title, url);
      if (encodeURIComponent(testMsg).length <= maxEncodedLength) {
        bestComment = candidate;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    comment = bestComment || undefined;
    msg = formatMessageLines(order, comment, title, url);
  }

  // 2. If still exceeding, truncate title if present
  if (encodeURIComponent(msg).length > maxEncodedLength && title) {
    const graphemes = getGraphemes(title);
    let low = 0;
    let high = graphemes.length;
    let bestTitle = '';
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const candidate = graphemes.slice(0, mid).join('') + '...';
      const testMsg = formatMessageLines(order, comment, candidate, url);
      if (encodeURIComponent(testMsg).length <= maxEncodedLength) {
        bestTitle = candidate;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    title = bestTitle || undefined;
    msg = formatMessageLines(order, comment, title, url);
  }

  // 3. If still exceeding, truncate url
  if (encodeURIComponent(msg).length > maxEncodedLength) {
    const graphemes = getGraphemes(url);
    let low = 0;
    let high = graphemes.length;
    let bestUrl = '';
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const candidate = graphemes.slice(0, mid).join('') + '...';
      const testMsg = formatMessageLines(order, comment, title, candidate);
      if (encodeURIComponent(testMsg).length <= maxEncodedLength) {
        bestUrl = candidate;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    url = bestUrl;
    msg = formatMessageLines(order, comment, title, url);
  }

  // 4. Absolute fallback guarantee
  if (encodeURIComponent(msg).length > maxEncodedLength) {
    msg = truncateStringByGraphemes(msg, maxEncodedLength);
  }

  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(msg)}`;
}
