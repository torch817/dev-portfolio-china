# Сайт-визитка веб-разработчика + Демо «Заказ товаров из Китая»

Современный, быстрый сайт-портфолио Михаила Соболева с интерактивным сервисом приёма и расчёта заказов из Китая (1688 / Taobao / Poizon).

## Стек
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React
- **Стили & Анимации**: shadcn/ui паттерны, Magic UI сетка и градиенты
- **Backend / Notifications**: Serverless API `/api/order.ts` для отправки уведомлений в Telegram
- **Деплой**: Vercel ready

## Запуск локально
```bash
# 1. Установка зависимостей
npm install

# 2. Запуск в режиме разработки
npm run dev

# 3. Сборка для продакшена
npm run build
```

## Деплой на Vercel
1. Загрузите репозиторий на GitHub.
2. Подключите репозиторий в [Vercel](https://vercel.com).
3. (Опционально) Добавьте в Environment Variables `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` для получения уведомлений о новых заказах.
4. Нажмите **Deploy**.
