const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pptx = new PptxGenJS();

// -- Theme constants --
const BG = "0F172A";
const WHITE = "FFFFFF";
const ACCENT = "6366F1";
const GREEN = "22C55E";
const MUTED = "94A3B8";
const FONT = "Arial";

pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pptx.author = "SafeStop";
pptx.title = "SafeStop Investor Pitch Deck";

// Helper: add a dark slide with optional title
function darkSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: BG };
  return slide;
}

function addTitle(slide, text, opts = {}) {
  slide.addText(text, {
    x: 0.8,
    y: 0.4,
    w: 11.7,
    h: 0.7,
    fontSize: 32,
    fontFace: FONT,
    color: WHITE,
    bold: true,
    ...opts,
  });
}

function addSubtitle(slide, text, opts = {}) {
  slide.addText(text, {
    x: 0.8,
    y: 1.1,
    w: 11.7,
    h: 0.4,
    fontSize: 14,
    fontFace: FONT,
    color: MUTED,
    ...opts,
  });
}

function addBullets(slide, items, opts = {}) {
  const textItems = items.map((t) => ({
    text: t,
    options: {
      bullet: { code: "2022", color: ACCENT },
      color: WHITE,
      fontSize: 16,
      fontFace: FONT,
      breakLine: true,
      paraSpaceAfter: 8,
    },
  }));
  slide.addText(textItems, {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    h: 5.0,
    valign: "top",
    ...opts,
  });
}

function addAccentBar(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.05,
    w: 2.0,
    h: 0.06,
    fill: { color: ACCENT },
  });
}

// ──────────────────────────────────────────
// SLIDE 1: Title
// ──────────────────────────────────────────
{
  const s = darkSlide();
  // Large circle accent behind title
  s.addShape(pptx.ShapeType.ellipse, {
    x: 9.5,
    y: -1.5,
    w: 5,
    h: 5,
    fill: { color: ACCENT, transparency: 85 },
  });
  s.addText("SafeStop", {
    x: 0,
    y: 2.0,
    w: 13.33,
    h: 1.4,
    fontSize: 64,
    fontFace: FONT,
    color: WHITE,
    bold: true,
    align: "center",
  });
  s.addText("Preventing Children from Being Left in Vehicles", {
    x: 0,
    y: 3.5,
    w: 13.33,
    h: 0.7,
    fontSize: 22,
    fontFace: FONT,
    color: MUTED,
    align: "center",
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 5.66,
    y: 4.4,
    w: 2.0,
    h: 0.06,
    fill: { color: ACCENT },
  });
  s.addText("Investor Pitch Deck", {
    x: 0,
    y: 4.7,
    w: 13.33,
    h: 0.5,
    fontSize: 14,
    fontFace: FONT,
    color: MUTED,
    align: "center",
  });
}

// ──────────────────────────────────────────
// SLIDE 2: The Problem
// ──────────────────────────────────────────
{
  const s = darkSlide();
  addTitle(s, "The Problem");
  addAccentBar(s);
  addBullets(s, [
    "Every year, ~38 children die from vehicular heatstroke in the US",
    "87% of victims are age 3 or younger",
    "Over half the cases are due to a caregiver forgetting the child",
    "This is NOT a negligence problem \u2014 it\u2019s a human memory problem",
  ]);
  s.addText("Sources: noheatstroke.org, KidsAndCars.org", {
    x: 0.8,
    y: 6.7,
    w: 11.7,
    h: 0.4,
    fontSize: 11,
    fontFace: FONT,
    color: MUTED,
    italic: true,
  });
}

