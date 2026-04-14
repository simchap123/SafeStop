# SafeStop

Child vehicle safety system that prevents children from being left unattended in vehicles.

## Tech Stack

- **Mobile**: React Native + Expo SDK 54 + Expo Router 6 + NativeWind + TypeScript
- **Web Portal / PWA**: Next.js 15 + Tailwind CSS + TypeScript
- **Backend**: Next.js API routes on DigitalOcean
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better Auth (open source)
- **Realtime**: Server-Sent Events (SSE)
- **Push Notifications**: Expo Push

## Run Locally

### Web (browser)

```bash
cd apps/mobile
npm install
npx expo start --web
```

### Mobile (phone via QR code)

```bash
cd apps/mobile
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

## Build for Deployment

```bash
cd apps/mobile
npm run build:web
```

This generates a static `dist/` folder that Vercel (or any static host) can serve.

## PRD

Full product spec is in [SafeStop_Full_PRD_Expanded.docx](./SafeStop_Full_PRD_Expanded.docx).

## Screenshots

_Screenshots coming soon._
