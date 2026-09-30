# Design System & Tokens Spec

## Color Palette (High-Contrast Cyber-Clean)
- **Dark Theme (Default)**:
  - Background Primary: `#090d16` (slate-950)
  - Background Secondary / Card: `#0f172a` (slate-900)
  - Border Subdued: `#1e293b` (slate-800)
  - Text Primary: `#f8fafc` (slate-50)
  - Text Secondary: `#94a3b8` (slate-400)
  - Accent Primary: `#06b6d4` (cyan-500) to `#3b82f6` (blue-500) gradient
  - Accent Green (Success): `#10b981` (emerald-500)
  - Accent Amber (Pending): `#f59e0b` (amber-500)
  - Accent Purple (Warehouse): `#a855f7` (purple-500)
- **Light Theme**:
  - Background Primary: `#f8fafc` (slate-50)
  - Background Card: `#ffffff` (white)
  - Border: `#e2e8f0` (slate-200)
  - Text Primary: `#0f172a` (slate-900)
  - Text Secondary: `#64748b` (slate-500)

## Typography
- Font Family: Inter / System UI sans-serif
- Scales: Hero `text-4xl md:text-6xl font-bold`, Headings `text-2xl md:text-3xl font-semibold`, Body `text-sm md:text-base`

## Motion & Effects (Magic UI inspired)
- Magic Dot-Grid / Radial Gradient Background with smooth pulse
- Subtle hover transitions (`transition-all duration-200 ease-out hover:-translate-y-0.5`)
- Max 2-3 focused animations per view to maintain snappy performance.
