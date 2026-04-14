import {
  User,
  Family,
  FamilyMember,
  Child,
  Destination,
  Session,
  Stop,
  Alert,
  NotificationEvent,
  Subscription,
  SessionState,
} from './types';

// ─── Mock User ──────────────────────────────────────────────────────────────

export const mockUser: User = {
  id: 'user-1',
  email: 'sarah@example.com',
  displayName: 'Sarah Johnson',
  phone: '+1 555-0123',
  createdAt: '2026-01-15T08:00:00Z',
  updatedAt: '2026-04-10T12:00:00Z',
};

// ─── Mock Family Members ────────────────────────────────────────────────────

export const mockMembers: FamilyMember[] = [
  {
    id: 'member-1',
    userId: 'user-1',
    familyId: 'family-1',
    role: 'owner',
    displayName: 'Sarah Johnson',
    email: 'sarah@example.com',
    joinedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'member-2',
    userId: 'user-2',
    familyId: 'family-1',
    role: 'admin',
    displayName: 'Mike Johnson',
    email: 'mike@example.com',
    joinedAt: '2026-01-16T09:30:00Z',
  },
];

// ─── Mock Children ──────────────────────────────────────────────────────────

export const mockChildren: Child[] = [
  {
    id: 'child-1',
    familyId: 'family-1',
    name: 'Emma',
    dateOfBirth: '2022-03-12',
    notes: 'Rear-facing car seat',
    createdAt: '2026-01-15T08:30:00Z',
  },
  {
    id: 'child-2',
    familyId: 'family-1',
    name: 'Liam',
    dateOfBirth: '2020-07-04',
    notes: 'Forward-facing car seat',
    createdAt: '2026-01-15T08:35:00Z',
  },
];

// ─── Mock Destinations ──────────────────────────────────────────────────────

export const mockDestinations: Destination[] = [
  {
    id: 'dest-1',
    familyId: 'family-1',
    name: 'Home',
    address: '123 Oak Street, Springfield, IL',
    latitude: 39.7817,
    longitude: -89.6501,
    radius: 100,
    isDefault: true,
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'dest-2',
    familyId: 'family-1',
    name: 'Daycare',
    address: '456 Elm Avenue, Springfield, IL',
    latitude: 39.7900,
    longitude: -89.6440,
    radius: 75,
    isDefault: false,
    createdAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 'dest-3',
    familyId: 'family-1',
    name: "Grandma's House",
    address: '789 Maple Drive, Springfield, IL',
    latitude: 39.7750,
    longitude: -89.6600,
    radius: 100,
    isDefault: false,
    createdAt: '2026-02-01T14:00:00Z',
  },
];

// ─── Mock Family ────────────────────────────────────────────────────────────

export const mockFamily: Family = {
  id: 'family-1',
  name: 'Johnson Family',
  ownerId: 'user-1',
  members: mockMembers,
  children: mockChildren,
  destinations: mockDestinations,
  createdAt: '2026-01-15T08:00:00Z',
};

// ─── Mock Stops ─────────────────────────────────────────────────────────────

export const mockStops: Stop[] = [
  {
    id: 'stop-1',
    sessionId: 'session-1',
    latitude: 39.7900,
    longitude: -89.6440,
    detectedAt: '2026-04-14T08:25:00Z',
    destinationId: 'dest-2',
    confirmation: {
      id: 'conf-1',
      stopId: 'stop-1',
      type: 'photo',
      confirmedBy: 'user-1',
      photo: {
        id: 'photo-1',
        confirmationId: 'conf-1',
        uri: 'https://example.com/photo1.jpg',
        takenAt: '2026-04-14T08:26:00Z',
      },
      confirmedAt: '2026-04-14T08:26:00Z',
    },
  },
  {
    id: 'stop-2',
    sessionId: 'session-2',
    latitude: 39.7817,
    longitude: -89.6501,
    detectedAt: '2026-04-14T17:45:00Z',
    destinationId: 'dest-1',
    confirmation: {
      id: 'conf-2',
      stopId: 'stop-2',
      type: 'manual',
      confirmedBy: 'user-1',
      confirmedAt: '2026-04-14T17:46:00Z',
    },
  },
];

// ─── Mock Sessions ──────────────────────────────────────────────────────────

export const mockSessions: Session[] = [
  {
    id: 'session-1',
    familyId: 'family-1',
    driverId: 'user-1',
    childId: 'child-1',
    destinationId: 'dest-2',
    state: SessionState.CONFIRMED_SAFE,
    startedAt: '2026-04-14T08:00:00Z',
    endedAt: '2026-04-14T08:30:00Z',
    stops: [mockStops[0]],
  },
  {
    id: 'session-2',
    familyId: 'family-1',
    driverId: 'user-1',
    childId: 'child-2',
    state: SessionState.DRIVING,
    startedAt: '2026-04-14T17:00:00Z',
    stops: [],
  },
];

// ─── Mock Alerts ────────────────────────────────────────────────────────────

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    sessionId: 'session-old',
    familyId: 'family-1',
    childId: 'child-1',
    severity: 'high',
    message: 'Confirmation timeout expired. No response from driver.',
    triggeredAt: '2026-04-12T09:15:00Z',
    resolvedAt: '2026-04-12T09:18:00Z',
    resolvedBy: 'user-2',
  },
  {
    id: 'alert-2',
    sessionId: 'session-old-2',
    familyId: 'family-1',
    childId: 'child-2',
    severity: 'medium',
    message: 'Stop detected at unknown location.',
    triggeredAt: '2026-04-13T14:30:00Z',
  },
];

// ─── Mock Notifications ─────────────────────────────────────────────────────

export const mockNotifications: NotificationEvent[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'stop_detected',
    title: 'Vehicle Stopped',
    body: 'Your vehicle stopped near Daycare. Please confirm Emma is safe.',
    read: true,
    createdAt: '2026-04-14T08:25:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'session_started',
    title: 'Trip Started',
    body: 'A new trip has started with Liam.',
    read: false,
    createdAt: '2026-04-14T17:00:00Z',
  },
];

// ─── Mock Subscription ──────────────────────────────────────────────────────

export const mockSubscription: Subscription = {
  id: 'sub-1',
  familyId: 'family-1',
  tier: 'basic',
  maxChildren: 3,
  maxDestinations: 10,
  isActive: true,
  expiresAt: '2027-01-15T08:00:00Z',
  createdAt: '2026-01-15T08:00:00Z',
};
