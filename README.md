# Mirror Web

Next.js app for the Mirror product web experience.

## What Is Included

- Public landing inspired by the extension visual style.
- Real authentication flow with Auth.js (NextAuth credentials provider).
- Private dashboard routes with middleware protection.
- Product modules in English:
	- Home
	- Assistant
	- Planner
	- Team
	- Personas
	- History
	- Analytics
	- Settings
	- Account
	- Plans
	- Trash
- API routes for auth and dashboard seed data.
- UI system adapted from extension conventions (neo-shell, neo-card, buttons, toggles, select, Lucide icons).

## Requirements

- Node.js 18+
- pnpm

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Start dev server:

```bash
pnpm dev
```

## Demo User

- Email: demo@mirror.app
- Password: Mirror123!

## Auth Notes

- Current implementation uses NextAuth credentials plus in-memory user store for MVP speed.
- Registration endpoint creates users in-memory while the server is running.
- For production, replace `lib/user-store.ts` with persistent storage (Postgres, Supabase, or Prisma).

## API Routes

- `GET /api/auth/me`
- `POST /api/register`
- `GET /api/dashboard/overview`
- `GET /api/dashboard/personas`
- `GET /api/dashboard/history`
- `GET /api/dashboard/account`
- `GET /api/dashboard/plans`
- `GET /api/dashboard/trash`
