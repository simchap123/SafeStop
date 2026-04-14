// ─── Enums ──────────────────────────────────────────────────────────────────

export enum SessionState {
  IDLE = 'idle',
  DRIVING = 'driving',
  STOP_DETECTED = 'stop_detected',
  AWAITING_CONFIRMATION = 'awaiting_confirmation',
  CONFIRMED_SAFE = 'confirmed_safe',
  ALERT_TRIGGERED = 'alert_triggered',
  ESCALATED = 'escalated',
}

export type ConfirmationType = 'photo' | 'manual' | 'auto' | 'co_parent';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type SubscriptionTier = 'free' | 'basic' | 'premium';

export type FamilyRole = 'owner' | 'admin' | 'member';

// ─── Core Models ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Family {
  id: string;
  name: string;
  ownerId: string;
  members: FamilyMember[];
  children: Child[];
  destinations: Destination[];
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  familyId: string;
  role: FamilyRole;
  displayName: string;
  email: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface Child {
  id: string;
  familyId: string;
  name: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface Destination {
  id: string;
  familyId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number; // geofence radius in meters
  isDefault: boolean;
  createdAt: string;
}

export interface Session {
  id: string;
  familyId: string;
  driverId: string;
  childId: string;
  destinationId?: string;
  state: SessionState;
  startedAt: string;
  endedAt?: string;
  stops: Stop[];
}

export interface Stop {
  id: string;
  sessionId: string;
  latitude: number;
  longitude: number;
  detectedAt: string;
  destinationId?: string;
  confirmation?: Confirmation;
}

export interface Confirmation {
  id: string;
  stopId: string;
  type: ConfirmationType;
  confirmedBy: string; // user id
  photo?: Photo;
  confirmedAt: string;
}

export interface Photo {
  id: string;
  confirmationId: string;
  uri: string;
  takenAt: string;
}

export interface Alert {
  id: string;
  sessionId: string;
  familyId: string;
  childId: string;
  severity: AlertSeverity;
  message: string;
  triggeredAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface NotificationEvent {
  id: string;
  userId: string;
  type: 'stop_detected' | 'confirmation_needed' | 'alert' | 'escalation' | 'session_started' | 'session_ended';
  title: string;
  body: string;
  data?: Record<string, string>;
  read: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  familyId: string;
  tier: SubscriptionTier;
  maxChildren: number;
  maxDestinations: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}
