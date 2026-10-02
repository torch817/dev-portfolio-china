# DESIGN.md — v2/v3 Design System & Implementation Contract

This document is the authoritative visual and structural specification for the v2/v3 rebuild of the developer portfolio and China sourcing application. All tasks implement strictly what is defined here. The design is **dark-only with a single restrained blue accent** (`#3b82f6`).

## 0. Explicit Removals from v1

- **Light theme removed**: There is no light color branch and no theme toggle. `color-scheme: dark` is set globally on `:root` and `html`.
- **Gradients removed**: No `linear-gradient`, `radial-gradient`, or `conic-gradient` anywhere in source or built assets.
- **Magic UI glow removed**: `MagicGridBackground` is deleted or reduced to a static token-based background. No neon, glow, or multi-hue effects.
- **Multi-hue status palette removed**: All status badges use monochrome or blue tokens only. Purple, orange, emerald, rose, and green UI colors are banned.

## 1. Numeric Color Tokens (25 CSS Custom Properties)

Defined in `src/index.css` under `:root`. No color literal outside this token layer is permitted except monochrome/accent SVG assets.

| Token | Value | Use |
|---|---:|---|
| `--color-bg` | `#090b10` | page background |
| `--color-surface-1` | `#0f131a` | cards / sections |
| `--color-surface-2` | `#151b24` | raised card / field |
| `--color-surface-3` | `#1b2430` | hover / selected surface |
| `--color-border` | `#26303d` | default borders |
| `--color-border-strong` | `#344154` | emphasized borders |
| `--color-text` | `#f1f5f9` | primary text |
| `--color-text-secondary` | `#b3bfce` | body / secondary text |
| `--color-text-muted` | `#748196` | labels / meta |
| `--color-accent` | `#3b82f6` | sole brand / action accent |
| `--color-accent-hover` | `#2563eb` | hover / active accent |
| `--color-accent-soft` | `rgba(59,130,246,.12)` | subtle accent fill |
| `--color-accent-border` | `rgba(59,130,246,.40)` | focused / selected border |
| `--color-focus` | `#60a5fa` | keyboard focus ring |
| `--color-status-neutral` | `#94a3b8` | status: Новый |
| `--color-status-blue` | `#60a5fa` | status: Выкуплен |
| `--color-status-muted` | `#64748b` | status: На складе |
| `--color-status-dark` | `#475569` | status: В пути |
| `--color-status-complete` | `#cbd5e1` | status: Доставлен (no green) |
| `--shadow-card` | `0 8px 30px rgba(0,0,0,.18)` | card elevation |
| `--shadow-focus` | `0 0 0 3px rgba(59,130,246,.25)` | focus |
| `--radius-sm` | `6px` | badges / compact controls |
| `--radius-md` | `10px` | inputs / buttons |
| `--radius-lg` | `14px` | cards |
| `--radius-xl` | `20px` | hero / feature panel |

Global rules: `color-scheme: dark`; `body` background/text sourced from tokens; 1px border default.

## 2. Tailwind Configuration Aliases

Mapped in `tailwind.config.js`:
- `bg.canvas` → `var(--color-bg)`
- `bg.surface` → `var(--color-surface-1)`
- `bg.raised` → `var(--color-surface-2)`
- `bg.hover` → `var(--color-surface-3)`
- `border.default` → `var(--color-border)`
- `border.strong` → `var(--color-border-strong)`
- `content.primary` → `var(--color-text)`
- `content.secondary` → `var(--color-text-secondary)`
- `content.muted` → `var(--color-text-muted)`
- `accent.DEFAULT` → `var(--color-accent)`
- `accent.hover` → `var(--color-accent-hover)`
- `accent.soft` → `var(--color-accent-soft)`
- `accent.border` → `var(--color-accent-border)`

Font families:
- `sans`: `["Inter", "ui-sans-serif", "system-ui", "sans-serif"]`
- `mono`: `["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"]` (only if self-hosted; otherwise system sans/mono)

