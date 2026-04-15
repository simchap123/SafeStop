import { pgTable, text, uuid, timestamp, boolean, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const sessionStatusEnum = pgEnum("session_status", [
  "active", "awaiting_confirmation", "confirmed_safe", "alert_triggered", "ended",
]);

export const alertSeverityEnum = pgEnum("alert_severity", [
  "low", "medium", "high", "critical",
]);

export const alertStatusEnum = pgEnum("alert_status", [
  "pending", "acknowledged", "resolved", "escalated",
]);

export const caregiverRoleEnum = pgEnum("caregiver_role", [
  "parent", "guardian", "caregiver", "driver",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  name: text("name").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const authSessions = pgTable("auth_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  token: text("token").notNull().unique(),
  userId: uuid("user_id").notNull().references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verifications = pgTable("verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const families = pgTable("families", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  inviteCode: text("invite_code").notNull().unique(),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const caregivers = pgTable("caregivers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  familyId: uuid("family_id").notNull().references(() => families.id),
  role: caregiverRoleEnum("role").notNull().default("caregiver"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const children = pgTable("children", {
  id: uuid("id").primaryKey().defaultRandom(),
  familyId: uuid("family_id").notNull().references(() => families.id),
  name: text("name").notNull(),
  age: integer("age"),
  photoUrl: text("photo_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const destinations = pgTable("destinations", {
  id: uuid("id").primaryKey().defaultRandom(),
  familyId: uuid("family_id").notNull().references(() => families.id),
  name: text("name").notNull(),
  address: text("address"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  radius: integer("radius").default(100),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tripSessions = pgTable("trip_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  familyId: uuid("family_id").notNull().references(() => families.id),
  caregiverId: uuid("caregiver_id").notNull().references(() => caregivers.id),
  destinationId: uuid("destination_id").references(() => destinations.id),
  status: sessionStatusEnum("status").notNull().default("active"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  stopDetectedAt: timestamp("stop_detected_at"),
  confirmedAt: timestamp("confirmed_at"),
  confirmationPhotoUrl: text("confirmation_photo_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessionChildren = pgTable("session_children", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().references(() => tripSessions.id),
  childId: uuid("child_id").notNull().references(() => children.id),
});

export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().references(() => tripSessions.id),
  severity: alertSeverityEnum("severity").notNull().default("medium"),
  status: alertStatusEnum("status").notNull().default("pending"),
  message: text("message").notNull(),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: uuid("resolved_by").references(() => users.id),
  resolutionNote: text("resolution_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const photos = pgTable("photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().references(() => tripSessions.id),
  uploadedBy: uuid("uploaded_by").notNull().references(() => users.id),
  url: text("url").notNull(),
  type: text("type").notNull().default("confirmation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  body: text("body").notNull(),
  data: jsonb("data"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pushTokens = pgTable("push_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  platform: text("platform").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

