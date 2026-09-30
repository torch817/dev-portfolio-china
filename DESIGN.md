# Design System & Tokens Spec (Strict Minimalist Monochrome)

## Core Philosophy
Строгий, выверенный инженерный стиль для B2B-заказчиков и бизнеса.
Минимум цвета, отсутствие кричащих неоновых градиентов. Акцент на типографике, контрасте, читаемости данных и функционале.

## Color Palette

### Dark Theme (Default)
- **Background Primary**: `#09090b` (zinc-950) — глубокий матовый черный
- **Background Secondary / Cards**: `#121215` (zinc-900/70) с тонкой рамкой `#27272a` (zinc-800)
- **Text Primary**: `#fafafa` (zinc-50) — чистый высокий контраст
- **Text Secondary / Muted**: `#a1a1aa` (zinc-400) — вторичный текст
- **Text Subtle**: `#71717a` (zinc-500) — подписи и подсказки
- **Accent Primary**: `#e4e4e7` (zinc-200) / `#3b82f6` (строгий приглушенный синий для интерактивных элементов)
- **Status Badges**:
  - Новый: `#71717a` (нейтральный серый / zinc)
  - Выкуплен: `#3b82f6` (приглушенный синий)
  - На складе: `#8b5cf6` (приглушенный фиолетовый)
  - В пути: `#f59e0b` (матовый янтарный)
  - Доставлен: `#10b981` (приглушенный изумрудный)

### Light Theme
- **Background Primary**: `#ffffff` (чистый белый)
- **Background Card**: `#f4f4f5` (zinc-100) с рамкой `#e4e4e7` (zinc-200)
- **Text Primary**: `#09090b` (zinc-950)
- **Text Secondary**: `#52525b` (zinc-600)

## Typography
- **Font**: Inter, system-ui, -apple-system, sans-serif
- **Sizes**:
  - Hero Title: `text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100`
  - Section Titles: `text-xl sm:text-2xl font-semibold text-zinc-100`
  - Body: `text-sm text-zinc-300 leading-relaxed`
  - Monospace (числа, треки, валюты): `font-mono text-zinc-200`

## Structure & Layout Contracts
1. **Header**: Логотип "МС", ссылки (Проекты, Стек, Обо мне, Контакты), кнопка "Демо: Китай", переключатель темы.
2. **Hero Screen**:
   - Статус: *Открыт к B2B проектам и разработке сервисов*
   - Имя: *Михаил Соболев*
   - Роль: *Веб-разработчик: сайты и сервисы для приёма заказов*
   - Подзаголовок: *Делаю быстрые, понятные сайты под задачу: от макета до запуска.*
   - CTA: *Посмотреть демо* (`/demo`) и *Написать в Telegram* (`https://t.me/whhwheqkkwk`).
3. **Projects Section**:
   - 1 широкая премиальная карточка: *«Демо: сервис заказов из Китая»* (задача, стек, разбор решения, кнопка перехода в `/demo`).
4. **Skills Section**:
   - 3 карточки: Фронтенд, Бэкенд и данные, Запуск.
5. **About Section**:
   - Спокойный деловой тон, фокус на B2B-разработке, надежности, интеграциях и запуске под ключ.
6. **Contacts Section**:
   - 3 строгие карточки прямых контактов (без громоздких форм):
     - **Telegram**: `@whhwheqkkwk` (`https://t.me/whhwheqkkwk`)
     - **Email**: `ob0lev@yandex.ru` (`mailto:ob0lev@yandex.ru`)
     - **GitHub**: `torch817` (`https://github.com/torch817`)
7. **Demo Page (`/demo`)**:
   - Интерактивная форма выкупа и калькулятор Китая в строгом матовом стиле.