Numeric spacing aliases:
- `18`: `4.5rem` (72px)
- `22`: `5.5rem` (88px)
- `30`: `7.5rem` (120px)
- `34`: `8.5rem` (136px)

Radii:
- `sm`: `var(--radius-sm)` (6px)
- `md`: `var(--radius-md)` (10px)
- `lg`: `var(--radius-lg)` (14px)
- `xl`: `var(--radius-xl)` (20px)

Animation:
- `rise-in`: `420ms cubic-bezier(.22,1,.36,1)`
- All gradient and glow animations are removed.

## 3. Typography Scale

Self-hosted `Inter` subset or system sans stack; numeric figures and tracking IDs use system monospace. No render-blocking Google Fonts request.

| Level | `clamp()` / Size | Weight | Line-Height | Letter-Spacing |
|---|---|---|---:|---:|
| `display-xl` | `clamp(2.75rem, 7vw, 5.5rem)` | 700 | 0.98 | -0.055em |
| `display-lg` | `clamp(2rem, 4vw, 3.5rem)` | 700 | 1.04 | -0.04em |
| `heading-lg` | 2rem (32px) | 650 | 2.25rem (36px) | 0 |
| `heading-md` | 1.25rem (20px) | 650 | 1.5rem (24px) | 0 |
| `heading-sm` | 1rem (16px) | 650 | 1.375rem (22px) | 0 |
| `body-lg` | 1.125rem (18px) | 400 | 1.75rem (28px) | 0 |
| `body` | 0.9375rem (15px) | 400 | 1.6 (24px) | 0 |
| `meta` | 0.75rem (12px) | 400 | 1.4 (16.8px) | 0.08em (uppercase) |

## 4. Spacing, Radius, Motion, and Elevation Rules

- **Spacing scale** (px): `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`.
- **Section vertical padding**: `80px` desktop / `56px` mobile.
- **Container max-width**: `1120px`.
- **Horizontal padding**: `20px` mobile / `32px` desktop.
- **Radii**: Buttons and inputs are `10px` (`--radius-md`) with minimum `44px` touch height. Cards are `14px` (`--radius-lg`). Hero feature panel is `20px` (`--radius-xl`). Status and compact tags use pills or `--radius-sm` (`6px`).
- **Motion**: Opacity and translate entrance only, `420ms`; hover transitions `160ms`; no perpetual animation except a `1px` status indicator pulse at `2.5s`.
- **Reduced motion**: Respect `prefers-reduced-motion: reduce` by disabling transforms, transitions, and animations.
- **Elevation**: Border-first architecture. `--shadow-card` (`0 8px 30px rgba(0,0,0,.18)`) is used exclusively on featured surfaces; glow effects are prohibited.

## 5. Landing Page Information Architecture (7 Ordered Sections in R3)

Landing sections must render in this exact sequence:
1. **Header / navigation** — sticky header (`z-50`, backdrop-blur, subtle bottom border), wordmark `МС`, anchors `Решение` (`#solution`), `Стек` (`#skills`), `О подходе` (`#about`), `Контакты` (`#contacts`), and a single blue action `Демо: Китай`. On mobile use an accessible compact menu or demo action only; no theme toggle. All anchor targets use `scroll-margin-top: 80px`.
2. **Hero / positioning** — left-aligned single-column clean layout: `Михаил Соболев`, role `Веб-разработчик: сайты и сервисы для приёма заказов`, subtitle `Делаю быстрые, понятные сайты под задачу: от макета до запуска`, status `Открыт к B2B заказам и разработке сервисов`, CTAs `Посмотреть демо` → `/demo` and Telegram. Features subtle animated background (`BackgroundBeams.tsx`, pure CSS keyframes/canvas particles/grid in dark palette with `#3b82f6` accent, disabled when `prefers-reduced-motion: reduce`). The former right-side \"Сводка выкупа Китая\" panel is removed.
3. **Featured solution (`#solution`)** — one wide case card titled `Демо: сервис заказов из Китая (1688 / Taobao / Poizon)` with problem, flow (link → calculation → Telegram → statuses), stack, and `/demo` CTA.
4. **Stack / capabilities (`#skills`)** — three groups: `Фронтенд`, `Бэкенд и данные`, `Запуск`, with concrete technologies and business outcomes.
5. **Approach / about (`#about`)** — concise business block: B2B development, order-intake automation, reliable architecture, turnkey delivery, structured as three numbered principles.
6. **Contact / conversion (`#contacts`)** — direct Telegram (`@whhwheqkkwk`), Email (`ob0lev@yandex.ru`), GitHub (`torch817`) cards without a form, plus final Telegram CTA.
7. **Footer** — copyright and direct links; no redundant controls.

