// ─── Color Tokens ───────────────────────────────────────────────────────────

export const Colors = {
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  safe: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#22C55E',
    600: '#16A34A',
  },
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
  },
  dark: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  white: '#FFFFFF',
} as const;

// ─── Session Timing ─────────────────────────────────────────────────────────

export const SessionTiming = {
  /** Seconds before a stop triggers a confirmation prompt */
  STOP_DETECTION_DELAY: 30,
  /** Seconds the driver has to confirm child safety */
  CONFIRMATION_TIMEOUT: 120,
  /** Seconds before escalation to co-parent */
  ESCALATION_TIMEOUT: 300,
  /** Minimum stop duration in seconds to be considered a real stop */
  MIN_STOP_DURATION: 15,
  /** Geofence radius in meters for known destinations */
  DEFAULT_GEOFENCE_RADIUS: 100,
} as const;

// ─── Notification Categories ────────────────────────────────────────────────

export const NotificationCategories = {
  STOP_DETECTED: 'stop_detected',
  CONFIRMATION_NEEDED: 'confirmation_needed',
  ALERT: 'alert',
  ESCALATION: 'escalation',
  SESSION_STARTED: 'session_started',
  SESSION_ENDED: 'session_ended',
} as const;

// ─── Subscription Limits ────────────────────────────────────────────────────

export const SubscriptionLimits = {
  free: { maxChildren: 1, maxDestinations: 2 },
  basic: { maxChildren: 3, maxDestinations: 10 },
  premium: { maxChildren: 10, maxDestinations: 50 },
} as const;
