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

Direction: 
Reference: 

## Tokens

```css
:root {
  --bg:       ;   /* page background */
  --surface:  ;   /* card / panel background */
  --primary:  ;   /* main brand color */
  --accent:   ;   /* highlights, links, decorative */
  --text:     ;   /* primary text */
  --muted:    ;   /* secondary / caption text */
  --border:   ;   /* border / divider */
}
```

## Type

- Font:
- Scale: (e.g. 12 / 14 / 16 / 20 / 28 / 40px)
- Weight: (e.g. 400 body · 600 headings · 500 labels)

## Radius

(Use 3 values only — e.g. 8px inputs · 16px cards · 9999px pills)

- Small:
- Medium:
- Full:

## Spacing

- Base unit: (e.g. 8px)
- Scale: (e.g. 8 / 16 / 24 / 32 / 48 / 64px)

## Rules

<!-- Fill Tokens and Type above before treating these as active constraints. They record decisions made for this project, not defaults for every project. -->

1. **Double-Bezel Architecture:** Never place cards flat on the background. Nest an inner core inside an outer shell using mathematically concentric radii: outer radius -> inner radius at outer minus the shell padding (e.g., outer 24px -> inner 18px).
2. **Hero Constraints:** H1 headlines must use wide containers to guarantee they flow in 2-3 lines max. Subtext must be under 20 words. BANNED: Eyebrow badges/pills above the H1 (e.g., 'Now in Public Beta', 'Beta', 'Launch'). Hero top padding must provide enough vertical breathing room under the nav.
3. **Gapless Bento Layout:** All Bento Grids must be dense (`grid-flow-dense` / `grid-auto-flow: dense`) and mathematically aligned. Ban generic, symmetrical 3-column card rows.
4. **Physical Interactions:** Primary buttons must use full-pill shapes. Nest trailing icons (e.g., `->`) in a circular background disc inside the button's right padding. Animate exclusively via transform and opacity using spring physics; no default ease-in-out.
5. **Layout Breakouts:** Ban wrapping every section in the same rigid, centered container. Break the box: use full-bleed sections (e.g., edge-to-edge background dividers or infinite marquees) and asymmetric breakouts where one element bleeds completely to the edge of the screen while text remains aligned to the baseline.
6. **Readability & Contrast:** Secondary text and ghost CTAs must remain legible. Avoid low-contrast grays that blend into the background. Use opacity-based coloring to guarantee WCAG AA contrast across light and dark modes.
7. **Vertical Grid Alignment:** Multi-column layouts must align items vertically to prevent massive empty voids when one column's content is significantly shorter than the other's.
8. **Display Leading & Tracking:** Large display headers (H1/H2) must use tight line-height and tight tracking to maintain visual cohesion and prevent lines from drifting apart.