// ──────────────────────────────────────────
// SLIDE 3: The Solution
// ──────────────────────────────────────────
{
  const s = darkSlide();
  addTitle(s, "The Solution");
  addAccentBar(s);
  s.addText("SafeStop creates a reliable safety loop that ensures no child is left behind.", {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    h: 0.6,
    fontSize: 18,
    fontFace: FONT,
    color: WHITE,
  });

  // Flow boxes
  const steps = ["Check-in", "Trip Monitoring", "Stop Detection", "Photo Confirmation", "Caregiver Notification"];
  const boxW = 2.0;
  const gap = 0.3;
  const totalW = steps.length * boxW + (steps.length - 1) * gap;
  const startX = (13.33 - totalW) / 2;

  steps.forEach((label, i) => {
    const x = startX + i * (boxW + gap);
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 3.0,
      w: boxW,
      h: 1.0,
      fill: { color: ACCENT, transparency: 70 },
      line: { color: ACCENT, width: 1.5 },
      rectRadius: 0.1,
    });
    s.addText(label, {
      x,
      y: 3.0,
      w: boxW,
      h: 1.0,
      fontSize: 13,
      fontFace: FONT,
      color: WHITE,
      bold: true,
      align: "center",
      valign: "middle",
    });
    // Arrow between boxes
    if (i < steps.length - 1) {
      s.addText("\u25B6", {
        x: x + boxW,
        y: 3.0,
        w: gap,
        h: 1.0,
        fontSize: 14,
        fontFace: FONT,
        color: ACCENT,
        align: "center",
        valign: "middle",
      });
    }
  });

  s.addText("Simple.  Repeatable.  Accountable.", {
    x: 0,
    y: 4.8,
    w: 13.33,
    h: 0.6,
    fontSize: 22,
    fontFace: FONT,
    color: GREEN,
    bold: true,
    align: "center",
  });
}

// ──────────────────────────────────────────
// SLIDE 4: How It Works
// ──────────────────────────────────────────
{
  const s = darkSlide();
  addTitle(s, "How It Works");
  addAccentBar(s);

  const howSteps = [
    { num: "1", title: "Check In", desc: "Start a session when driving with your child" },
    { num: "2", title: "Monitor", desc: "SafeStop monitors your trip in the background" },
    { num: "3", title: "Confirm", desc: "At every stop, confirm your child is out with a photo" },
    { num: "4", title: "Notify", desc: "Caregivers are notified with timestamped proof" },
  ];

  howSteps.forEach((step, i) => {
    const x = 0.8 + i * 3.1;
    // Number circle
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.85,
      y: 1.8,
      w: 0.9,
      h: 0.9,
      fill: { color: ACCENT },
    });
    s.addText(step.num, {
      x: x + 0.85,
      y: 1.8,
      w: 0.9,
      h: 0.9,
      fontSize: 28,
      fontFace: FONT,
      color: WHITE,
      bold: true,
      align: "center",
      valign: "middle",
    });
    s.addText(step.title, {
      x,
      y: 3.0,
      w: 2.6,
      h: 0.5,
      fontSize: 18,
      fontFace: FONT,
      color: WHITE,
      bold: true,
      align: "center",
    });
    s.addText(step.desc, {
      x,
      y: 3.5,
      w: 2.6,
      h: 0.8,
      fontSize: 13,
      fontFace: FONT,
      color: MUTED,
      align: "center",
    });
  });
}

// ──────────────────────────────────────────
// SLIDE 5: Core Safety Loop
// ──────────────────────────────────────────
{
  const s = darkSlide();
  addTitle(s, "Core Safety Loop");
  addAccentBar(s);

  // State flow
  const states = [
    { label: "NO\nSESSION", color: MUTED },
    { label: "ACTIVE", color: ACCENT },
    { label: "STOP\nDETECTED", color: "F59E0B" },
    { label: "CONFIRMED", color: GREEN },
    { label: "SAFE", color: GREEN },
  ];

  const boxW = 1.8;
  const gap = 0.45;
  const totalW = states.length * boxW + (states.length - 1) * gap;
  const startX = (13.33 - totalW) / 2;

  states.forEach((st, i) => {
    const x = startX + i * (boxW + gap);
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 2.0,
      w: boxW,
      h: 1.0,
      fill: { color: st.color, transparency: 75 },
      line: { color: st.color, width: 1.5 },
      rectRadius: 0.1,
    });
    s.addText(st.label, {
      x,
      y: 2.0,
      w: boxW,
      h: 1.0,
      fontSize: 12,
      fontFace: FONT,
      color: WHITE,
      bold: true,
      align: "center",
      valign: "middle",
    });
    if (i < states.length - 1) {
      s.addText("\u2192", {
        x: x + boxW,
        y: 2.0,
        w: gap,
        h: 1.0,
        fontSize: 20,
        color: MUTED,
        align: "center",
        valign: "middle",
      });
    }
  });

  // Escalation path
  s.addText("If no confirmation:", {
    x: 0.8,
    y: 3.8,
    w: 3.0,
    h: 0.5,
    fontSize: 14,
    fontFace: FONT,
    color: "EF4444",
    bold: true,
  });

  const escStates = [
    { label: "STOP DETECTED", color: "F59E0B" },
    { label: "ESCALATE", color: "EF4444" },
    { label: "ALERT CAREGIVERS", color: "EF4444" },
  ];

  escStates.forEach((st, i) => {
    const x = 1.5 + i * 3.5;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 4.4,
      w: 2.5,
      h: 0.8,
      fill: { color: st.color, transparency: 80 },
      line: { color: st.color, width: 1.5 },
      rectRadius: 0.1,
    });
    s.addText(st.label, {
      x,
      y: 4.4,
      w: 2.5,
      h: 0.8,
      fontSize: 12,
      fontFace: FONT,
      color: WHITE,
      bold: true,
      align: "center",
      valign: "middle",
    });
    if (i < escStates.length - 1) {
      s.addText("\u2192", {
        x: x + 2.5,
        y: 4.4,
        w: 1.0,
        h: 0.8,
        fontSize: 20,
        color: "EF4444",
        align: "center",
        valign: "middle",
      });
    }
  });

  s.addText('"Assume child is present until confirmed otherwise"', {
    x: 0,
    y: 5.8,
    w: 13.33,
    h: 0.6,
    fontSize: 18,
    fontFace: FONT,
    color: GREEN,
    italic: true,
    align: "center",
  });
}

