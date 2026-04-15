import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  real,
  integer,
  boolean,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Enums ──────────────────────────────────────────────────────────────────

export const sessionStateEnum = pgEnum('session_state', [
  'idle',
  'driving',
  'stop_detected',
  'awaiting_confirmation',
  'confirmed_safe',
  'alert_triggered',
  'escalated',
]);

export const confirmationTypeEnum = pgEnum('confirmation_type', [
  'photo',
  'manual',
  'auto',
  'co_parent',
]);

export const alertSeverityEnum = pgEnum('alert_severity', [
  'low',
  'medium',
  'high',
  'critical',
]);

export const subscriptionTierEnum = pgEnum('subscription_tier', [
  'free',
  'basic',
  'premium',
]);

export const familyRoleEnum = pgEnum('family_role', [
  'owner',
  'admin',
  'member',
]);

export const platformEnum = pgEnum('platform', ['ios', 'android', 'web']);

export const notificationTypeEnum = pgEnum('notification_type', [
  'stop_detected',
  'confirmation_needed',
  'alert',
  'escalation',
  'session_started',
  'session_ended',
]);

// ─── Tables ─────────────────────────────────────────────────────────────────

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    displayName: text('display_name').notNull(),
    avatarUrl: text('avatar_url'),
    phone: text('phone'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('users_email_idx').on(t.email)],
);

export const families = pgTable('families', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id),
  inviteCode: text('invite_code').unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const familyMembers = pgTable(
  'family_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    familyId: uuid('family_id')
      .notNull()
      .references(() => families.id),
    role: familyRoleEnum('role').notNull().default('member'),
    displayName: text('display_name').notNull(),
    email: text('email').notNull(),
    avatarUrl: text('avatar_url'),
    joinedAt: timestamp('joined_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('family_members_user_idx').on(t.userId),
    index('family_members_family_idx').on(t.familyId),
  ],
);

export const children = pgTable(
  'children',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    familyId: uuid('family_id')
      .notNull()
      .references(() => families.id),
    name: text('name').notNull(),
    dateOfBirth: text('date_of_birth'),
    avatarUrl: text('avatar_url'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('children_family_idx').on(t.familyId)],
);

export const destinations = pgTable(
  'destinations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    familyId: uuid('family_id')
      .notNull()
      .references(() => families.id),
    name: text('name').notNull(),
    address: text('address').notNull(),
    latitude: real('latitude').notNull(),
    longitude: real('longitude').notNull(),
    radius: integer('radius').notNull().default(100),
    isDefault: boolean('is_default').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('destinations_family_idx').on(t.familyId)],
);

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    familyId: uuid('family_id')
      .notNull()
      .references(() => families.id),
    driverId: uuid('driver_id')
      .notNull()
      .references(() => users.id),
    childId: uuid('child_id')
      .notNull()
      .references(() => children.id),
    destinationId: uuid('destination_id').references(() => destinations.id),
    state: sessionStateEnum('state').notNull().default('idle'),
    startedAt: timestamp('started_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    endedAt: timestamp('ended_at', { withTimezone: true }),
  },
  (t) => [
    index('sessions_family_idx').on(t.familyId),
    index('sessions_driver_idx').on(t.driverId),
    index('sessions_child_idx').on(t.childId),
    index('sessions_state_idx').on(t.state),
  ],
);

export const stops = pgTable(
  'stops',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => sessions.id),
    latitude: real('latitude').notNull(),
    longitude: real('longitude').notNull(),
    detectedAt: timestamp('detected_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    destinationId: uuid('destination_id').references(() => destinations.id),
  },
  (t) => [index('stops_session_idx').on(t.sessionId)],
);

export const confirmations = pgTable(
  'confirmations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    stopId: uuid('stop_id')
      .notNull()
      .references(() => stops.id),
    type: confirmationTypeEnum('type').notNull(),
    confirmedBy: uuid('confirmed_by')
      .notNull()
      .references(() => users.id),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('confirmations_stop_idx').on(t.stopId)],
);

