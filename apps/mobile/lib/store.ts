import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import type { User, Family, Child, Destination, Session, Alert } from './types';
import { getItem, setItem, clear as clearStorage } from './storage';
import { createDemoData } from './demo-data';

// ─── Storage Key ───────────────────────────────────────────────────────────

const STORAGE_KEY = 'safestop:app-state';

// ─── State Shape ───────────────────────────────────────────────────────────

export interface CaregiverEntry {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: 'primary_caregiver' | 'co_parent' | 'viewer';
  avatarUrl?: string;
}

export interface SettingsState {
  autoCheckin: boolean;
  photoOptional: boolean;
  notificationSounds: boolean;
  darkMode: boolean;
  confirmationTimeout: number; // seconds
}

export interface AuthState {
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  user: User | null;
  family: Family | null;
}

export interface AppState {
  auth: AuthState;
  children: Child[];
  destinations: Destination[];
  caregivers: CaregiverEntry[];
  session: Session | null;
  history: Session[];
  alerts: Alert[];
  settings: SettingsState;
}

// ─── Default State ─────────────────────────────────────────────────────────

const defaultSettings: SettingsState = {
  autoCheckin: false,
  photoOptional: false,
  notificationSounds: true,
  darkMode: false,
  confirmationTimeout: 120,
};

export const initialState: AppState = {
  auth: { isLoggedIn: false, isAuthenticated: false, user: null, family: null },
  children: [],
  destinations: [],
  caregivers: [],
  session: null,
  history: [],
  alerts: [],
  settings: defaultSettings,
};

// ─── Actions ───────────────────────────────────────────────────────────────

export type AppAction =
  // Hydration
  | { type: 'HYDRATE'; payload: AppState }
  // Auth
  | { type: 'LOGIN'; payload: { user: User; family: Family } }
  | { type: 'LOGOUT' }
  | { type: 'SET_AUTH'; payload: { user: User; isAuthenticated: boolean } }
  | { type: 'SIGN_OUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  // Children
  | { type: 'SET_CHILDREN'; payload: Child[] }
  | { type: 'ADD_CHILD'; payload: Child }
  | { type: 'UPDATE_CHILD'; payload: Child }
  | { type: 'REMOVE_CHILD'; payload: string }
  // Destinations
  | { type: 'SET_DESTINATIONS'; payload: Destination[] }
  | { type: 'ADD_DESTINATION'; payload: Destination }
  | { type: 'UPDATE_DESTINATION'; payload: Destination }
  | { type: 'REMOVE_DESTINATION'; payload: string }
  // Caregivers
  | { type: 'SET_CAREGIVERS'; payload: CaregiverEntry[] }
  | { type: 'ADD_CAREGIVER'; payload: CaregiverEntry }
  | { type: 'UPDATE_CAREGIVER'; payload: CaregiverEntry }
  | { type: 'REMOVE_CAREGIVER'; payload: string }
  // Session
  | { type: 'START_SESSION'; payload: Session }
  | { type: 'UPDATE_SESSION'; payload: Partial<Session> }
  | { type: 'END_SESSION' }
  // History
  | { type: 'ADD_HISTORY'; payload: Session }
  | { type: 'CLEAR_HISTORY' }
  // Alerts
  | { type: 'SET_ALERTS'; payload: Alert[] }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'RESOLVE_ALERT'; payload: { id: string; resolvedBy: string } }
  | { type: 'DISMISS_ALERT'; payload: string }
  // Settings
  | { type: 'UPDATE_SETTINGS'; payload: Partial<SettingsState> }
  // API data loading
  | { type: 'LOAD_API_DATA'; payload: { family?: any; children?: any[]; destinations?: any[]; caregivers?: CaregiverEntry[]; alerts?: any[] } }
  // Reset
  | { type: 'RESET_TO_DEMO' }
  | { type: 'CLEAR_ALL' };

