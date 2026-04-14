# SafeStop -- Investor Demo Guide

A 10-minute walkthrough script for demonstrating SafeStop to investors.

---

## Pre-Requisites

1. Open the deployed Vercel URL on a desktop browser (Chrome recommended).
2. Alternatively, run the Expo web build locally:
   ```
   cd apps/mobile
   npx expo start --web
   ```
3. Use browser DevTools to toggle mobile viewport (iPhone 14 Pro frame, 393x852).
4. The app auto-seeds with demo data (Sarah Johnson's family with two children, three destinations, and session history). No manual setup required.
5. Have a second browser tab ready for the web portal (caregiver view) if available.

---

## Demo Script (10 Minutes)

### 1. Welcome Screen (1 minute)

**What to show**: The landing screen at `/` with the shield logo, tagline, and feature icons.

**Script**:

> "Every year, hundreds of children are injured or killed after being left unattended in vehicles. This is not a distracted-parent problem -- it is a systems problem. Routines change, sleep deprivation kicks in, and even the most attentive parents can have a lapse.
>
> SafeStop is a session-based child safety system. It does not track your car. It does not require hardware. It uses behavioral prompts, photo confirmation, and a caregiver network to make sure no child is ever left behind."

**Key details to point out**:
- The three feature pillars: Trip Detection, Photo Confirmation, Caregiver Alerts
- "Trusted by families everywhere" social proof element
- Clean, professional design -- this is a safety product, not a toy

---

### 2. Sign-Up Flow (1 minute)

**What to show**: Tap "Get Started" to navigate to `/(auth)/signup`.

**Script**:

> "Signup takes under 60 seconds. Email, password, done. We use Better Auth -- open source, no vendor lock-in, no third-party data sharing."

**Then show**: The onboarding flow at `/(auth)/onboarding` where the user creates a family, adds children, sets destinations, and invites caregivers.

> "The onboarding wizard walks you through setting up your family. You add your children, save your regular destinations like daycare or school with geofence zones, and invite your co-parent or a trusted caregiver. That caregiver gets their own dashboard where they can see every session in real time."

**Do not linger here** -- move quickly to the dashboard.

---

### 3. Dashboard (1 minute)

**What to show**: Main dashboard at `/(tabs)/index`.

**Script**:

> "This is the home screen. Sarah has two children -- Emma, age 3, and Liam, age 1. You can see the current session status, recent activity, and any active alerts at a glance.
>
> The dashboard is designed for one-handed use while a parent is getting out of a car. Large tap targets, high contrast, no clutter."

**Key details to point out**:
- Child cards with names and status
- Session status card (no active session or active session with timer)
- Quick access to start a check-in
- Alert badge if any unresolved alerts exist

---

### 4. Start a Check-In Session (1 minute)

**What to show**: Tap "Check In" to navigate to `/(session)/checkin`.

**Script**:

> "When Sarah gets in the car with Emma, she taps Check In. She selects which child is with her and optionally picks a destination. One tap and the session is live.
>
> In production, this can also trigger automatically. If Sarah drives to daycare every weekday at 7:45 AM, the app learns that pattern and auto-checks in with a notification she can confirm or dismiss."

**Actions**: Select "Emma", optionally select "Bright Horizons Daycare", tap Start.

---

### 5. Active Session Monitoring (1 minute)

**What to show**: Active session screen at `/(session)/active`.

**Script**:

> "Now the session is active. The app is tracking motion and GPS in the background. Sarah puts her phone down and drives normally. She does not need to interact with the app at all until she stops.
>
> The elapsed timer runs in the background. The caregiver -- in this case Sarah's husband Mike -- can see this session is active on his own device or the web portal."

**Key details to point out**:
- Elapsed time counter
- Child name and session status
- The session persists even if the app is backgrounded

---

### 6. Stop Detection Prompt (1 minute)

**What to show**: Stop detected screen at `/(session)/stop-detected`.

**Script**:

> "Sarah arrives at daycare. The app detects that the vehicle has stopped -- GPS velocity drops to zero and stays there. A prompt appears: 'Did you take your child out?'
>
> This is the critical moment. The system assumes Emma is still in the car until Sarah explicitly confirms otherwise. There are four options."

**Key details to point out**:
- **Take Photo** (primary, highlighted): Opens camera for backseat photo
- **Confirm Without Photo**: Quick confirm without evidence
- **Remind Me**: Snooze for 60 seconds
- **Continue Driving**: Dismiss (for multi-stop errands)

---

### 7. Photo Confirmation (1 minute)

**What to show**: Camera screen at `/(session)/camera`, then confirmed screen at `/(session)/confirmed`.

**Script**:

> "Photo confirmation is the core trust mechanism. Sarah takes a quick photo of the empty backseat. The photo is compressed, uploaded, and immediately visible to her caregiver.
>
> This is not surveillance. This is accountability. The photo proves the child was removed. It creates an audit trail that protects everyone."

**Actions**: Take a photo (or simulate), show the confirmation success screen.

**Key details to point out**:
- Instant camera access -- no fumbling through menus
- Photo is auto-compressed and uploaded with retry logic
- Timestamp and GPS coordinates are embedded
- Free tier retains photos for 24 hours; paid tier retains for 30 days

---

### 8. Caregiver Notification (1 minute)

**What to show**: The confirmed screen showing "Caregiver notified" status.

**Script**:

> "The moment Sarah confirms, Mike gets a push notification: 'Emma was safely dropped off at Bright Horizons Daycare.' He can tap through to see the photo, the timestamp, and the location.
>
> If Mike is using the web portal, he sees this update in real time via Server-Sent Events. No polling, no refresh needed."

**If web portal is available**: Switch to the second browser tab and show the caregiver dashboard with the confirmation.

---

### 9. History and Audit Trail (30 seconds)

**What to show**: History tab at `/(tabs)/history`.

**Script**:

> "Every session is logged. You can see who drove, which child, where they went, how long it took, and whether the confirmation was via photo or manual. This creates a complete safety audit trail.
>
> For daycares or fleet operators, this data is gold. It proves compliance. It protects against liability."

**Key details to point out**:
- Session timeline with all stops
- Confirmation type badges (photo, manual, auto)
- Expandable detail view per session

---

### 10. Missed Confirmation Alert (1 minute)

**What to show**: Alerts tab at `/(tabs)/alerts` and the missed confirmation screen at `/(session)/missed`.

**Script**:

> "Here is where SafeStop's value becomes undeniable. Suppose Sarah gets distracted -- a phone call, she is running late, she simply forgets. She does not respond to the prompt.
>
> After 60 seconds: a reminder with sound and vibration. After 120 seconds: Mike gets an alert. 'Emma's stop was not confirmed. Please check.' Mike can call Sarah, confirm the child is safe himself, or escalate.
>
> The system never assumes everything is fine. It escalates until a human confirms."

**Key details to point out**:
- Progressive escalation (low -> medium -> high -> critical)
- Calm, actionable language -- no panic
- Caregiver can resolve remotely
- Full alert history with resolution status

---

### 11. Settings and Subscription Tiers (30 seconds)

**What to show**: Settings tab at `/(tabs)/settings` and subscription screen at `/subscription`.

**Script**:

> "The free tier includes everything needed for safety -- session tracking, photo confirmation, caregiver alerts, and 24-hour photo history. We show tasteful banner ads.
>
> The paid tier at $0.99 to $1.99 per month removes ads and extends photo history to 30 days. This is intentionally affordable. We are not paywalling safety -- we are monetizing convenience."

---

## Key Talking Points

### The Problem

- On average, 38 children die from vehicular heatstroke annually in the United States.
- Over half of these cases involve a caregiver who forgot the child was in the car.
- Existing solutions require expensive hardware (sensors, car seats) or are easily ignored.

### Why SafeStop Is Different

| Competitor Approach | SafeStop Approach |
|---------------------|-------------------|
| Hardware sensors | Software only (phone already in pocket) |
| $50-$200 device cost | Free app, $0.99-$1.99/mo premium |
| Single point of failure | Caregiver network with escalation |
| Binary alert (child detected/not) | Photo evidence with audit trail |
| Works only in one car | Works everywhere, any vehicle |

### Market Size

- 67 million parents with children under 12 in the US alone.
- $0.99/mo from 1% penetration = $8M ARR.
- B2B opportunity: daycares, school districts, rideshare compliance.

### Technical Moat

- Session state machine is the core IP -- correctness-first design.
- Photo confirmation creates unique audit data no competitor has.
- Open-source stack means $0 development cost and full code ownership.
- Runs on a $6/month server. Unit economics are exceptional.

---

## Common Investor Questions

### "What if the parent just ignores all the prompts?"

The system escalates to the caregiver network. If the caregiver does not respond either, emergency contacts are notified. The chain continues until a human confirms. The system never gives up.

### "What about false alarms? Won't people get annoyed?"

Stop detection uses velocity thresholds, not just GPS position. Brief stops (traffic lights, drive-throughs) are filtered. If a false trigger does occur, a single tap dismisses it with a cooldown to prevent re-prompting at the same location.

### "Why not use Bluetooth/hardware?"

Hardware creates barriers to adoption. A parent has to buy it, install it, charge it, and remember to use it. SafeStop works with the phone they already carry. Zero friction, zero hardware cost.

### "How do you make money at $0.99/month?"

Infrastructure costs are near zero ($6/month for the backend). The free tier includes banner ads via AdMob. Customer acquisition cost is low because parents share this with other parents organically (caregiver invites). At scale, the B2B opportunity (daycare compliance, fleet management) commands significantly higher pricing.

### "What is your go-to-market strategy?"

1. Launch on iOS and Android via Expo EAS Build (simultaneous).
2. PWA for instant access without app store download.
3. Viral loop: every user invites at least one caregiver, who becomes a new user.
4. Partnerships with pediatricians, daycare networks, and parenting influencers.
5. PR around preventable child heatstroke deaths (seasonal summer news cycles).

### "Is the data secure?"

- Authentication via Better Auth (open source, auditable).
- Photos are encrypted in transit (HTTPS) and at rest.
- Users own their data and can delete it at any time.
- No third-party analytics or data selling. Ever.

### "What is your timeline?"

- MVP (current): Functional mobile app with session flow, photo confirmation, and demo data.
- Next 30 days: Backend API on DigitalOcean, real authentication, push notifications.
- Next 60 days: App Store and Play Store submission.
- Next 90 days: Beta launch with 100 families.
