# SafeStop

Child vehicle safety system — prevents children from being left unattended in vehicles.

## Stack
- **Mobile**: React Native + Expo SDK 54 + Expo Router 6 + NativeWind + TypeScript
- **Web Portal / PWA**: Next.js 15 + Tailwind CSS + TypeScript
- **Backend**: Next.js API routes on DigitalOcean ($6/mo droplet)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better Auth (open source)
- **Realtime**: Server-Sent Events (SSE)
- **File Storage**: Local disk or DO Spaces
- **Push Notifications**: Expo Push (free)

## Repo Structure
- `apps/mobile/` — React Native + Expo app
- `apps/web/` — Next.js web portal + API + PWA
- `packages/types/` — Shared TypeScript types
- `packages/state/` — XState session state machine
- `packages/utils/` — Shared helpers
- `packages/db/` — Drizzle schema + migrations

## Key Principles
- Session logic correctness is #1 priority
- Photo confirmation is the primary trust mechanism
- Assume child is present until confirmed otherwise
- Escalate only when necessary, never panic language
- All free & open source — $0/month for development

## Distribution
- Apple App Store (Expo EAS Build)
- Google Play Store (Expo EAS Build)
- PWA (Next.js + service worker)
- Web browser (portal)

## PRD
Full product spec is in SafeStop_Full_PRD_Expanded.docx
