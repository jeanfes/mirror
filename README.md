# Mirror Web

Next.js app for the Mirror product web experience.

## What Is Included

- Public landing inspired by the extension visual style.
- Supabase SSR authentication flow.
- Private workspace routes protected with `proxy.ts` and private layout guard.
- Product modules in English:
	- Profiles
	- History
	- Settings
	- Account
	- Plans
	- Trash
- UI system adapted from extension conventions (neo-shell, neo-card, buttons, toggles, select, Lucide icons).

## MVP Stack Configured

- Tailwind CSS v4 + custom neo design tokens.
- Radix Primitives (Dialog, Dropdown Menu, Tabs) wrapped in custom components.
- TanStack Query for server-state and caching.
- React Hook Form + Zod for form handling and validation.
- Sonner for toast notifications.
- date-fns for date formatting utilities.

## Requirements

- Node.js 18+
- pnpm

## Setup

1. Install dependencies:

```bash
pnpm install
```

3. Start dev server:

```bash
pnpm dev
```

## Auth Notes

- Auth is handled with Supabase clients (`@supabase/ssr` + `@supabase/supabase-js`).
- Protected routes are always validated with real Supabase sessions.
- Login, register, OAuth, and logout flows run exclusively against Supabase.

## API Routes

- API routes are being introduced per module as MVP features move from mock data to persisted data.
- Current private pages still use placeholder/mock content while core CRUD and generation flows are implemented.
