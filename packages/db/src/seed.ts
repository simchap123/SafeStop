import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// ─── Helpers ────────────────────────────────────────────────────────────────

function daysAgo(n: number, hour = 8, min = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, min, 0, 0);
  return d;
}

// ─── Deterministic UUIDs for demo data ──────────────────────────────────────
// Using v4-style UUIDs with fixed values so seed is idempotent

const IDS = {
  // Users
  user1: '00000000-0000-4000-a000-000000000001',
  user2: '00000000-0000-4000-a000-000000000002',
  user3: '00000000-0000-4000-a000-000000000003',

  // Family
  family1: '00000000-0000-4000-b000-000000000001',

  // Family members
  member1: '00000000-0000-4000-c000-000000000001',
  member2: '00000000-0000-4000-c000-000000000002',

  // Children
  child1: '00000000-0000-4000-d000-000000000001',
  child2: '00000000-0000-4000-d000-000000000002',

  // Destinations
  dest1: '00000000-0000-4000-e000-000000000001',
  dest2: '00000000-0000-4000-e000-000000000002',
  dest3: '00000000-0000-4000-e000-000000000003',

  // Sessions
  sessionH1: '00000000-0000-4000-f000-000000000001',
  sessionH2: '00000000-0000-4000-f000-000000000002',
  sessionH3: '00000000-0000-4000-f000-000000000003',
  sessionH4: '00000000-0000-4000-f000-000000000004',
  sessionH5: '00000000-0000-4000-f000-000000000005',

  // Stops
  stopH1: '00000000-0000-4000-f100-000000000001',
  stopH2: '00000000-0000-4000-f100-000000000002',
  stopH3: '00000000-0000-4000-f100-000000000003',
  stopH4: '00000000-0000-4000-f100-000000000004',
  stopH5: '00000000-0000-4000-f100-000000000005',

  // Confirmations
  confH1: '00000000-0000-4000-f200-000000000001',
  confH2: '00000000-0000-4000-f200-000000000002',
  confH3: '00000000-0000-4000-f200-000000000003',
  confH4: '00000000-0000-4000-f200-000000000004',

  // Alerts
  alert1: '00000000-0000-4000-f300-000000000001',

  // Subscription
  sub1: '00000000-0000-4000-f400-000000000001',
} as const;

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  console.log('Seeding database...');

  // ─── Users ──────────────────────────────────────────────────────────────

  await db.insert(schema.users).values([
    {
      id: IDS.user1,
      email: 'sarah@safestop.com',
      displayName: 'Sarah Johnson',
      phone: '+1 555-0123',
      createdAt: new Date('2026-01-15T08:00:00Z'),
      updatedAt: daysAgo(0),
    },
    {
      id: IDS.user2,
      email: 'mike@safestop.com',
      displayName: 'Mike Johnson',
      phone: '+1 555-0456',
      createdAt: new Date('2026-01-16T09:00:00Z'),
      updatedAt: daysAgo(0),
    },
    {
      id: IDS.user3,
      email: 'linda@safestop.com',
      displayName: 'Linda Johnson',
      phone: '+1 555-0789',
      createdAt: new Date('2026-02-01T10:00:00Z'),
      updatedAt: daysAgo(0),
    },
  ]);

  // ─── Family ─────────────────────────────────────────────────────────────

  await db.insert(schema.families).values({
    id: IDS.family1,
    name: 'Johnson Family',
    ownerId: IDS.user1,
    inviteCode: 'JOHNSON2026',
    createdAt: new Date('2026-01-15T08:00:00Z'),
  });

  // ─── Family Members ─────────────────────────────────────────────────────

  await db.insert(schema.familyMembers).values([
    {
      id: IDS.member1,
      userId: IDS.user1,
      familyId: IDS.family1,
      role: 'owner',
      displayName: 'Sarah Johnson',
      email: 'sarah@safestop.com',
      joinedAt: new Date('2026-01-15T08:00:00Z'),
    },
    {
      id: IDS.member2,
      userId: IDS.user2,
      familyId: IDS.family1,
      role: 'admin',
      displayName: 'Mike Johnson',
      email: 'mike@safestop.com',
      joinedAt: new Date('2026-01-16T09:30:00Z'),
    },
  ]);

  // ─── Children ───────────────────────────────────────────────────────────

  await db.insert(schema.children).values([
    {
      id: IDS.child1,
      familyId: IDS.family1,
      name: 'Emma',
      dateOfBirth: '2022-03-12',
      notes: 'Rear-facing car seat, pink jacket',
      createdAt: new Date('2026-01-15T08:30:00Z'),
    },
    {
      id: IDS.child2,
      familyId: IDS.family1,
      name: 'Liam',
      dateOfBirth: '2024-07-04',
      notes: 'Forward-facing car seat',
      createdAt: new Date('2026-01-15T08:35:00Z'),
    },
  ]);

  // ─── Destinations ──────────────────────────────────────────────────────

  await db.insert(schema.destinations).values([
    {
      id: IDS.dest1,
      familyId: IDS.family1,
      name: 'Bright Horizons Daycare',
      address: '456 Elm Avenue, Springfield, IL',
      latitude: 39.79,
      longitude: -89.644,
      radius: 75,
      isDefault: true,
      createdAt: new Date('2026-01-16T10:00:00Z'),
    },
    {
      id: IDS.dest2,
      familyId: IDS.family1,
      name: 'Sunnyvale Elementary',
      address: '321 School Road, Springfield, IL',
      latitude: 39.785,
      longitude: -89.655,
      radius: 100,
      isDefault: false,
      createdAt: new Date('2026-02-01T09:00:00Z'),
    },
    {
      id: IDS.dest3,
      familyId: IDS.family1,
      name: "Grandma's House",
      address: '789 Maple Drive, Springfield, IL',
      latitude: 39.775,
      longitude: -89.66,
      radius: 100,
      isDefault: false,
      createdAt: new Date('2026-02-01T14:00:00Z'),
    },
  ]);

  // ─── Sessions ──────────────────────────────────────────────────────────

  await db.insert(schema.sessions).values([
    {
      id: IDS.sessionH1,
      familyId: IDS.family1,
      driverId: IDS.user1,
      childId: IDS.child1,
      destinationId: IDS.dest1,
      state: 'confirmed_safe',
      startedAt: daysAgo(0, 7, 45),
      endedAt: daysAgo(0, 8, 15),
    },
    {
      id: IDS.sessionH2,
      familyId: IDS.family1,
      driverId: IDS.user2,
      childId: IDS.child2,
      destinationId: IDS.dest1,
      state: 'confirmed_safe',
      startedAt: daysAgo(1, 7, 50),
      endedAt: daysAgo(1, 8, 20),
    },
    {
      id: IDS.sessionH3,
      familyId: IDS.family1,
      driverId: IDS.user1,
      childId: IDS.child1,
      destinationId: IDS.dest3,
      state: 'confirmed_safe',
      startedAt: daysAgo(1, 16, 0),
      endedAt: daysAgo(1, 16, 30),
    },
    {
      id: IDS.sessionH4,
      familyId: IDS.family1,
      driverId: IDS.user1,
      childId: IDS.child2,
      destinationId: IDS.dest2,
      state: 'confirmed_safe',
      startedAt: daysAgo(2, 8, 0),
      endedAt: daysAgo(2, 8, 25),
    },
    {
      id: IDS.sessionH5,
      familyId: IDS.family1,
      driverId: IDS.user2,
      childId: IDS.child1,
      destinationId: IDS.dest1,
      state: 'alert_triggered',
      startedAt: daysAgo(3, 8, 0),
      endedAt: daysAgo(3, 8, 45),
    },
  ]);

  // ─── Stops ─────────────────────────────────────────────────────────────

  await db.insert(schema.stops).values([
    {
      id: IDS.stopH1,
      sessionId: IDS.sessionH1,
      latitude: 39.79,
      longitude: -89.644,
      detectedAt: daysAgo(0, 8, 10),
      destinationId: IDS.dest1,
    },
    {
      id: IDS.stopH2,
      sessionId: IDS.sessionH2,
      latitude: 39.79,
      longitude: -89.644,
      detectedAt: daysAgo(1, 8, 15),
      destinationId: IDS.dest1,
    },
    {
      id: IDS.stopH3,
      sessionId: IDS.sessionH3,
      latitude: 39.775,
      longitude: -89.66,
      detectedAt: daysAgo(1, 16, 25),
      destinationId: IDS.dest3,
    },
    {
      id: IDS.stopH4,
      sessionId: IDS.sessionH4,
      latitude: 39.785,
      longitude: -89.655,
      detectedAt: daysAgo(2, 8, 20),
      destinationId: IDS.dest2,
    },
    {
      id: IDS.stopH5,
      sessionId: IDS.sessionH5,
      latitude: 39.79,
      longitude: -89.644,
      detectedAt: daysAgo(3, 8, 30),
      destinationId: IDS.dest1,
    },
  ]);

  // ─── Confirmations ────────────────────────────────────────────────────

  await db.insert(schema.confirmations).values([
    {
      id: IDS.confH1,
      stopId: IDS.stopH1,
      type: 'photo',
      confirmedBy: IDS.user1,
      confirmedAt: daysAgo(0, 8, 12),
    },
    {
      id: IDS.confH2,
      stopId: IDS.stopH2,
      type: 'manual',
      confirmedBy: IDS.user2,
      confirmedAt: daysAgo(1, 8, 16),
    },
    {
      id: IDS.confH3,
      stopId: IDS.stopH3,
      type: 'photo',
      confirmedBy: IDS.user1,
      confirmedAt: daysAgo(1, 16, 27),
    },
    {
      id: IDS.confH4,
      stopId: IDS.stopH4,
      type: 'auto',
      confirmedBy: IDS.user1,
      confirmedAt: daysAgo(2, 8, 21),
    },
  ]);

  // ─── Alerts ────────────────────────────────────────────────────────────

  await db.insert(schema.alerts).values({
    id: IDS.alert1,
    sessionId: IDS.sessionH5,
    familyId: IDS.family1,
    childId: IDS.child1,
    severity: 'high',
    message:
      'Missed confirmation at Bright Horizons Daycare. Emma may still be in the vehicle.',
    triggeredAt: daysAgo(1, 8, 35),
  });

  // ─── Subscription ─────────────────────────────────────────────────────

  await db.insert(schema.subscriptions).values({
    id: IDS.sub1,
    familyId: IDS.family1,
    tier: 'free',
    maxChildren: 2,
    maxDestinations: 3,
    isActive: true,
    createdAt: new Date('2026-01-15T08:00:00Z'),
  });

  console.log('Seed complete.');
  await client.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
