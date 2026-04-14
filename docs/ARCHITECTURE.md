# SafeStop -- Technical Architecture

System architecture, data model, API surface, and deployment details.

---

## Table of Contents

1. [System Architecture Diagram](#1-system-architecture-diagram)
2. [Tech Stack with Justifications](#2-tech-stack-with-justifications)
3. [Data Model Overview](#3-data-model-overview)
4. [Session State Machine Specification](#4-session-state-machine-specification)
5. [API Surface](#5-api-surface)
6. [Security Model](#6-security-model)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Cost Breakdown](#8-cost-breakdown)

---

## 1. System Architecture Diagram

```
+------------------------------------------------------------------+
|                         CLIENTS                                   |
|                                                                   |
|  +------------------+  +------------------+  +-----------------+  |
|  |  Mobile App      |  |  Web Portal      |  |  PWA            |  |
|  |  (React Native   |  |  (Next.js 15     |  |  (Next.js +     |  |
|  |   + Expo SDK 54) |  |   + Tailwind)    |  |   Service       |  |
|  |                  |  |                  |  |   Worker)        |  |
|  |  iOS / Android   |  |  Desktop Browser |  |  Mobile Browser |  |
|  +--------+---------+  +--------+---------+  +--------+--------+  |
|           |                     |                      |          |
+-----------+---------------------+----------------------+----------+
            |                     |                      |
            v                     v                      v
+------------------------------------------------------------------+
|                     NETWORK LAYER                                 |
|                                                                   |
|  HTTPS (REST API)     SSE (Realtime)     Expo Push (Notifications)|
|                                                                   |
+------------------------------------------------------------------+
            |                     |                      |
            v                     v                      v
+------------------------------------------------------------------+
|                     BACKEND                                       |
|                                                                   |
|  +-------------------------------------------------------------+ |
|  |  Next.js 15 API Routes                                      | |
|  |                                                              | |
|  |  /api/auth/*        -- Better Auth (sessions, OAuth)         | |
|  |  /api/sessions/*    -- Session CRUD + state transitions      | |
|  |  /api/families/*    -- Family & member management            | |
|  |  /api/children/*    -- Child CRUD                            | |
|  |  /api/stops/*       -- Stop detection + confirmation         | |
|  |  /api/photos/*      -- Photo upload + retrieval              | |
|  |  /api/alerts/*      -- Alert creation + resolution           | |
|  |  /api/notifications/* -- Push notification dispatch          | |
|  |  /api/sse           -- Server-Sent Events stream             | |
|  +-------------------------------------------------------------+ |
|                                                                   |
|  +---------------------+  +------------------------------------+ |
|  |  Better Auth        |  |  Drizzle ORM                       | |
|  |  (Authentication)   |  |  (Query builder + migrations)      | |
|  +---------------------+  +------------------------------------+ |
|                                                                   |
+------------------------------------------------------------------+
            |                     |
            v                     v
+------------------------------------------------------------------+
|                     DATA LAYER                                    |
|                                                                   |
|  +---------------------------+  +------------------------------+ |
|  |  PostgreSQL               |  |  File Storage                | |
|  |                           |  |                              | |
|  |  Users, Families,         |  |  Local disk (dev)            | |
|  |  Children, Sessions,      |  |  DO Spaces (prod)           | |
|  |  Stops, Confirmations,    |  |                              | |
|  |  Photos, Alerts,          |  |  Stores confirmation photos  | |
|  |  Subscriptions            |  |  with expiry policy          | |
|  +---------------------------+  +------------------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 2. Tech Stack with Justifications

### Mobile -- React Native + Expo SDK 54

| Choice | Justification |
|--------|---------------|
| React Native | Single codebase for iOS + Android + Web. Largest React Native ecosystem. |
| Expo SDK 54 | Managed workflow eliminates native build complexity. EAS Build for store submissions. OTA updates via expo-updates. |
| Expo Router 6 | File-based routing matching Next.js conventions. Deep linking out of the box. |
| NativeWind 4 | Tailwind CSS syntax in React Native. Shared design language with web portal. |
| TypeScript | Type safety across the entire stack. Catches state machine errors at compile time. |

**Key Expo packages**:
- `expo-camera` -- Photo confirmation capture
- `expo-location` -- GPS tracking and geofence detection
- `expo-notifications` -- Push notification handling
- `expo-image-picker` -- Photo library access (fallback)
- `react-native-maps` -- Destination geofence visualization
- `react-native-reanimated` -- Smooth animations for session transitions

### Web Portal -- Next.js 15

| Choice | Justification |
|--------|---------------|
| Next.js 15 | Unified frontend + API backend in one deployment. App Router with RSC. |
| Tailwind CSS | Same utility-class system as NativeWind. Consistent design across platforms. |
| Server-Sent Events | Lightweight realtime updates without WebSocket complexity. One-way data flow matches the notification pattern. |

### Backend -- Next.js API Routes

| Choice | Justification |
|--------|---------------|
| API Routes | Co-located with web portal. No separate backend deployment. |
| Better Auth | Open-source authentication. Email/password, OAuth, session management. No vendor lock-in (vs. Auth0, Clerk). $0/month. |
| Drizzle ORM | Type-safe SQL queries. Lightweight (no Prisma bloat). Migration system built in. |

### Database -- PostgreSQL

| Choice | Justification |
|--------|---------------|
| PostgreSQL | Industry standard. ACID compliance critical for session state integrity. JSON columns for flexible metadata. |
| Drizzle migrations | Version-controlled schema changes. Rollback support. |

### Realtime -- Server-Sent Events (SSE)

| Choice | Justification |
|--------|---------------|
| SSE over WebSockets | Simpler implementation. HTTP-native (no upgrade negotiation). One-way server-to-client is all caregivers need. Automatic reconnection built into the browser EventSource API. |

### File Storage

| Choice | Justification |
|--------|---------------|
| Local disk (dev) | Zero config for development. |
| DO Spaces (prod) | S3-compatible object storage. $5/mo for 250GB. CDN included. Expiry policies for photo retention tiers. |

### Push Notifications -- Expo Push

| Choice | Justification |
|--------|---------------|
| Expo Push | Free, unlimited. Handles APNs (iOS) and FCM (Android) routing. Simple HTTP API from the backend. |

---

## 3. Data Model Overview

### Entity Relationship Diagram

```
Users 1---* FamilyMembers *---1 Families
                                    |
                          1---------+---------1
                          |                   |
                     Children *          Destinations *
                          |
                     Sessions *
                          |
                     Stops *
                          |
                  Confirmations 1
                          |
                     Photos 0..1


Families 1---* Subscriptions
Families 1---* Alerts
Sessions 1---* Alerts
Users    1---* NotificationEvents
```

### Table Definitions

#### Users

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| email | VARCHAR(255) | Unique, indexed |
| display_name | VARCHAR(100) | |
| avatar_url | TEXT | Nullable |
| phone | VARCHAR(20) | Nullable |
| created_at | TIMESTAMP | Default now() |
| updated_at | TIMESTAMP | Auto-updated |

#### Families

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| name | VARCHAR(100) | |
| owner_id | UUID (FK -> Users) | |
| created_at | TIMESTAMP | |

#### FamilyMembers

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| user_id | UUID (FK -> Users) | |
| family_id | UUID (FK -> Families) | |
| role | ENUM('owner', 'admin', 'member') | |
| joined_at | TIMESTAMP | |

#### Children

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| family_id | UUID (FK -> Families) | |
| name | VARCHAR(100) | |
| date_of_birth | DATE | Nullable |
| avatar_url | TEXT | Nullable |
| notes | TEXT | e.g., "rear-facing car seat" |
| created_at | TIMESTAMP | |

#### Destinations

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| family_id | UUID (FK -> Families) | |
| name | VARCHAR(100) | e.g., "Bright Horizons Daycare" |
| address | TEXT | |
| latitude | DECIMAL(10,7) | |
| longitude | DECIMAL(10,7) | |
| radius | INTEGER | Geofence radius in meters |
| is_default | BOOLEAN | |
| created_at | TIMESTAMP | |

#### Sessions

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| family_id | UUID (FK -> Families) | |
| driver_id | UUID (FK -> Users) | |
| child_id | UUID (FK -> Children) | |
| destination_id | UUID (FK -> Destinations) | Nullable |
| state | ENUM (see state machine) | Indexed |
| started_at | TIMESTAMP | |
| ended_at | TIMESTAMP | Nullable |

#### Stops

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| session_id | UUID (FK -> Sessions) | |
| latitude | DECIMAL(10,7) | |
| longitude | DECIMAL(10,7) | |
| detected_at | TIMESTAMP | |
| destination_id | UUID (FK -> Destinations) | Nullable (matched geofence) |

#### Confirmations

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| stop_id | UUID (FK -> Stops) | |
| type | ENUM('photo', 'manual', 'auto', 'co_parent') | |
| confirmed_by | UUID (FK -> Users) | |
| confirmed_at | TIMESTAMP | |

#### Photos

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| confirmation_id | UUID (FK -> Confirmations) | |
| uri | TEXT | S3/Spaces URL |
| taken_at | TIMESTAMP | |
| expires_at | TIMESTAMP | Based on subscription tier |

#### Alerts

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| session_id | UUID (FK -> Sessions) | |
| family_id | UUID (FK -> Families) | |
| child_id | UUID (FK -> Children) | |
| severity | ENUM('low', 'medium', 'high', 'critical') | |
| message | TEXT | |
| triggered_at | TIMESTAMP | |
| resolved_at | TIMESTAMP | Nullable |
| resolved_by | UUID (FK -> Users) | Nullable |

#### NotificationEvents

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| user_id | UUID (FK -> Users) | |
| type | ENUM('stop_detected', 'confirmation_needed', 'alert', 'escalation', 'session_started', 'session_ended') | |
| title | VARCHAR(200) | |
| body | TEXT | |
| data | JSONB | Deep link params |
| read | BOOLEAN | Default false |
| created_at | TIMESTAMP | |

#### Subscriptions

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| family_id | UUID (FK -> Families) | |
| tier | ENUM('free', 'basic', 'premium') | |
| max_children | INTEGER | |
| max_destinations | INTEGER | |
| is_active | BOOLEAN | |
| expires_at | TIMESTAMP | Nullable |
| created_at | TIMESTAMP | |

---

## 4. Session State Machine Specification

### States

```typescript
enum SessionState {
  IDLE = 'idle',
  DRIVING = 'driving',
  STOP_DETECTED = 'stop_detected',
  AWAITING_CONFIRMATION = 'awaiting_confirmation',
  CONFIRMED_SAFE = 'confirmed_safe',
  ALERT_TRIGGERED = 'alert_triggered',
  ESCALATED = 'escalated',
}
```

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `CHECK_IN` | `{ childId, destinationId? }` | Driver starts session |
| `STOP_DETECTED` | `{ latitude, longitude }` | GPS velocity = 0 |
| `CONFIRM_PHOTO` | `{ photoUri }` | Photo taken and uploaded |
| `CONFIRM_MANUAL` | `{}` | Manual confirmation without photo |
| `CONTINUE_DRIVING` | `{}` | Dismiss stop (false trigger or errand) |
| `REMIND_ME` | `{}` | Snooze for 60 seconds |
| `TIMEOUT` | `{}` | No response within confirmation window |
| `ESCALATION_TIMEOUT` | `{}` | No response from caregiver network |
| `RESOLVE` | `{ resolvedBy }` | Alert resolved by caregiver |
| `END_SESSION` | `{}` | Manual session end |

### Guards

| Guard | Condition | Prevents |
|-------|-----------|----------|
| `hasActiveSession` | `state !== IDLE` | Duplicate session start |
| `isValidChild` | Child belongs to family | Cross-family session |
| `withinTimeout` | Time since stop < threshold | Late confirmation |
| `hasPermission` | User is family member | Unauthorized access |

### Side Effects (Actions)

| Action | Trigger | Description |
|--------|---------|-------------|
| `createSession` | CHECK_IN | Insert session row, start heartbeat |
| `createStop` | STOP_DETECTED | Insert stop row with GPS coords |
| `saveConfirmation` | CONFIRM_* | Insert confirmation + photo if present |
| `notifyCaregiver` | CONFIRMED_SAFE | Push notification to all caregivers |
| `startEscalation` | TIMEOUT | Create alert, start escalation timer |
| `notifyEmergency` | ESCALATION_TIMEOUT | Notify emergency contacts |
| `endSession` | END_SESSION | Set ended_at, move to history |

### Timeout Configuration

| Setting | Default | Configurable |
|---------|---------|-------------|
| Confirmation window | 120 seconds | Yes (`settings.confirmationTimeout`) |
| Reminder interval | 60 seconds | No |
| Caregiver alert delay | 120 seconds | No |
| Emergency escalation | 600 seconds | No |
| Heartbeat interval | 60 seconds | No |
| Offline detection | 180 seconds (3 missed heartbeats) | No |

---

## 5. API Surface

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Email/password login |
| POST | `/api/auth/logout` | End session |
| GET | `/api/auth/session` | Get current session |
| POST | `/api/auth/forgot-password` | Password reset email |

### Families

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/families` | Create family |
| GET | `/api/families/:id` | Get family details |
| PUT | `/api/families/:id` | Update family |
| POST | `/api/families/:id/invite` | Invite member |
| DELETE | `/api/families/:id/members/:memberId` | Remove member |

### Children

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/families/:familyId/children` | List children |
| POST | `/api/families/:familyId/children` | Add child |
| PUT | `/api/children/:id` | Update child |
| DELETE | `/api/children/:id` | Remove child |

### Destinations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/families/:familyId/destinations` | List destinations |
| POST | `/api/families/:familyId/destinations` | Add destination |
| PUT | `/api/destinations/:id` | Update destination |
| DELETE | `/api/destinations/:id` | Remove destination |

### Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Start session (CHECK_IN) |
| GET | `/api/sessions/:id` | Get session with stops |
| PATCH | `/api/sessions/:id/state` | Transition state |
| POST | `/api/sessions/:id/end` | End session |
| GET | `/api/families/:familyId/sessions` | Session history |

### Stops & Confirmations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions/:sessionId/stops` | Record stop |
| POST | `/api/stops/:stopId/confirm` | Confirm with type |
| POST | `/api/stops/:stopId/photo` | Upload confirmation photo |

### Alerts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/families/:familyId/alerts` | List alerts |
| POST | `/api/alerts/:id/resolve` | Resolve alert |
| DELETE | `/api/alerts/:id` | Dismiss alert |

### Realtime

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sse?familyId=:id` | SSE stream for family events |

### Heartbeat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions/:id/heartbeat` | Location ping from mobile app |

---

## 6. Security Model

### Authentication

- **Better Auth** handles session management, password hashing (bcrypt), and CSRF protection.
- Sessions use HTTP-only secure cookies (web) and secure token storage (mobile via expo-secure-store).
- Password reset via email with time-limited tokens.

### Authorization

- All API endpoints verify the authenticated user belongs to the requested family.
- Role-based access: `owner` can delete family/children, `admin` can manage sessions, `member` can view only.
- Caregivers can only view sessions and resolve alerts -- they cannot modify family data.

### Data Protection

- All traffic over HTTPS (TLS 1.3).
- Photos encrypted at rest on DO Spaces (server-side encryption).
- Database connections use SSL.
- No PII in URL parameters -- all sensitive data in request bodies.

### Photo Privacy

- Photos are accessible only to authenticated family members.
- Signed URLs with 1-hour expiry for photo access.
- Automatic deletion based on subscription tier (24h free, 30d paid).
- No photos are used for ML training or shared with third parties.

### Mobile Security

- Expo Secure Store for token storage (Keychain on iOS, Keystore on Android).
- Certificate pinning planned for production.
- Background location requires "Always" permission with clear disclosure.

---

## 7. Deployment Architecture

```
+-------------------+     +-------------------+     +------------------+
|  App Store (iOS)  |     | Play Store (Droid) |     | Vercel (Web)     |
|                   |     |                    |     |                  |
|  Built via        |     | Built via          |     | Auto-deploy from |
|  EAS Build        |     | EAS Build          |     | git push         |
+-------------------+     +-------------------+     +------------------+
                                                            |
                                                            v
+------------------------------------------------------------------+
|                    Vercel Edge Network                            |
|                                                                   |
|  Next.js 15 (Web Portal + API Routes)                            |
|  - Static pages: ISR / SSG                                       |
|  - API routes: Serverless functions                              |
|  - SSE: Edge runtime                                             |
+------------------------------------------------------------------+
                          |
                          v
+------------------------------------------------------------------+
|              DigitalOcean ($6/mo Droplet)                        |
|                                                                   |
|  +---------------------------+  +------------------------------+ |
|  |  PostgreSQL 16            |  |  DO Spaces (S3-compatible)   | |
|  |  (on same droplet)        |  |  (photo storage)             | |
|  +---------------------------+  +------------------------------+ |
|                                                                   |
|  Alternative: Managed DB ($15/mo) for production at scale         |
+------------------------------------------------------------------+
```

### Environments

| Environment | Infrastructure | Cost |
|-------------|---------------|------|
| Development | Local machine (Expo dev server + SQLite or local PostgreSQL) | $0/mo |
| Staging | Vercel preview deployments + shared DO droplet | $0/mo (included) |
| Production | Vercel Pro + DO $6 droplet + DO Spaces | ~$26/mo |

### CI/CD Pipeline

1. Push to `main` branch triggers Vercel deployment (web portal + API).
2. EAS Build triggered manually or via GitHub Actions for mobile releases.
3. Database migrations run via `drizzle-kit push` as part of deploy script.
4. OTA updates for mobile via `expo-updates` (bypasses app store review for JS-only changes).

---

## 8. Cost Breakdown

### Development Phase ($0/month)

| Service | Cost | Notes |
|---------|------|-------|
| Expo CLI + SDK | Free | Open source |
| React Native | Free | Open source |
| Next.js | Free | Open source |
| Better Auth | Free | Open source |
| Drizzle ORM | Free | Open source |
| PostgreSQL (local) | Free | Local development |
| Vercel (Hobby) | Free | Preview deployments |
| GitHub | Free | Public or private repos |
| Expo Push | Free | Unlimited notifications |
| **Total** | **$0/mo** | |

### Production Phase (~$26/month)

| Service | Cost | Notes |
|---------|------|-------|
| DigitalOcean Droplet | $6/mo | 1 vCPU, 1GB RAM, 25GB SSD |
| DO Spaces | $5/mo | 250GB storage, CDN included |
| Vercel Pro | $20/mo | Custom domain, more bandwidth |
| Expo Push | Free | Unlimited |
| Domain name | ~$12/yr | (~$1/mo) |
| SSL Certificate | Free | Let's Encrypt via Vercel/DO |
| **Total** | **~$32/mo** | |

### Scaling Thresholds

| Milestone | Action | New Cost |
|-----------|--------|----------|
| 1,000 users | Stay on current infrastructure | $32/mo |
| 10,000 users | Upgrade droplet to $12/mo, add managed DB ($15/mo) | ~$52/mo |
| 100,000 users | Move to DO App Platform or dedicated VPS cluster | ~$150/mo |
| 1M+ users | Multi-region deployment, dedicated DB cluster | ~$500/mo |

### App Store Fees

| Store | Fee | Notes |
|-------|-----|-------|
| Apple Developer Program | $99/yr | Required for App Store distribution |
| Google Play Developer | $25 one-time | Required for Play Store distribution |

### Revenue Offset

At $0.99/month subscription:
- 100 paid users = $99/mo revenue (covers all infrastructure)
- 1,000 paid users = $990/mo revenue
- 10,000 paid users = $9,900/mo revenue

Break-even point: approximately 33 paid subscribers.