// ──────────────────────────────────────────
// SLIDE 6: The Product — Mobile App
// ──────────────────────────────────────────
{
  const s = darkSlide();
  addTitle(s, "The Product \u2014 Mobile App");
  addAccentBar(s);

  const screens = ["Dashboard", "Check-in", "Stop Confirmation", "Photo Capture"];
  screens.forEach((label, i) => {
    const x = 1.0 + i * 3.0;
    // Phone frame
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.8,
      w: 2.2,
      h: 4.0,
      fill: { color: "1E293B" },
      line: { color: ACCENT, width: 1 },
      rectRadius: 0.2,
    });
    s.addText(label, {
      x,
      y: 3.2,
      w: 2.2,
      h: 1.0,
      fontSize: 14,
      fontFace: FONT,
      color: WHITE,
      bold: true,
      align: "center",
      valign: "middle",
    });
  });

  s.addText("Available on iOS and Android via Expo", {
    x: 0,
    y: 6.2,
    w: 13.33,
    h: 0.5,
    fontSize: 14,
    fontFace: FONT,
    color: MUTED,
    align: "center",
  });
}

// ──────────────────────────────────────────
// SLIDE 7: The Product — Web Portal
// ──────────────────────────────────────────
{
  const s = darkSlide();
  addTitle(s, "The Product \u2014 Web Portal");
  addAccentBar(s);

  addBullets(s, [
    "Caregiver dashboard with real-time visibility into active sessions",
    "Confirmation viewer with timestamped photos",
    "Alert center and full session history",
    "Progressive Web App \u2014 works on any device with a browser",
  ]);

  // Browser mockup
  s.addShape(pptx.ShapeType.roundRect, {
    x: 3.0,
    y: 4.2,
    w: 7.33,
    h: 2.8,
    fill: { color: "1E293B" },
    line: { color: ACCENT, width: 1 },
    rectRadius: 0.15,
  });
  // Browser bar
  s.addShape(pptx.ShapeType.rect, {
    x: 3.0,
    y: 4.2,
    w: 7.33,
    h: 0.4,
    fill: { color: "334155" },
  });
  s.addText("safestop.app/portal", {
    x: 3.5,
    y: 4.2,
    w: 4.0,
    h: 0.4,
    fontSize: 10,
    fontFace: FONT,
    color: MUTED,
    valign: "middle",
  });
  s.addText("Caregiver Portal", {
    x: 3.0,
    y: 5.0,
    w: 7.33,
    h: 1.5,
    fontSize: 20,
    fontFace: FONT,
    color: WHITE,
    align: "center",
    valign: "middle",
  });
}

