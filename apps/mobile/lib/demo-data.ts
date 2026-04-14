import type {
  User,
  Family,
  FamilyMember,
  Child,
  Destination,
  Session,
  Alert,
} from './types';
import { SessionState } from './types';
import type { AppState, CaregiverEntry, SettingsState } from './store';

// ─── Helpers ───────────────────────────────────────────────────────────────

function daysAgo(n: number, hour = 8, min = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

// ─── Demo User ─────────────────────────────────────────────────────────────

const demoUser: User = {
  id: 'user-1',
  email: 'sarah@safestop.com',
  displayName: 'Sarah Johnson',
  phone: '+1 555-0123',
  createdAt: '2026-01-15T08:00:00Z',
  updatedAt: daysAgo(0),
};

// ─── Demo Family Members ───────────────────────────────────────────────────

const demoMembers: FamilyMember[] = [
  {
    id: 'member-1',
    userId: 'user-1',
    familyId: 'family-1',
    role: 'owner',
    displayName: 'Sarah Johnson',
    email: 'sarah@safestop.com',
    joinedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'member-2',
    userId: 'user-2',
    familyId: 'family-1',
    role: 'admin',
    displayName: 'Mike Johnson',
    email: 'mike@safestop.com',
    joinedAt: '2026-01-16T09:30:00Z',
  },
];

// ─── Demo Children ─────────────────────────────────────────────────────────

const demoChildren: Child[] = [
  {
    id: 'child-1',
    familyId: 'family-1',
    name: 'Emma',
    dateOfBirth: '2022-03-12',
    notes: 'Rear-facing car seat, pink jacket',
    createdAt: '2026-01-15T08:30:00Z',
  },
  {
    id: 'child-2',
    familyId: 'family-1',
    name: 'Liam',
    dateOfBirth: '2024-07-04',
    notes: 'Forward-facing car seat',
    createdAt: '2026-01-15T08:35:00Z',
  },
];

// ─── Demo Destinations ─────────────────────────────────────────────────────

const demoDestinations: Destination[] = [
  {
    id: 'dest-1',
    familyId: 'family-1',
    name: 'Bright Horizons Daycare',
    address: '456 Elm Avenue, Springfield, IL',
    latitude: 39.79,
    longitude: -89.644,
    radius: 75,
    isDefault: true,
    createdAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 'dest-2',
    familyId: 'family-1',
    name: 'Sunnyvale Elementary',
    address: '321 School Road, Springfield, IL',
    latitude: 39.785,
    longitude: -89.655,
    radius: 100,
    isDefault: false,
    createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'dest-3',
    familyId: 'family-1',
    name: "Grandma's House",
    address: '789 Maple Drive, Springfield, IL',
    latitude: 39.775,
    longitude: -89.66,
    radius: 100,
    isDefault: false,
    createdAt: '2026-02-01T14:00:00Z',
  },
];

// ─── Demo Family ───────────────────────────────────────────────────────────

const demoFamily: Family = {
  id: 'family-1',
  name: 'Johnson Family',
  ownerId: 'user-1',
  members: demoMembers,
  children: demoChildren,
  destinations: demoDestinations,
  createdAt: '2026-01-15T08:00:00Z',
};

// ─── Demo Caregivers ───────────────────────────────────────────────────────

const demoCaregivers: CaregiverEntry[] = [
  {
    id: 'caregiver-1',
    userId: 'user-2',
    name: 'Mike Johnson',
    email: 'mike@safestop.com',
    phone: '+1 555-0456',
    role: 'primary_caregiver',
    avatarUrl: undefined,
  },
  {
    id: 'caregiver-2',
    userId: 'user-3',
    name: 'Linda Johnson',
    email: 'linda@safestop.com',
    phone: '+1 555-0789',
    role: 'viewer',
    avatarUrl: undefined,
  },
];

// ─── Demo Session History ──────────────────────────────────────────────────

const demoHistory: Session[] = [
  {
    id: 'session-h1',
    familyId: 'family-1',
    driverId: 'user-1',
    childId: 'child-1',
    destinationId: 'dest-1',
    state: SessionState.CONFIRMED_SAFE,
    startedAt: daysAgo(0, 7, 45),
    endedAt: daysAgo(0, 8, 15),
    stops: [
      {
        id: 'stop-h1',
        sessionId: 'session-h1',
        latitude: 39.79,
        longitude: -89.644,
        detectedAt: daysAgo(0, 8, 10),
        destinationId: 'dest-1',
        confirmation: {
          id: 'conf-h1',
          stopId: 'stop-h1',
          type: 'photo',
          confirmedBy: 'user-1',
          confirmedAt: daysAgo(0, 8, 12),
        },
      },
    ],
  },
  {
    id: 'session-h2',
    familyId: 'family-1',
    driverId: 'user-2',
    childId: 'child-2',
    destinationId: 'dest-1',
    state: SessionState.CONFIRMED_SAFE,
    startedAt: daysAgo(1, 7, 50),
    endedAt: daysAgo(1, 8, 20),
    stops: [
      {
        id: 'stop-h2',
        sessionId: 'session-h2',
        latitude: 39.79,
        longitude: -89.644,
        detectedAt: daysAgo(1, 8, 15),
        destinationId: 'dest-1',
        confirmation: {
          id: 'conf-h2',
          stopId: 'stop-h2',
          type: 'manual',
          confirmedBy: 'user-2',
          confirmedAt: daysAgo(1, 8, 16),
        },
      },
    ],
  },
  {
    id: 'session-h3',
    familyId: 'family-1',
    driverId: 'user-1',
    childId: 'child-1',
    destinationId: 'dest-3',
    state: SessionState.CONFIRMED_SAFE,
    startedAt: daysAgo(1, 16, 0),
    endedAt: daysAgo(1, 16, 30),
    stops: [
      {
        id: 'stop-h3',
        sessionId: 'session-h3',
        latitude: 39.775,
        longitude: -89.66,
        detectedAt: daysAgo(1, 16, 25),
        destinationId: 'dest-3',
        confirmation: {
          id: 'conf-h3',
          stopId: 'stop-h3',
          type: 'photo',
          confirmedBy: 'user-1',
          confirmedAt: daysAgo(1, 16, 27),
        },
      },
    ],
  },
  {
    id: 'session-h4',
    familyId: 'family-1',
    driverId: 'user-1',
    childId: 'child-2',
    destinationId: 'dest-2',
    state: SessionState.CONFIRMED_SAFE,
    startedAt: daysAgo(2, 8, 0),
    endedAt: daysAgo(2, 8, 25),
    stops: [
      {
        id: 'stop-h4',
        sessionId: 'session-h4',
        latitude: 39.785,
        longitude: -89.655,
        detectedAt: daysAgo(2, 8, 20),
        destinationId: 'dest-2',
        confirmation: {
          id: 'conf-h4',
          stopId: 'stop-h4',
          type: 'auto',
          confirmedBy: 'user-1',
          confirmedAt: daysAgo(2, 8, 21),
        },
      },
    ],
  },
  {
    id: 'session-h5',
    familyId: 'family-1',
    driverId: 'user-2',
    childId: 'child-1',
    destinationId: 'dest-1',
    state: SessionState.ALERT_TRIGGERED,
    startedAt: daysAgo(3, 8, 0),
    endedAt: daysAgo(3, 8, 45),
    stops: [
      {
        id: 'stop-h5',
        sessionId: 'session-h5',
        latitude: 39.79,
        longitude: -89.644,
        detectedAt: daysAgo(3, 8, 30),
        destinationId: 'dest-1',
      },
    ],
  },
];

// ─── Demo Alerts ───────────────────────────────────────────────────────────

const demoAlerts: Alert[] = [
  {
    id: 'alert-1',
    sessionId: 'session-h5',
    familyId: 'family-1',
    childId: 'child-1',
    severity: 'high',
    message: 'Missed confirmation at Bright Horizons Daycare. Emma may still be in the vehicle.',
    triggeredAt: daysAgo(1, 8, 35),
  },
];

// ─── Demo Settings ─────────────────────────────────────────────────────────

const demoSettings: SettingsState = {
  autoCheckin: false,
  photoOptional: false,
  notificationSounds: true,
  darkMode: false,
  confirmationTimeout: 120,
};

// ─── Full Demo State ───────────────────────────────────────────────────────

export function createDemoData(): AppState {
  return {
    auth: {
      isLoggedIn: true,
      user: demoUser,
      family: demoFamily,
    },
    children: demoChildren,
    destinations: demoDestinations,
    caregivers: demoCaregivers,
    session: null,
    history: demoHistory,
    alerts: demoAlerts,
    settings: demoSettings,
  };
}
