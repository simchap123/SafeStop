// Session State Machine Types & Mock Transitions

export type SessionState =
  | 'NO_SESSION'
  | 'CHILD_SESSION_ACTIVE'
  | 'STOP_PENDING_CONFIRMATION'
  | 'SESSION_SAFE_CONFIRMED'
  | 'SESSION_RISK_UNCONFIRMED'
  | 'SESSION_ENDED';

export interface Child {
  id: string;
  name: string;
  age: number;
  initials: string;
  color: string;
}

export interface StopConfirmation {
  id: string;
  timestamp: number;
  photoUri?: string;
  confirmed: boolean;
  childId: string;
}

export interface SessionContext {
  state: SessionState;
  children: Child[];
  selectedChildIds: string[];
  startTime: number | null;
  location: string;
  stops: { id: string; timestamp: number; location: string }[];
  confirmations: StopConfirmation[];
}

export const MOCK_CHILDREN: Child[] = [
  { id: '1', name: 'Emma', age: 4, initials: 'EM', color: '#818CF8' },
  { id: '2', name: 'Liam', age: 2, initials: 'LI', color: '#22C55E' },
  { id: '3', name: 'Sophia', age: 6, initials: 'SO', color: '#F59E0B' },
];

export function createInitialSession(): SessionContext {
  return {
    state: 'NO_SESSION',
    children: MOCK_CHILDREN,
    selectedChildIds: [],
    startTime: null,
    location: '',
    stops: [],
    confirmations: [],
  };
}

// Mock transition functions
export function startSession(ctx: SessionContext, selectedIds: string[], location: string): SessionContext {
  return {
    ...ctx,
    state: 'CHILD_SESSION_ACTIVE',
    selectedChildIds: selectedIds,
    startTime: Date.now(),
    location,
  };
}

export function detectStop(ctx: SessionContext): SessionContext {
  const stop = {
    id: String(ctx.stops.length + 1),
    timestamp: Date.now(),
    location: 'Current Location',
  };
  return {
    ...ctx,
    state: 'STOP_PENDING_CONFIRMATION',
    stops: [...ctx.stops, stop],
  };
}

export function confirmSafe(ctx: SessionContext, photoUri?: string): SessionContext {
  const confirmation: StopConfirmation = {
    id: String(ctx.confirmations.length + 1),
    timestamp: Date.now(),
    photoUri,
    confirmed: true,
    childId: ctx.selectedChildIds[0] ?? '',
  };
  return {
    ...ctx,
    state: 'SESSION_SAFE_CONFIRMED',
    confirmations: [...ctx.confirmations, confirmation],
  };
}

export function markUnconfirmed(ctx: SessionContext): SessionContext {
  return {
    ...ctx,
    state: 'SESSION_RISK_UNCONFIRMED',
  };
}

export function endSession(ctx: SessionContext): SessionContext {
  return {
    ...ctx,
    state: 'SESSION_ENDED',
    startTime: null,
    selectedChildIds: [],
  };
}

export function resetSession(): SessionContext {
  return createInitialSession();
}
