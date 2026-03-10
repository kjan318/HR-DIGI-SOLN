# CLAUDE.md — HR-DIGI-SOLN Codebase Guide

This file provides essential context for AI assistants working on this repository.

---

## Project Overview

**HR-DIGI-SOLN** is a static, client-side HR talent management toolkit. It contains two independent applications:

1. **Caliber 9 Talent Matrix** (`index.html`) — A 9-box talent grid for employee calibration with drag-and-drop, CSV import/export, and localStorage persistence.
2. **ORG-VISION** (`ORG-VISION/`) — An organizational hierarchy visualizer built with D3.js.

There is no backend, build system, or package manager. All applications run directly in a browser by opening the HTML files.

---

## Repository Structure

```
HR-DIGI-SOLN/
├── index.html              # Main app: Caliber 9 Talent Matrix (64 KB, ~1358 lines)
├── theme_setup.css         # All CSS styles: dark glassmorphism theme + app-specific styles
├── theme_setup.js          # Interactive effects: parallax, scroll, click ripple
├── images/
│   ├── caliber9_logo.png   # App logo
│   └── Process_Caliber_9.jpg  # Talent calibration process flow diagram
├── ORG-VISION/
│   ├── ORG_VISION_V02.html # Current org chart visualizer (58 KB, use this version)
│   ├── ORG_VISION.html     # Older org chart version (80 KB, kept for reference)
│   └── Process_of_ORG_VISION.png
└── AI-Powered/             # Placeholder directory for future AI features (currently empty)
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic, no templates) |
| Styling | CSS3 + Tailwind CSS (loaded via CDN) |
| Scripting | Vanilla JavaScript (ES6+, no frameworks) |
| Data Persistence | Browser `localStorage` |
| Image Export | html2canvas 1.4.1 (CDN) |
| Org Chart | D3.js v7 + d3-flextree + d3-org-chart (CDN, ORG-VISION only) |

**No build pipeline.** No npm, webpack, babel, TypeScript, or any compilation step.

---

## Core Application: Caliber 9 Talent Matrix (`index.html`)

### Architecture

Single-file SPA pattern: HTML structure, `<style>` blocks (page layout), and `<script>` are all in `index.html`. Shared theme styles live in `theme_setup.css`; interactive effects in `theme_setup.js`.

**Multi-page navigation** is handled by toggling CSS classes (`active-section`) on `<div class="page-section">` elements. There are three pages:
- `#page-process` — Process documentation with diagram
- `#page-matrix` — The 9-box talent grid (main page)
- `#page-contact` — Contact information

### Key Constants (index.html ~line 343–375)

```javascript
const LOCAL_STORAGE_KEY = 'caliber9_employee_data'; // localStorage key
const MOCK_USER_ID      = 'static_user_001';         // Simulated user (no auth)
const BASE_IMAGE_PATH   = 'images/';                 // Relative path for assets

const BOXES = [ /* 9-box definitions: id, label, description */ ];

const CATEGORY_MAP = {  // Maps potential_performance to box id
    H_H: 'H_H', H_M: 'H_M', H_L: 'H_L',
    M_H: 'M_H', M_M: 'M_M', M_L: 'M_L',
    L_H: 'L_H', L_M: 'L_M', L_L: 'L_L'
};
```

### Employee Data Model

```javascript
{
    id:                   number,    // Internal auto-increment
    user_id:              string,    // Unique key e.g. "USR1000"
    name:                 string,
    title:                string,
    department:           string,
    performance_category: "Low"|"Moderate"|"High",
    potential_category:   "Low"|"Moderate"|"High",
    placement:            string,    // Derived: one of the 9 CATEGORY_MAP keys
    retention_risk:       "Low"|"Moderate"|"High",
    manager_id:           string,
    successor_role:       string,
    readiness_level:      "Ready Now"|"6-12 Months"|"1-2 Years"|"2+ Years",
    notes:                string,
    group_color:          string     // Hex color for visual grouping
}
```

### 9-Box Grid Labels

| Box ID | Label | Position |
|--------|-------|----------|
| H_H | Rough Diamond | High Potential, High Performance |
| H_M | Future Star | High Potential, Moderate Performance |
| H_L | Consistent Star | High Potential, Low Performance |
| M_H | Inconsistent Player | Moderate Potential, High Performance |
| M_M | Key Player (Core) | Moderate Potential, Moderate Performance |
| M_L | Current Star | Moderate Potential, Low Performance |
| L_H | Talent Risk | Low Potential, High Performance |
| L_M | Solid Professional | Low Potential, Moderate Performance |
| L_L | High Professional | Low Potential, Low Performance |

### Key Functions Reference

| Function | Location | Purpose |
|----------|----------|---------|
| `switchPage(pageId)` | ~line 306 | Navigate between pages |
| `initializeData()` | ~line 580 | Load from localStorage or seed 50 mock employees |
| `saveData()` | ~line 608 | Persist `employeeData` array to localStorage |
| `renderGrid()` | ~line 736 | Render the 9-box grid HTML structure |
| `renderEmployees()` | ~line 777 | Populate employee markers onto the grid |
| `handleDrop(e)` | — | Drag-and-drop placement change handler |
| `showEmployeeDetails(userId)` | — | Open employee edit panel |
| `addNewEmployee()` | ~line 665 | Add new employee from form input |
| `parseCSV(text)` | ~line 521 | Import employees from CSV string |
| `exportData(type)` | — | Export as `'csv'`, `'summary'`, or `'pdf'` |
| `applyFiltersAndGrouping()` | — | Apply department filter and group-by |
| `toggleControlsPanel()` | ~line 632 | Toggle the floating sidebar panel |
| `getPlacementId(potential, performance)` | ~line 508 | Derive box ID from categories |
| `generateRandomEmployeeData(count)` | ~line 377 | Seed mock data (50 employees on first load) |