*(Note: The former Proof strip / \"Сводка выкупа Китая\" is completely removed per Founder R3 requirements).*

## 6. Routing Architecture — `/demo` as a Real Pathname Route

`/demo` is a **real pathname route**, not a client state toggle.
- `/` renders the landing page.
- `/demo` renders the China order intake demo.
- Browser back and forward buttons work natively.
- Direct reload of `/demo` loads the application correctly via Vercel rewrites:
  ```json
  {"rewrites":[{"source":"/api/:path*","destination":"/api/:path*"},{"source":"/(.*\\.[^/]+)$","destination":"/$1"},{"source":"/(.*)","destination":"/index.html"}]}
  ```
- `/api/health` and `/api/order` pass through to serverless functions without being rewritten to the SPA shell.

## 7. Accessibility and Mobile Constraints

- **Minimum viewport**: `390px` with 0 horizontal overflow; all CTAs remain accessible and tappable.
- **Touch target size**: Buttons and input controls have a minimum touch target height of `44px`.
- **Contrast ratio**: Minimum WCAG AA contrast ratio across all text and control surfaces.
- **Keyboard navigation**: Full keyboard navigation with a visible `2px` accent focus ring (`--color-focus`, `#60a5fa`).
- **Semantic structure**: Proper landmark elements (`<header>`, `<main>`, `<section>`, `<footer>`), heading hierarchy (`<h1>` through `<h3>`), and `aria-label` on icon-only controls.
- **Motion sensitivity**: Honor `prefers-reduced-motion: reduce` across all animated elements.

## 8. Authoritative Demo Pricing Facts

- Exchange rate: `13.8 ₽/¥`
- Service commission: `5%`
- Cargo logistics: `480 ₽/kg`
- Allowed marketplace sources: `1688`, `Taobao`, `Poizon` (exact host allowlist shared between client and server)
- The 2% insurance field is removed from calculation and UI.

## 9. R3 Specific Implementation Constraints

1. **Animated Background (`BackgroundBeams.tsx`)**:
   - Implemented via pure CSS keyframes or lightweight Canvas particles/grid.
   - Strictly NO `framer-motion` (banned to preserve 21.1 kB bundle margin).
   - Monochromatic dark background (`--color-bg`, `#090b10`) with subtle blue particles/beams (`#3b82f6`).
   - Automatically pauses or renders static state when `prefers-reduced-motion: reduce`.

2. **Calculator Enhancements (`OrderChart.tsx`, `OrderCalculator.tsx`)**:
   - Visual breakdown chart: Native SVG with responsive `viewBox`, `role="img"`, and `aria-label`. Banned: `recharts`.
   - Live exchange rate toggle: Standard React `useState` + `useMemo` for rates 13.5 / 13.8 / 14.2 ₽/¥.
   - Competitor comparison table: Shows comparison between Our service, Competitor A, Competitor B for sample order (35 ¥ × 10 pcs, 2.5 kg).
   - Mobile table strategy: On screens < 640px, uses card layout or scoped container with horizontal scroll (`overflow-x: auto`), maintaining 0 global page overflow.
   - Calculation history: Saves last 3–5 calculations in local component state with quick reload button.

3. **Performance Budgets (Hard Limits)**:
   - JavaScript bundle: < 90 kB gzip (strictly verified via `scripts/check-budgets.sh`).
   - CSS bundle: < 12 kB gzip.

