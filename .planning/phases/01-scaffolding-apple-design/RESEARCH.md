# Phase 1: Research - Scaffolding & Apple Design System

## Objectives
Establish a robust, production-grade Next.js 15 App Router foundation configured strictly according to the Apple Design System specification defined in `DESIGN.md`.

## Key Findings & Decisions

### 1. Next.js 15 App Router & Node 20
- **Node Environment**: Node v20.20.1 and npm 11.11.0 are installed.
- **Next.js 15 Architecture**:
  - Uses React 19 and App Router (`app/` directory).
  - Client and Server components are strictly separated (`"use client"` directives for interactive UI, server components for SSR).
  - Standard alias `@/*` mapping to `./src/*` or `./*`. We will use `./src` for clean separation.

### 2. Apple Design System Integration (`DESIGN.md`)
- **Colors**:
  - Primary Action Blue: `#0066cc` (hover/focus: `#0071e3`, dark surface link: `#2997ff`)
  - Ink / Text: `#1d1d1f` (on-dark: `#ffffff`, muted: `#7a7a7a` / `#333333`)
  - Surfaces: Canvas (`#ffffff`), Parchment (`#f5f5f7`), Surface Pearl (`#fafafc`), Dark Tiles (`#272729`, `#2a2a2c`, `#000000`)
  - Hairline: `#e0e0e0` / `rgba(0, 0, 0, 0.08)`
- **Typography**:
  - Display & Text: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif`
  - Body text at **17px** with line-height 1.47 and letter-spacing `-0.374px` (Apple standard, not 16px).
  - Headlines with negative tracking (`tracking-tight` / `-0.28px` to `-0.374px`).
  - Font weight ladder: 300, 400, 600, 700 (500 is deliberately avoided per Apple guidelines).
- **Shapes & Micro-interactions**:
  - Full-pill buttons (`rounded-full`) for all primary actions.
  - Active press transform: `active:scale-95 transition-transform duration-100`.
  - Frosted glass navigation: `backdrop-blur-md bg-[#f5f5f7]/80` or `bg-white/80`.
  - Zero gratuitous drop shadows (only 1 soft shadow for product/media cards).

### 3. Component Architecture
- Place shared components in `src/components/ui/apple/`.
- Layout components in `src/components/layout/`.
- Utility helpers in `src/lib/utils.ts` (`cn` helper using `clsx` and `tailwind-merge`).
