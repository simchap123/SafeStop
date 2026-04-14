# SafeStop -- User Flow Guide

Complete documentation of every user flow in the SafeStop child vehicle safety system.

---

## Table of Contents

1. [Onboarding Flow](#1-onboarding-flow)
2. [Trip Session Flow](#2-trip-session-flow)
3. [Missed Confirmation Flow](#3-missed-confirmation-flow)
4. [Multi-Stop Errand Flow](#4-multi-stop-errand-flow)
5. [Offline Recovery Flow](#5-offline-recovery-flow)
6. [False Trigger Flow](#6-false-trigger-flow)
7. [Session State Machine](#7-session-state-machine)

---

## 1. Onboarding Flow

New users go through a guided setup that establishes their family, children, destinations, and caregiver network before they can start a session.

### Step-by-Step

```
Welcome Screen
    |
    v
Sign Up (email + password)
    |
    v
Create Family ("Johnson Family")
    |
    v
Add First Child (name, date of birth, notes like "rear-facing car seat")
    |
    v
Add Destination (e.g., "Bright Horizons Daycare", address, geofence radius)
    |
    v
Invite Caregiver (co-parent/family member receives invite via email or SMS)
    |
    v
Grant Permissions (location, camera, notifications)
    |
    v
Dashboard (ready to start first session)
```

### Screen Details

| Screen | Route | Purpose |
|--------|-------|---------|
| Welcome | `/` (index) | Hero screen with "Get Started" and "I have an account" |
| Sign Up | `/(auth)/signup` | Email, password, display name |
| Log In | `/(auth)/login` | Returning user authentication |
| Onboarding | `/(auth)/onboarding` | Multi-step guided setup |
| Add Child | `/child/add` | Name, date of birth, notes |
| Add Destination | `/destination/add` | Name, address, geofence radius |
| Invite Caregiver | `/caregiver/invite` | Email/phone invite with role assignment |

### Permission Requests

The app requests the following permissions during onboarding:

- **Location (Always)** -- Required for stop detection and geofence matching.
- **Camera** -- Required for photo confirmation (the primary trust mechanism).
- **Notifications** -- Required for check-in prompts, stop alerts, and escalation alerts.

If any permission is denied, the app explains why it is needed and provides a link to device settings. The app can function without camera access (manual confirmation only), but location and notifications are essential for safety.

### Data Created During Onboarding

- `User` record with email, display name, phone
- `Family` record linking user as owner
- One or more `Child` records
- One or more `Destination` records with geofence coordinates
- `CaregiverEntry` records for invited family members (role: primary_caregiver, co_parent, or viewer)

---

## 2. Trip Session Flow

The core safety loop. A session starts when a driver checks in with a child and continues until the child is confirmed safe at the destination.

### Step-by-Step

```
Driver starts driving with child
    |
    v
Check-In Prompt: "Driving with a child?"
    |
    +---> "Check In" ---> Select child(ren) ---> Session starts
    |
    +---> "No Child Today" ---> No session created
    |
    +---> Dismiss ---> No session created
    |
    v
CHILD_SESSION_ACTIVE
    |
    v
Vehicle stops (motion stops, GPS velocity = 0)
    |
    v
STOP_PENDING_CONFIRMATION
    |
    v
Prompt: "Did you take your child out?"
    |
    +---> "Take Photo" (PRIMARY) ---> Camera opens ---> Photo uploaded
    |         |
    |         v
    |     SESSION_SAFE_CONFIRMED ---> Caregiver notified
    |
    +---> "Confirm Without Photo" ---> SESSION_SAFE_CONFIRMED
    |
    +---> "Remind Me" ---> Timer starts ---> Re-prompt in 60 sec
    |
    +---> "Continue Driving" ---> CHILD_SESSION_ACTIVE (session resumes)
    |
    v
End Session (manual or auto at known destination)
    |
    v
SESSION_ENDED ---> Session moves to history
```

### Screen Details

| Screen | Route | Purpose |
|--------|-------|---------|
| Dashboard | `/(tabs)/index` | Shows active session status, quick check-in |
| Check-In | `/(session)/checkin` | Select children, choose destination |
| Active Session | `/(session)/active` | Live session monitor with elapsed time |
| Stop Detected | `/(session)/stop-detected` | Confirmation prompt with action buttons |
| Camera | `/(session)/camera` | Photo capture for confirmation |
| Confirmed | `/(session)/confirmed` | Success screen, caregiver notification sent |

### Auto Check-In

When the system detects a routine pattern (same time, same route, same child), it can auto-check-in:

- Notification: "Auto-checked in for your usual trip with Emma"
- User can dismiss if incorrect
- Requires `settings.autoCheckin` to be enabled

### Caregiver Notification

When a session is confirmed safe, all linked caregivers receive:

- Push notification with child name and confirmation type
- Photo (if taken) visible in web portal
- Timestamp and location of confirmation

---

## 3. Missed Confirmation Flow

The critical safety escalation path. If a driver does not respond to the stop confirmation prompt, the system progressively escalates.

### Escalation Timeline

```
T+0:00  Stop detected -- prompt shown to driver
    |
    v
T+1:00  No response -- REMINDER sent (vibration + sound + persistent notification)
    |
    v
T+2:00  No response -- SESSION_RISK_UNCONFIRMED
    |       |
    |       v
    |   Caregiver Alert: "Emma's stop was not confirmed. Please check."
    |       |
    |       v
    |   Caregiver can:
    |       +---> Confirm child is safe (co_parent confirmation)
    |       +---> Call driver
    |       +---> Mark as emergency
    |
    v
T+5:00  No response from anyone -- ESCALATED
    |
    v
T+10:00 Emergency contacts notified
```

### Screen Details

| Screen | Route | Purpose |
|--------|-------|---------|
| Missed | `/(session)/missed` | Alert screen showing unconfirmed stop |
| Alerts Tab | `/(tabs)/alerts` | History of all alerts with severity levels |

### Alert Severity Levels

| Severity | Trigger | Action |
|----------|---------|--------|
| `low` | First reminder after 60 seconds | Re-prompt driver |
| `medium` | Second reminder after 120 seconds | Notify primary caregiver |
| `high` | No response after 5 minutes | Notify all caregivers |
| `critical` | No response after 10 minutes | Emergency protocol |

### Key Design Principle

> "Assume child is present until confirmed otherwise."

The system never assumes a missed prompt means the child is safe. It always escalates until a human confirms.

### Notification Language

The system uses calm, actionable language -- never panic:

- YES: "Emma's stop was not confirmed. Please check in."
- NO: "EMERGENCY: Your child may be in danger!"

---

## 4. Multi-Stop Errand Flow

Sessions persist across multiple stops. A parent running errands with a child does not need to end and restart sessions.

### Example Scenario

```
Sarah leaves home with Emma
    |
    v
Session starts -- CHILD_SESSION_ACTIVE
    |
    v
Stop 1: Grocery store parking lot
    |
    +---> Prompt: "Did you take your child out?"
    +---> Sarah taps "Take Photo" -- confirms Emma is with her
    +---> Session continues (CHILD_SESSION_ACTIVE)
    |
    v
Stop 2: Gas station
    |
    +---> Prompt: "Did you take your child out?"
    +---> Sarah taps "Confirm Without Photo" (quick stop)
    +---> Session continues (CHILD_SESSION_ACTIVE)
    |
    v
Stop 3: Bright Horizons Daycare (known destination)
    |
    +---> Prompt: "Did you take your child out?"
    +---> Sarah taps "Take Photo" -- confirms drop-off
    +---> Session ends automatically (known destination match)
    +---> Caregiver notified with photo
    |
    v
SESSION_ENDED
```

### How It Works

1. Each stop creates a new `Stop` record with GPS coordinates and timestamp.
2. Each stop requires its own confirmation (photo or manual).
3. After confirmation, the session returns to `CHILD_SESSION_ACTIVE` unless:
   - The stop matches a known `Destination` geofence (auto-end option).
   - The driver manually ends the session.
4. The session history shows all stops and confirmations in a timeline.

### Data Model for Multi-Stop

```
Session
  |
  +-- Stop 1 (grocery store)
  |     +-- Confirmation (photo, timestamp)
  |
  +-- Stop 2 (gas station)
  |     +-- Confirmation (manual, timestamp)
  |
  +-- Stop 3 (daycare - matched destination)
        +-- Confirmation (photo, timestamp)
```

---

## 5. Offline Recovery Flow

Handles the scenario where the driver's phone loses connectivity or dies mid-session.

### Detection Mechanism

```
Session is CHILD_SESSION_ACTIVE
    |
    v
Phone loses connectivity (battery dies, airplane mode, dead zone)
    |
    v
Backend detects missing heartbeat (no GPS updates for 3+ minutes)
    |
    v
Backend marks session as at-risk
    |
    v
Caregiver Alert: "We lost contact with Sarah during an active session with Emma."
    |
    v
Caregiver can:
    +---> Call driver directly
    +---> Mark as resolved
    +---> Wait for reconnection
    |
    v
Phone reconnects
    |
    v
Session resumes -- prompt to confirm current status
```

### How Heartbeats Work

1. While a session is active, the mobile app sends periodic location pings to the backend via SSE (Server-Sent Events).
2. The backend expects a heartbeat at least every 60 seconds.
3. If no heartbeat arrives for 3 consecutive intervals (3 minutes), the backend triggers the offline alert.
4. When the phone reconnects, it sends its buffered location data and the session resumes normally.

### Key Principle

> "If we don't know the child's status, we escalate."

Losing connectivity during an active session is treated as a potential risk, not a routine event.

---

## 6. False Trigger Flow

Handles situations where the stop detection fires incorrectly (traffic light, drive-through, slow traffic).

### Behavior

```
Vehicle slows/stops briefly
    |
    v
Stop detection triggers
    |
    v
Prompt: "Did you take your child out?"
    |
    +---> Driver taps "Continue Driving"
    |
    v
Session returns to CHILD_SESSION_ACTIVE
    |
    v
System records the dismissal
    |
    v
No repeated prompts for same location within cooldown window
```

### Anti-Annoyance Measures

1. **Cooldown period**: After a false trigger dismissal, no re-prompt for the same GPS area within 5 minutes.
2. **Velocity filtering**: Prompts only trigger when GPS velocity reaches 0 and remains 0 for a threshold period (not just a brief slowdown).
3. **Geofence awareness**: Known traffic areas or frequently dismissed locations can be learned over time.
4. **Quick dismiss**: A single tap on "Continue Driving" returns to the active session without further interaction.

### What Does NOT Happen

- The system does not escalate a dismissed false trigger.
- The system does not send caregiver notifications for dismissed prompts.
- The system does not count dismissed prompts against the driver.

---

## 7. Session State Machine

The state machine is the core of SafeStop's safety logic. Every session transitions through well-defined states.

### States

| State | Description |
|-------|-------------|
| `NO_SESSION` / `IDLE` | No active session. App is in standby. |
| `CHILD_SESSION_ACTIVE` / `DRIVING` | Session is active. Child is assumed to be in the vehicle. |
| `STOP_PENDING_CONFIRMATION` / `STOP_DETECTED` | Vehicle has stopped. Awaiting driver confirmation. |
| `SESSION_SAFE_CONFIRMED` / `CONFIRMED_SAFE` | Driver confirmed child was removed from vehicle. |
| `SESSION_RISK_UNCONFIRMED` / `ALERT_TRIGGERED` | Confirmation was missed. Escalation in progress. |
| `SESSION_ENDED` | Session is complete. Moved to history. |
| `ESCALATED` | Maximum escalation reached. Emergency contacts notified. |

### State Transition Diagram

```
                           +------------------+
                           |   NO_SESSION      |
                           |   (idle)          |
                           +--------+---------+
                                    |
                          check_in / start_session
                                    |
                                    v
                           +------------------+
               +---------->| CHILD_SESSION    |<-----------+
               |           | _ACTIVE          |            |
               |           | (driving)        |            |
               |           +--------+---------+            |
               |                    |                      |
               |           stop_detected                   |
               |           (GPS velocity = 0)              |
               |                    |                      |
               |                    v                      |
               |           +------------------+            |
               |           | STOP_PENDING     |            |
               |           | _CONFIRMATION    |            |
               |           | (stop_detected)  |            |
               |           +--------+---------+            |
               |                    |                      |
               |         +---------+---------+             |
               |         |         |         |             |
               |      confirm   timeout   continue         |
               |      (photo/   (no       driving          |
               |       manual)  response)                  |
               |         |         |         |             |
               |         v         v         +-------------+
               |  +----------+  +------------------+
               |  | SESSION   |  | SESSION_RISK     |
               |  | _SAFE     |  | _UNCONFIRMED     |
               |  | CONFIRMED |  | (alert_triggered)|
               |  +-----+----+  +--------+---------+
               |        |                |
               |   continue         escalation
               |   driving          (timeout)
               |        |                |
               |        v                v
               +--------+       +------------------+
                                | ESCALATED        |
                                | (emergency)      |
                                +--------+---------+
                                         |
                                    resolved /
                                    confirmed
                                         |
                                         v
                                +------------------+
                                | SESSION_ENDED    |
                                | (history)        |
                                +------------------+
```

### Transition Table

| From | Event | To | Side Effects |
|------|-------|----|-------------|
| NO_SESSION | `check_in` | CHILD_SESSION_ACTIVE | Create session, start heartbeat |
| CHILD_SESSION_ACTIVE | `stop_detected` | STOP_PENDING_CONFIRMATION | Create stop record, show prompt |
| STOP_PENDING_CONFIRMATION | `confirm_photo` | SESSION_SAFE_CONFIRMED | Save photo, notify caregiver |
| STOP_PENDING_CONFIRMATION | `confirm_manual` | SESSION_SAFE_CONFIRMED | Notify caregiver (no photo) |
| STOP_PENDING_CONFIRMATION | `continue_driving` | CHILD_SESSION_ACTIVE | Record dismissal |
| STOP_PENDING_CONFIRMATION | `timeout` | SESSION_RISK_UNCONFIRMED | Start escalation timer |
| SESSION_SAFE_CONFIRMED | `continue_driving` | CHILD_SESSION_ACTIVE | Resume session |
| SESSION_SAFE_CONFIRMED | `end_session` | SESSION_ENDED | Move to history |
| SESSION_RISK_UNCONFIRMED | `confirm` | SESSION_SAFE_CONFIRMED | Cancel escalation |
| SESSION_RISK_UNCONFIRMED | `escalation_timeout` | ESCALATED | Notify emergency contacts |
| ESCALATED | `resolved` | SESSION_ENDED | Log resolution |
| Any active state | `end_session` | SESSION_ENDED | Move to history |

### Implementation Notes

The state machine is implemented in two places:

1. **`lib/session-states.ts`** -- Pure functions for state transitions (used in the mobile app).
2. **`lib/types.ts`** -- TypeScript enum `SessionState` with values: `idle`, `driving`, `stop_detected`, `awaiting_confirmation`, `confirmed_safe`, `alert_triggered`, `escalated`.

The `SessionContext` interface tracks:
- Current state
- Selected children
- Session start time
- Current location
- Array of stops (each with timestamp and location)
- Array of confirmations (each with timestamp, photo URI, and child ID)

---

## Flow Dependencies

```
Onboarding -----> Dashboard -----> Check-In -----> Active Session
                                                        |
                                              +---------+---------+
                                              |                   |
                                        Stop Detected       Phone Dies
                                              |                   |
                                    +---------+-------+     Offline Recovery
                                    |         |       |           |
                                 Confirm  Continue  Timeout       |
                                    |      Driving    |           |
                                  Safe       |    Escalation      |
                                    |        |        |           |
                                    +--------+--------+-----------+
                                              |
                                        Session Ended
                                              |
                                        History Log
```