// ──────────────────────────────────────────
// SLIDE 8: Key Features
// ──────────────────────────────────────────
{
  const s = darkSlide();
  addTitle(s, "Key Features");
  addAccentBar(s);

  const features = [
    ["Session-based safety tracking", "Photo confirmation (primary trust)"],
    ["Multi-caregiver notifications", "Multi-stop session continuity"],
    ["Offline detection and alerts", "Escalation engine"],
  ];

  features.forEach((row, ri) => {
    row.forEach((feat, ci) => {
      const x = 0.8 + ci * 6.0;
      const y = 1.8 + ri * 1.6;
      s.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 5.4,
        h: 1.2,
        fill: { color: "1E293B" },
        line: { color: ACCENT, width: 0.75 },
        rectRadius: 0.1,
      });
      // Check icon
      s.addText("\u2713", {
        x: x + 0.2,
        y,
        w: 0.6,
        h: 1.2,
        fontSize: 22,
        fontFace: FONT,
        color: GREEN,
        bold: true,
        valign: "middle",
      });
      s.addText(feat, {
        x: x + 0.8,
        y,
        w: 4.4,
        h: 1.2,
        fontSize: 16,
        fontFace: FONT,
        color: WHITE,
        valign: "middle",
      });
    });
  });
}

// ──────────────────────────────────────────
// SLIDE 9: Target Market
// ──────────────────────────────────────────
{
  const s = darkSlide();
  addTitle(s, "Target Market");
  addAccentBar(s);

  s.addText("33 million US families with children under 6", {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    h: 0.6,
    fontSize: 20,
    fontFace: FONT,
    color: ACCENT,
    bold: true,
  });

  const segments = [
    { label: "Primary", desc: "Parents driving to daycare / school daily", color: ACCENT },
    { label: "Secondary", desc: "Grandparents, nannies, carpool participants", color: GREEN },
    { label: "Tertiary", desc: "Daycare networks, schools (B2B future)", color: "F59E0B" },
  ];

  segments.forEach((seg, i) => {
    const y = 2.6 + i * 1.4;
    s.addShape(pptx.ShapeType.roundRect, {
      x: 1.5,
      y,
      w: 10.33,
      h: 1.1,
      fill: { color: seg.color, transparency: 85 },
      line: { color: seg.color, width: 1 },
      rectRadius: 0.1,
    });
    s.addText(seg.label, {
      x: 1.8,
      y,
      w: 2.5,
      h: 1.1,
      fontSize: 16,
      fontFace: FONT,
      color: seg.color,
      bold: true,
      valign: "middle",
    });
    s.addText(seg.desc, {
      x: 4.3,
      y,
      w: 7.0,
      h: 1.1,
      fontSize: 15,
      fontFace: FONT,
      color: WHITE,
      valign: "middle",
    });
  });
}

// ──────────────────────────────────────────
// SLIDE 10: Business Model
// ──────────────────────────────────────────
{
  const s = darkSlide();
  addTitle(s, "Business Model");
  addAccentBar(s);

  // Free tier
  const tiers = [
    {
      name: "Free Tier",
      price: "$0",
      items: ["Ad-supported", "24-hour session history", "Core safety features"],
      color: MUTED,
    },
    {
      name: "Paid Tier",
      price: "$1.99/mo",
      items: ["No ads", "30-day session history", "Priority notifications"],
      color: ACCENT,
    },
    {
      name: "B2B (Future)",
      price: "Custom",
      items: ["Institutional licensing", "Fleet / daycare integration", "Compliance reporting"],
      color: GREEN,
    },
  ];

  tiers.forEach((tier, i) => {
    const x = 0.8 + i * 4.1;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.8,
      w: 3.7,
      h: 4.6,
      fill: { color: "1E293B" },
      line: { color: tier.color, width: i === 1 ? 2 : 1 },
      rectRadius: 0.15,
    });
    s.addText(tier.name, {
      x,
      y: 2.0,
      w: 3.7,
      h: 0.6,
      fontSize: 18,
      fontFace: FONT,
      color: tier.color,
      bold: true,
      align: "center",
    });
    s.addText(tier.price, {
      x,
      y: 2.6,
      w: 3.7,
      h: 0.8,
      fontSize: 32,
      fontFace: FONT,
      color: WHITE,
      bold: true,
      align: "center",
    });
    const bullets = tier.items.map((t) => ({
      text: t,
      options: {
        bullet: { code: "2022", color: tier.color },
        color: MUTED,
        fontSize: 13,
        fontFace: FONT,
        breakLine: true,
        paraSpaceAfter: 6,
      },
    }));
    s.addText(bullets, {
      x: x + 0.3,
      y: 3.6,
      w: 3.1,
      h: 2.5,
      valign: "top",
    });
  });
}

