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

export const TELEGRAM_USERNAME = 'whhwheqkkwk';

/**
 * Ensures multibyte-safe text truncation so encodeURIComponent(message).length <= maxEncodedLength.
 */
function truncateToEncodedLimit(text: string, maxEncodedLength: number = 2000): string {
  if (encodeURIComponent(text).length <= maxEncodedLength) {
    return text;
  }

  // Use Array.from to preserve unicode astral planes / surrogate pairs / emoji clusters safely
  const chars = Array.from(text);
  const ellipsis = '...';

  while (chars.length > 0) {
    chars.pop();
    const candidate = chars.join('') + ellipsis;
    if (encodeURIComponent(candidate).length <= maxEncodedLength) {
      return candidate;
    }
  }

  return '';
}

export function buildTelegramOrderLink(quote: TelegramOrderQuote): string {
  const lines: string[] = [
    'Здравствуйте! Хочу оформить заказ из Китая:',
    quote.id ? `📦 Заказ: ${quote.id}` : '',
    quote.title ? `🏷 Товар: ${quote.title}` : '',
    `🔗 Ссылка: ${quote.itemUrl}`,
    `🔢 Количество: ${quote.quantity} шт.`,
    `💵 Цена: ${quote.cnyPrice} ¥ (курс ${quote.rate} ₽/¥)`,
    `⚖️ Вес: ${quote.weightKg} кг`,
    '',
    'Расчёт стоимости:',
    `• Товары: ${quote.goodsRub.toLocaleString('ru-RU')} ₽`,
    `• Комиссия: ${quote.commissionRub.toLocaleString('ru-RU')} ₽`,
    `• Доставка: ${quote.shippingRub.toLocaleString('ru-RU')} ₽`,
    `💰 Итого: ${quote.totalRub.toLocaleString('ru-RU')} ₽`,
    quote.comment ? `\n📝 Комментарий: ${quote.comment}` : '',
  ].filter((line) => line !== '');

  const rawMessage = lines.join('\n');
  const safeMessage = truncateToEncodedLimit(rawMessage, 2000);

  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(safeMessage)}`;
}
