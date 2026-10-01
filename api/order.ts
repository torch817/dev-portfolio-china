import { validateMarketplaceUrl } from '../src/utils/urlValidation.ts';

const MAX_PAYLOAD_BYTES = 10 * 1024; // 10 KB limit
const TELEGRAM_TIMEOUT_MS = 5000; // 5 seconds bounded timeout

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    if (res.setHeader) {
      res.setHeader('Allow', 'POST');
    }
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1. Enforce 10 KB payload size limit
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  const payloadSizeBytes = Buffer.byteLength(rawBody, 'utf8');

  if (payloadSizeBytes > MAX_PAYLOAD_BYTES) {
    return res.status(413).json({
      error: 'Payload Too Large: maximum allowed size is 10 KB',
    });
  }

  let order: any;
  try {
    order = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  if (!order || typeof order !== 'object') {
    return res.status(400).json({ error: 'Invalid order payload' });
  }

  // 2. Schema validation
  const cnyPrice = Number(order.cnyPrice);
  const quantity = Number(order.quantity);
  const weightKg = Number(order.weightKg);

  if (
    typeof order.itemUrl !== 'string' ||
    !order.itemUrl.trim() ||
    isNaN(cnyPrice) ||
    cnyPrice <= 0 ||
    isNaN(quantity) ||
    quantity < 1 ||
    isNaN(weightKg) ||
    weightKg <= 0
  ) {
    return res.status(400).json({
      error: 'Invalid order payload: itemUrl, cnyPrice > 0, quantity >= 1, weightKg > 0 are required',
    });
  }

  // 3. Strict Marketplace Domain Validation
  const validation = validateMarketplaceUrl(order.itemUrl);
  if (!validation.isValid) {
    return res.status(400).json({
      error: validation.error || 'Unsupported marketplace platform or invalid URL',
    });
  }

  // 4. Bounded user text before notification
  const safeId = typeof order.id === 'string' ? order.id.slice(0, 30) : `CN-${Date.now()}`;
  const safeComment = typeof order.comment === 'string' ? order.comment.slice(0, 500) : '';
  const safeItemUrl = validation.normalizedUrl || order.itemUrl;
  const totalRub = Number(order.totalRub) || Math.round(cnyPrice * quantity * 13.8 + (cnyPrice * quantity * 13.8 * 0.05) + weightKg * 480);

  // 5. Telegram Notification
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);

    try {
      const messageText =
        `🇨🇳 *Новый заказ из Китая!*\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `📦 *Номер:* \`${safeId}\`\n` +
        `🔗 *Товар:* ${safeItemUrl}\n` +
        `🔢 *Кол-во:* ${quantity} шт.\n` +
        `⚖️ *Вес:* ${weightKg} кг\n` +
        `💰 *Сумма:* ${totalRub.toLocaleString('ru-RU')} ₽\n` +
        (safeComment ? `📝 *Комментарий:* ${safeComment}\n` : '') +
        `━━━━━━━━━━━━━━━━\n` +
        `🕒 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

      const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'Markdown',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!tgResponse.ok) {
        return res.status(502).json({
          success: false,
          error: 'Telegram notification delivery failed',
          orderId: safeId,
        });
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      return res.status(502).json({
        success: false,
        error: 'Telegram notification service unreachable or timed out',
        orderId: safeId,
      });
    }
  }

  return res.status(200).json({
    success: true,
    orderId: safeId,
    platform: validation.platform,
  });
}