// ──────────────────────────────────────────
// SLIDE 11: Market Opportunity
// ──────────────────────────────────────────
{
  const s = darkSlide();
  addTitle(s, "Market Opportunity");
  addAccentBar(s);

  const markets = [
    { label: "TAM", value: "~$800M", desc: "33M families \u00D7 $24/year", size: 4.0 },
    { label: "SAM", value: "~$120M", desc: "5M families actively using safety apps", size: 3.2 },
    { label: "SOM", value: "~$12M ARR", desc: "500K families in Year 3", size: 2.4 },
  ];

  markets.forEach((m, i) => {
    const cx = 6.66;
    const cy = 4.2;
    // Concentric circles
    s.addShape(pptx.ShapeType.ellipse, {
      x: cx - m.size / 2,
      y: cy - m.size / 2,
      w: m.size,
      h: m.size,
      fill: { color: ACCENT, transparency: 85 - i * 5 },
      line: { color: ACCENT, width: 1 },
    });
  });

  // Labels on the right
  markets.forEach((m, i) => {
    const y = 1.8 + i * 1.5;
    s.addText(m.label, {
      x: 9.5,
      y,
      w: 1.5,
      h: 0.5,
      fontSize: 16,
      fontFace: FONT,
      color: ACCENT,
      bold: true,
    });
    s.addText(m.value, {
      x: 9.5,
      y: y + 0.4,
      w: 3.0,
      h: 0.5,
      fontSize: 24,
      fontFace: FONT,
      color: WHITE,
      bold: true,
    });
    s.addText(m.desc, {
      x: 9.5,
      y: y + 0.85,
      w: 3.5,
      h: 0.4,
      fontSize: 11,
      fontFace: FONT,
      color: MUTED,
    });
  });
}

// ──────────────────────────────────────────
// SLIDE 12: Tech Stack
// ──────────────────────────────────────────
{
  const s = darkSlide();
  addTitle(s, "Tech Stack");
  addAccentBar(s);

  const stack = [
    { layer: "Mobile", tech: "React Native + Expo", detail: "iOS, Android, PWA from one codebase" },
    { layer: "Backend", tech: "Next.js + PostgreSQL", detail: "API routes, SSR, Drizzle ORM" },
    { layer: "Auth", tech: "Better Auth", detail: "Open source authentication" },
    { layer: "Realtime", tech: "Server-Sent Events", detail: "Lightweight push without WebSockets" },
    { layer: "Infra", tech: "DigitalOcean Droplet", detail: "$6/month production cost" },
  ];

  stack.forEach((item, i) => {
    const y = 1.7 + i * 1.05;
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y,
      w: 11.7,
      h: 0.85,
      fill: { color: "1E293B" },
      line: { color: "334155", width: 0.5 },
      rectRadius: 0.08,
    });
    s.addText(item.layer, {
      x: 1.0,
      y,
      w: 2.0,
      h: 0.85,
      fontSize: 14,
      fontFace: FONT,
      color: ACCENT,
      bold: true,
      valign: "middle",
    });
    s.addText(item.tech, {
      x: 3.2,
      y,
      w: 4.0,
      h: 0.85,
      fontSize: 15,
      fontFace: FONT,
      color: WHITE,
      bold: true,
      valign: "middle",
    });
    s.addText(item.detail, {
      x: 7.5,
      y,
      w: 4.5,
      h: 0.85,
      fontSize: 13,
      fontFace: FONT,
      color: MUTED,
      valign: "middle",
    });
  });

  s.addText("All open source  \u2022  $0 vendor lock-in  \u2022  $6/mo total infra cost", {
    x: 0,
    y: 6.5,
    w: 13.33,
    h: 0.5,
    fontSize: 16,
    fontFace: FONT,
    color: GREEN,
    bold: true,
    align: "center",
  });
}

// ──────────────────────────────────────────
// SLIDE 13: Competitive Advantage
// ──────────────────────────────────────────
{
  const s = darkSlide();
  addTitle(s, "Competitive Advantage");
  addAccentBar(s);

  const advantages = [
    { title: "No Hardware Required", desc: "Phone-only solution \u2014 zero barrier to entry" },
    { title: "Photo-Based Proof", desc: "Unique visual confirmation system" },
    { title: "Shared Accountability", desc: "Caregiver visibility into every trip" },
    { title: "Open Source Stack", desc: "$0 vendor lock-in, full transparency" },
    { title: "Simple for Any Parent", desc: "No training, no setup \u2014 just works" },
  ];

  advantages.forEach((adv, i) => {
    const y = 1.7 + i * 1.05;
    // Accent dot
    s.addShape(pptx.ShapeType.ellipse, {
      x: 1.0,
      y: y + 0.2,
      w: 0.4,
      h: 0.4,
      fill: { color: ACCENT },
    });
    s.addText(adv.title, {
      x: 1.7,
      y,
      w: 4.5,
      h: 0.85,
      fontSize: 17,
      fontFace: FONT,
      color: WHITE,
      bold: true,
      valign: "middle",
    });
    s.addText(adv.desc, {
      x: 6.2,
      y,
      w: 6.0,
      h: 0.85,
      fontSize: 14,
      fontFace: FONT,
      color: MUTED,
      valign: "middle",
    });
  });
}