### State Management

- Global `let employeeData = []` array is the single source of truth.
- All mutations must call `saveData()` then re-render (`renderGrid()` / `renderEmployees()`).
- `localStorage` key is `caliber9_employee_data`. Data is JSON-serialized.
- `groupColors = {}` maintains consistent color assignments per group.

### CSV Import Format

Required headers (case-insensitive): `user_id, name, title, department, performance_category, potential_category`

Optional headers: `retention_risk, manager_id, successor_role, readiness_level, notes`

Values for category fields must be exactly: `Low`, `Moderate`, or `High`.

---

## Styling Conventions (`theme_setup.css`)

- **Design language:** Dark glassmorphism — `backdrop-filter: blur()`, semi-transparent backgrounds, soft borders.
- **Background:** CSS gradient from `#0c0c0c` to `#a0616a` (dark navy to rose).
- **Font:** `Segoe UI, Tahoma, Geneva, Verdana, sans-serif`.
- **Animated background shapes:** `.bg-shapes > .shape` elements use CSS `float` keyframe animation.
- **Glass component class:** `.glass` — apply to cards/panels that need the frosted glass effect.
- **Tailwind CSS** is available via CDN for utility classes. Use Tailwind utilities for layout and spacing; use `theme_setup.css` for component-level styles.

---

## ORG-VISION Application (`ORG-VISION/ORG_VISION_V02.html`)

- Built with **D3.js v7**, **d3-flextree**, and **d3-org-chart** loaded from CDN.
- Renders a hierarchical organizational chart from embedded JSON data.
- **Use `ORG_VISION_V02.html`** — it is the current version. `ORG_VISION.html` is the older version kept for reference.
- Self-contained single file; no shared dependencies with the main `index.html`.

---

## Development Workflow

### Running Locally

```bash
# No build step needed — open directly in browser
open index.html
# or
open ORG-VISION/ORG_VISION_V02.html
```

For CDN-dependent features (Tailwind, html2canvas, D3.js), an internet connection is required unless assets are downloaded locally.

### Making Changes

1. Edit `index.html` for application logic and HTML structure.
2. Edit `theme_setup.css` for styling changes.
3. Edit `theme_setup.js` for interactive effect changes.
4. Test in browser — there is no hot-reload or dev server.
5. Verify localStorage behavior by opening DevTools → Application → Local Storage.

### No Tests, No Linter

There are no automated tests, no test runner, no linter, and no CI/CD pipeline. All verification is manual browser testing.

---

## Key Conventions

- **Vanilla JS only.** Do not introduce frameworks (React, Vue, etc.) or a build system unless explicitly requested.
- **Single-file pattern for index.html.** Page-specific `<style>` and application `<script>` stay in `index.html`. Only shared theme styles go in `theme_setup.css`.
- **No server-side code.** This is a fully static application. Do not add Node.js, Python, or any server-side logic.
- **localStorage for persistence.** All data is stored client-side under `LOCAL_STORAGE_KEY`. No external API calls for data.
- **CATEGORY_MAP is the source of truth** for mapping potential/performance combinations to box IDs. Always use `getPlacementId()` or `CATEGORY_MAP` directly — do not hardcode box IDs.
- **Always call `saveData()` after any mutation** to `employeeData`, followed by a re-render.
- **Employee `user_id` is the unique identifier.** The numeric `id` field is internal; use `user_id` for lookups and references.
- **External CDN links** — Do not remove or change CDN URLs for Tailwind, html2canvas, or D3 without updating all references.
- **Responsive design** — The matrix page uses `flex-direction: row` on `lg:` breakpoint (≥1024px). Preserve responsive behavior when modifying layout.

---

## Data Flow Summary

```
Browser Load
    └─> initializeData()
            └─> localStorage has data? → parse & load employeeData
            └─> No data?              → generateRandomEmployeeData(50) → employeeData
    └─> renderGrid()       (9-box HTML structure)
    └─> renderEmployees()  (employee markers on grid)

User Interaction (drag, form submit, CSV import)
    └─> Mutate employeeData
    └─> saveData()         (write to localStorage)
    └─> renderEmployees()  (re-render markers)

Export
    └─> exportData('csv')     → Blob download
    └─> exportData('summary') → Blob download (high performers only)
    └─> exportData('pdf')     → html2canvas snapshot → image download
```

---

## Known Limitations

- **Single-user only** — no authentication or multi-user support.
- **CSV parser is naive** — splits on commas; field values containing commas will break import.
- **localStorage only** — data is lost if browser storage is cleared; no cloud sync.
- **No audit log** — employee changes are not tracked.
- **Placeholder images** — employee avatars use `https://placehold.co` as fallback.
- **No input sanitization** on CSV import beyond basic field mapping.
