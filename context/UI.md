---
context_role: support
owner: ui_design
read_when: frontend, visual design, UI styling, design tokens, or user-facing layout
stability: current
update_mode: edit_in_place
---

# UI.md

Current-state visual design system. Update values in place, no history, no log.
If a visual decision is architecturally significant, record it in `context/DECISIONS.md`.

## Aesthetic

- **Direction:** Gamified Classroom meets Modern Mobile UI. 
- **Reference:** Soft, friendly, card-based mobile interfaces (sky blues, mint greens, rounded corners) fused with crisp, nostalgic pixel-art sprites for the combat/learning sequences.

## Tokens

```css
:root {
  --bg: #eef2f6;       /* Page canvas: Soft notebook/sky blue */
  --surface: #ffffff;  /* Card / panel background: Clean paper white */
  --surface-hi: #f8fafc; /* Inner core screen: Slight off-white for nested content */
  --primary: #2a9d8f;  /* Main brand color: Chalkboard/Mint Green */
  --accent: #f4a261;   /* Highlights / Objections / Alerts: Highlighter Orange/Yellow */
  --text: #1d3557;     /* Primary readable text: Deep navy/ink (softer than pure black) */
  --muted: #8d99ae;    /* Secondary captions / metadata: Soft slate gray */
  --border: #e2e8f0;   /* Structural lines / panels: Gentle light-gray dividers */
  --shadow: 0 10px 25px -5px rgba(29, 53, 87, 0.05); /* Signature soft floating shadow */
}
Type
Font: Friendly, rounded Sans-serif (Nunito, Poppins, or Quicksand) for standard UI and readable dialogue. Crisp Monospace (JetBrains Mono or Space Mono) strictly isolated for game stats, HP, and turn metadata to contrast with the modern UI.

Scale: 12px (bottom nav labels/metadata) / 14px (secondary text) / 16px (body & dialogue) / 20px (card headers) / 24px (subheadings) / 32px (large screen titles)

Weight: 400 baseline body · 600 label layouts & nav · 700 to 800 (Extra Bold) for primary headings and "OBJECTION!" text.

Radius
Small: 8px (tags, monospace status badges)

Medium (Inner Core): 16px (nested images, inner battle screens)

Large (Outer Cards): 24px to 32px (main layout cards, floating overlapping containers)

Full: 9999px (floating action buttons, bottom nav indicators, primary CTAs)

Spacing
Base unit: 8px

Scale: 8px / 16px / 24px / 32px / 48px / 64px / 80px (for bottom nav clearance)

Rules
1. The Mobile-First "Floating Card" Architecture
Layout Structure: The web app must scale fluidly to mobile. Utilize a fixed, floating bottom navigation bar (containing Home, Schedule/Quizzes, Evidence Bag, Profile) on mobile viewports, which transitions into a vertical side-rail on desktop.

Overlapping Depth: Cards should not sit completely flat. Use the --shadow token to create a soft, elevated look. Elements (like the Professor pixel sprite or a 3D badge) should occasionally break out of their container's bounding box to create depth.

2. Double-Bezel & Soft Nesting
Card-in-Card: Emulate a friendly, structured classroom app by nesting content.

Outer Container: rounded-[24px] bg-[var(--surface)] shadow-lg p-5

Inner Content Area: rounded-[16px] bg-[var(--surface-hi)] p-4

3. Pixel Art on Modern Canvas
High-Contrast Asset Framing: Pixel-art sprites (Professor, Student, Evidence icons) must be rendered with image-rendering: pixelated;. To bridge the gap between the soft UI and the hard pixels, place pixel art on top of solid, softly rounded color blocks (e.g., placing the pixelated Professor sprite on a soft Mint Green or Sky Blue rounded pedestal card).

4. Interactive & Combat Physics
Tactile Buttons: Primary actions (like the "Book Now" or "Joined" pills from the references, adapted here to "OBJECTION!" or "Submit") must be large, full-pill shapes (rounded-full) with a clear drop shadow.

Spring Animations: When a user taps a button or lands a correct academic counter-attack, bypass standard CSS transitions. Use spring-physics (e.g., Framer Motion in React) to make the cards bounce, scale down slightly on press, and snap back.

5. Typographic & Color Restraint
Colored Badges: Use soft, tinted backgrounds with highly saturated text for tags (e.g., a "Math Expert" tag uses a pale yellow background with deep orange text).

Data Isolation: Keep the gamified Ace Attorney elements (HP Bars, Turn Counters) distinct from the learning UI by enforcing the Monospace font and wrapping them in technical, pill-shaped badges at the top of the combat cards.

6. Gapless & Readable Grids
Schedule & Route Mapping: For the "Map/Dungeon" or level selection screen, utilize overlapping nodes and soft pathway lines. Cards displaying topics (e.g., "Discrete Math Level 1") should stack neatly with consistent 16px gaps, utilizing horizontal scrolling (overflow-x-auto) for mobile-friendly carousels.