// ──────────────────────────────────────────
// SLIDE 14: Roadmap
// ──────────────────────────────────────────
{
  const s = darkSlide();
  addTitle(s, "Roadmap");
  addAccentBar(s);

  const phases = [
    { phase: "Phase 1", time: "Now", items: "Core app, confirmation system, basic web portal", color: GREEN },
    { phase: "Phase 2", time: "Q3 2026", items: "Smart trip detection, improved UX, subscriptions", color: ACCENT },
    { phase: "Phase 3", time: "Q4 2026", items: "AI routine learning, guest caregiver access", color: "F59E0B" },
    { phase: "Phase 4", time: "2027", items: "Hardware integrations, institutional rollout", color: "EC4899" },
  ];

  // Timeline line
  s.addShape(pptx.ShapeType.rect, {
    x: 2.0,
    y: 2.4,
    w: 0.08,
    h: 4.5,
    fill: { color: "334155" },
  });

  phases.forEach((p, i) => {
    const y = 2.2 + i * 1.2;
    // Dot on timeline
    s.addShape(pptx.ShapeType.ellipse, {
      x: 1.76,
      y: y + 0.2,
      w: 0.55,
      h: 0.55,
      fill: { color: p.color },
    });
    s.addText(p.phase, {
      x: 2.8,
      y,
      w: 2.0,
      h: 0.45,
      fontSize: 16,
      fontFace: FONT,
      color: p.color,
      bold: true,
    });
    s.addText(p.time, {
      x: 4.8,
      y,
      w: 1.5,
      h: 0.45,
      fontSize: 13,
      fontFace: FONT,
      color: MUTED,
    });
    s.addText(p.items, {
      x: 2.8,
      y: y + 0.45,
      w: 8.0,
      h: 0.5,
      fontSize: 14,
      fontFace: FONT,
      color: WHITE,
    });
  });
}

// ──────────────────────────────────────────
// SLIDE 15: The Ask
// ──────────────────────────────────────────
{
  const s = darkSlide();
  s.addShape(pptx.ShapeType.ellipse, {
    x: -2,
    y: 3.0,
    w: 5,
    h: 5,
    fill: { color: ACCENT, transparency: 85 },
  });

  s.addText("Join us in making every trip safer.", {
    x: 0,
    y: 1.8,
    w: 13.33,
    h: 1.0,
    fontSize: 32,
    fontFace: FONT,
    color: WHITE,
    bold: true,
    align: "center",
  });

  s.addShape(pptx.ShapeType.rect, {
    x: 5.66,
    y: 3.0,
    w: 2.0,
    h: 0.06,
    fill: { color: ACCENT },
  });

  s.addText([
    { text: "Contact\n", options: { fontSize: 16, color: MUTED, breakLine: true } },
    { text: "email@safestop.app\n", options: { fontSize: 18, color: WHITE, breakLine: true } },
    { text: "safestop.app", options: { fontSize: 18, color: ACCENT } },
  ], {
    x: 0,
    y: 3.5,
    w: 13.33,
    h: 1.8,
    fontFace: FONT,
    align: "center",
    valign: "top",
    paraSpaceAfter: 8,
  });

  s.addText("SafeStop \u2014 Never leave a child behind.", {
    x: 0,
    y: 5.8,
    w: 13.33,
    h: 0.8,
    fontSize: 22,
    fontFace: FONT,
    color: GREEN,
    bold: true,
    align: "center",
  });
}

// ──────────────────────────────────────────
// Write file
// ──────────────────────────────────────────
const outPath = path.resolve(__dirname, "..", "docs", "SafeStop_Investor_Pitch.pptx");
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log("Pitch deck generated successfully:");
  console.log(outPath);
}).catch((err) => {
  console.error("Error generating pitch deck:", err);
  process.exit(1);
});