export const photos = pgTable(
  'photos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    confirmationId: uuid('confirmation_id')
      .notNull()
      .references(() => confirmations.id),
    uri: text('uri').notNull(),
    takenAt: timestamp('taken_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('photos_confirmation_idx').on(t.confirmationId)],
);

export const alerts = pgTable(
  'alerts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => sessions.id),
    familyId: uuid('family_id')
      .notNull()
      .references(() => families.id),
    childId: uuid('child_id')
      .notNull()
      .references(() => children.id),
    severity: alertSeverityEnum('severity').notNull(),
    message: text('message').notNull(),
    triggeredAt: timestamp('triggered_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    resolvedBy: uuid('resolved_by').references(() => users.id),
  },
  (t) => [
    index('alerts_session_idx').on(t.sessionId),
    index('alerts_family_idx').on(t.familyId),
    index('alerts_severity_idx').on(t.severity),
  ],
);

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    type: notificationTypeEnum('type').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    data: jsonb('data'),
    read: boolean('read').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('notifications_user_idx').on(t.userId),
    index('notifications_read_idx').on(t.read),
  ],
);

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    familyId: uuid('family_id')
      .notNull()
      .references(() => families.id),
    tier: subscriptionTierEnum('tier').notNull().default('free'),
    maxChildren: integer('max_children').notNull().default(2),
    maxDestinations: integer('max_destinations').notNull().default(3),
    isActive: boolean('is_active').notNull().default(true),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('subscriptions_family_idx').on(t.familyId)],
);

export const pushTokens = pgTable(
  'push_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    token: text('token').notNull(),
    platform: platformEnum('platform').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('push_tokens_user_idx').on(t.userId),
    index('push_tokens_token_idx').on(t.token),
  ],
);

// ─── Relations ──────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  familyMembers: many(familyMembers),
  sessions: many(sessions),
  confirmations: many(confirmations),
  notifications: many(notifications),
  pushTokens: many(pushTokens),
}));

export const familiesRelations = relations(families, ({ one, many }) => ({
  owner: one(users, {
    fields: [families.ownerId],
    references: [users.id],
  }),
  members: many(familyMembers),
  children: many(children),
  destinations: many(destinations),
  sessions: many(sessions),
  alerts: many(alerts),
  subscriptions: many(subscriptions),
}));

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
  user: one(users, {
    fields: [familyMembers.userId],
    references: [users.id],
  }),
  family: one(families, {
    fields: [familyMembers.familyId],
    references: [families.id],
  }),
}));

export const childrenRelations = relations(children, ({ one, many }) => ({
  family: one(families, {
    fields: [children.familyId],
    references: [families.id],
  }),
  sessions: many(sessions),
  alerts: many(alerts),
}));

export const destinationsRelations = relations(
  destinations,
  ({ one, many }) => ({
    family: one(families, {
      fields: [destinations.familyId],
      references: [families.id],
    }),
    sessions: many(sessions),
    stops: many(stops),
  }),
);

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  family: one(families, {
    fields: [sessions.familyId],
    references: [families.id],
  }),
  driver: one(users, {
    fields: [sessions.driverId],
    references: [users.id],
  }),
  child: one(children, {
    fields: [sessions.childId],
    references: [children.id],
  }),
  destination: one(destinations, {
    fields: [sessions.destinationId],
    references: [destinations.id],
  }),
  stops: many(stops),
  alerts: many(alerts),
}));

export const stopsRelations = relations(stops, ({ one, many }) => ({
  session: one(sessions, {
    fields: [stops.sessionId],
    references: [sessions.id],
  }),
  destination: one(destinations, {
    fields: [stops.destinationId],
    references: [destinations.id],
  }),
  confirmations: many(confirmations),
}));

export const confirmationsRelations = relations(
  confirmations,
  ({ one, many }) => ({
    stop: one(stops, {
      fields: [confirmations.stopId],
      references: [stops.id],
    }),
    confirmer: one(users, {
      fields: [confirmations.confirmedBy],
      references: [users.id],
    }),
    photos: many(photos),
  }),
);

export const photosRelations = relations(photos, ({ one }) => ({
  confirmation: one(confirmations, {
    fields: [photos.confirmationId],
    references: [confirmations.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  session: one(sessions, {
    fields: [alerts.sessionId],
    references: [sessions.id],
  }),
  family: one(families, {
    fields: [alerts.familyId],
    references: [families.id],
  }),
  child: one(children, {
    fields: [alerts.childId],
    references: [children.id],
  }),
  resolver: one(users, {
    fields: [alerts.resolvedBy],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  family: one(families, {
    fields: [subscriptions.familyId],
    references: [families.id],
  }),
}));

export const pushTokensRelations = relations(pushTokens, ({ one }) => ({
  user: one(users, {
    fields: [pushTokens.userId],
    references: [users.id],
  }),
}));
