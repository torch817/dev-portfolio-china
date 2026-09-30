// Vercel Serverless Function: Handles China Order placement & Telegram Notification
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const order = req.body;
  const isSupportedDomain =
    typeof order?.itemUrl === 'string' &&
    /(1688\.com|taobao\.com|tmall\.com|poizon\.com|dewu\.com)/i.test(order.itemUrl);

  if (
    !order ||
    !order.itemUrl ||
    !isSupportedDomain ||
    !(Number(order.cnyPrice) > 0) ||
    !(Number(order.quantity) > 0) ||
    !(Number(order.weightKg) > 0)
  ) {
    return res.status(400).json({ error: 'Invalid order payload or unsupported platform' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    try {
      const messageText = 
        `🇨🇳 *Новый заказ из Китая!*
` +
        `━━━━━━━━━━━━━━━━
` +
        `📦 *Номер:* \`${order.id}\`
` +
        `🔗 *Товар:* ${order.itemUrl}
` +
        `🔢 *Кол-во:* ${order.quantity} шт.
` +
        `⚖️ *Вес:* ${order.weightKg} кг
` +
        `💰 *Сумма:* ${order.totalRub?.toLocaleString('ru-RU')} ₽
` +
        (order.comment ? `📝 *Комментарий:* ${order.comment}
` : '') +
        `━━━━━━━━━━━━━━━━
` +
        `🕒 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'Markdown'
        })
      });
    } catch (err) {
      console.error('Failed to notify telegram:', err);
    }
  }

  return res.status(200).json({ success: true, orderId: order.id });
}