// ─── Reducer ───────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // Hydration
    case 'HYDRATE':
      return action.payload;

    // Auth
    case 'LOGIN':
      return {
        ...state,
        auth: { isLoggedIn: true, isAuthenticated: true, user: action.payload.user, family: action.payload.family },
      };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_AUTH':
      return {
        ...state,
        auth: {
          ...state.auth,
          user: action.payload.user,
          isLoggedIn: action.payload.isAuthenticated,
          isAuthenticated: action.payload.isAuthenticated,
        },
      };
    case 'SIGN_OUT': {
      clearStorage().catch(() => {});
      return { ...initialState };
    }
    case 'UPDATE_USER':
      return {
        ...state,
        auth: {
          ...state.auth,
          user: state.auth.user ? { ...state.auth.user, ...action.payload } : null,
        },
      };

    // Children
    case 'SET_CHILDREN':
      return { ...state, children: action.payload };
    case 'ADD_CHILD':
      return { ...state, children: [...state.children, action.payload] };
    case 'UPDATE_CHILD':
      return {
        ...state,
        children: state.children.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    case 'REMOVE_CHILD':
      return { ...state, children: state.children.filter((c) => c.id !== action.payload) };

    // Destinations
    case 'SET_DESTINATIONS':
      return { ...state, destinations: action.payload };
    case 'ADD_DESTINATION':
      return { ...state, destinations: [...state.destinations, action.payload] };
    case 'UPDATE_DESTINATION':
      return {
        ...state,
        destinations: state.destinations.map((d) =>
          d.id === action.payload.id ? action.payload : d,
        ),
      };
    case 'REMOVE_DESTINATION':
      return { ...state, destinations: state.destinations.filter((d) => d.id !== action.payload) };

    // Caregivers
    case 'SET_CAREGIVERS':
      return { ...state, caregivers: action.payload };
    case 'ADD_CAREGIVER':
      return { ...state, caregivers: [...state.caregivers, action.payload] };
    case 'UPDATE_CAREGIVER':
      return {
        ...state,
        caregivers: state.caregivers.map((c) =>
          c.id === action.payload.id ? action.payload : c,
        ),
      };
    case 'REMOVE_CAREGIVER':
      return { ...state, caregivers: state.caregivers.filter((c) => c.id !== action.payload) };

    // Session
    case 'START_SESSION':
      return { ...state, session: action.payload };
    case 'UPDATE_SESSION':
      return {
        ...state,
        session: state.session ? { ...state.session, ...action.payload } : null,
      };
    case 'END_SESSION': {
      const ended = state.session;
      return {
        ...state,
        session: null,
        history: ended ? [ended, ...state.history] : state.history,
      };
    }

    // History
    case 'ADD_HISTORY':
      return { ...state, history: [action.payload, ...state.history] };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };

    // Alerts
    case 'SET_ALERTS':
      return { ...state, alerts: action.payload };
    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...state.alerts] };
    case 'RESOLVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map((a) =>
          a.id === action.payload.id
            ? { ...a, resolvedAt: new Date().toISOString(), resolvedBy: action.payload.resolvedBy }
            : a,
        ),
      };
    case 'DISMISS_ALERT':
      return { ...state, alerts: state.alerts.filter((a) => a.id !== action.payload) };

    // Settings
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    // API data loading
    case 'LOAD_API_DATA': {
      const { family, children, destinations, caregivers, alerts } = action.payload;

      // Map API family to store Family type
      const mappedFamily: Family | null = family
        ? {
            id: family.id,
            name: family.name,
            ownerId: family.createdBy ?? '',
            members: [],
            children: [],
            destinations: [],
            createdAt: family.createdAt ?? '',
          }
        : state.auth.family;

      // Map API children (age) to store Child type (dateOfBirth)
      const mappedChildren: Child[] = (children ?? []).map((c: any) => ({
        id: c.id,
        familyId: c.familyId,
        name: c.name,
        dateOfBirth: '', // API provides age, not dateOfBirth
        avatarUrl: c.photoUrl ?? c.avatarUrl,
        notes: c.notes,
        createdAt: c.createdAt ?? '',
      }));

      // Map API destinations (flat lat/lng/radius) to store Destination type
      const mappedDestinations: Destination[] = (destinations ?? []).map((d: any) => ({
        id: d.id,
        familyId: d.familyId,
        name: d.name,
        address: d.address ?? '',
        latitude: Number(d.latitude) || 0,
        longitude: Number(d.longitude) || 0,
        radius: Number(d.radius) || 100,
        isDefault: d.isDefault ?? false,
        createdAt: d.createdAt ?? '',
      }));

      // Map API alerts
      const mappedAlerts: Alert[] = (alerts ?? []).map((a: any) => ({
        id: a.id,
        sessionId: a.sessionId ?? '',
        familyId: a.familyId ?? '',
        childId: a.childId ?? '',
        severity: a.severity ?? 'medium',
        message: a.message ?? '',
        triggeredAt: a.triggeredAt ?? a.createdAt ?? '',
        resolvedAt: a.resolvedAt,
        resolvedBy: a.resolvedBy,
      }));

      return {
        ...state,
        auth: {
          ...state.auth,
          family: mappedFamily,
        },
        children: mappedChildren,
        destinations: mappedDestinations,
        caregivers: caregivers ?? state.caregivers,
        alerts: mappedAlerts,
      };
    }

    // Reset
    case 'RESET_TO_DEMO':
      return createDemoData();
    case 'CLEAR_ALL':
      return { ...initialState };

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  isHydrated: boolean;
}

const AppContext = createContext<AppContextValue>({
  state: initialState,
  dispatch: () => {},
  isHydrated: false,
});

// ─── Provider ──────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const isHydrated = useRef(false);
  const [hydrated, setHydrated] = React.useState(false);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await getItem(STORAGE_KEY);
        if (raw) {
          const parsed: AppState = JSON.parse(raw);
          // Only hydrate if user was authenticated — otherwise start fresh
          if (parsed.auth?.isAuthenticated || parsed.auth?.isLoggedIn) {
            dispatch({ type: 'HYDRATE', payload: parsed });
          }
        }
      } catch {
        // Corrupted storage — start with clean state
      }
      isHydrated.current = true;
      setHydrated(true);
    })();
  }, []);

  // Persist on every state change (skip initial renders before hydration)
  useEffect(() => {
    if (!isHydrated.current) return;
    setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const value = React.useMemo(
    () => ({ state, dispatch, isHydrated: hydrated }),
    [state, dispatch, hydrated],
  );

  return React.createElement(AppContext.Provider, { value }, children);
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
