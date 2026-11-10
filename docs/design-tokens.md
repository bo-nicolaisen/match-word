# Design tokens

All visual values live as CSS custom properties in [`assets/css/tokens.css`](../assets/css/tokens.css). Components use only `var(--token)`. They never use raw colors, sizes or spacing.

## Rules

1. **Use tokens only.** Colors, spacing, font sizes, radii, shadows, z-index and durations must come from a token.
   - Allowed raw values: hairline borders (`1px`, `2px`), `0`, `100%`, `opacity`, and unitless layout values such as `flex: 1`.
2. **Add a new token to `tokens.css` first**, then document it here in the same commit.
3. **Name by role, not appearance:** `--color-danger`, not `--color-red`. Then a re-theme only changes values.
4. **Keep scales in order:** pick the closest existing step (`--space-3`, `--space-4`, …) before adding a new one.

Naming pattern: `--{category}-{role}[-{variant}]`, for example `--color-brand-hover` or `--z-sticker-dragging`.

---

## Color

### Brand
| Token | Value | Used in |
|---|---|---|
| `--color-brand` | `#4f46e5` | `.a-button--primary`, `.a-chip:hover` border, `.m-paste-zone__icon`, `.o-toolbar__title` |
| `--color-brand-hover` | `#4338ca` | `.a-button--primary:hover` |
| `--color-brand-contrast` | `#ffffff` | Text on brand backgrounds (`.a-button--primary`) |

### Surface
| Token | Value | Used in |
|---|---|---|
| `--color-surface` | `#ffffff` | Cards and panels: `.a-chip`, `.a-select`, `.m-paste-zone`, sidebar and toolbar backgrounds, tooltip text |
| `--color-surface-muted` | `#f4f5f7` | Page `body` background, `.a-button--ghost:hover`, `kbd` in `.m-paste-zone__hint` |
| `--color-surface-stage` | `#e5e7eb` | `.o-stage` background behind the screenshot |

### Text
| Token | Value | Used in |
|---|---|---|
| `--color-text` | `#1f2937` | Body text, `.a-select`, `.m-paste-zone__title`, tooltip background (`.m-term-item__tip`) |
| `--color-text-muted` | `#6b7280` | Secondary text: `.m-field__label`, `.o-sidebar__hint`, `.m-paste-zone`, disabled buttons |

### Border
| Token | Value | Used in |
|---|---|---|
| `--color-border` | `#d1d5db` | `.a-chip`, `.a-select`, `.a-button--ghost`, `.m-paste-zone` (dashed), layout dividers |

### Sticker
| Token | Value | Used in |
|---|---|---|
| `--color-sticker-bg` | `#fde047` | `.a-sticker` background |
| `--color-sticker-text` | `#422006` | `.a-sticker` text and remove icon |
| `--color-sticker-border` | `#ca8a04` | `.a-sticker` border |

### Feedback
| Token | Value | Used in |
|---|---|---|
| `--color-focus` | `#2563eb` | Global `:focus-visible` outline |
| `--color-danger` | `#dc2626` | `.a-sticker__remove:hover`, `.o-sidebar__error` |
| `--color-drop-target` | `rgba(79, 70, 229, 0.12)` | `.o-stage--drop-active`, the stage tint while dragging over it |

---

## Typography

| Token | Value | Used in |
|---|---|---|
| `--font-family-base` | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` | `body` |
| `--font-family-mono` | `ui-monospace, "Cascadia Code", Consolas, monospace` | Term text: `.a-chip`, `.a-sticker`, `kbd` |
| `--font-size-xs` | `0.75rem` (12px) | `.m-field__label`, `.m-term-item__tip`, `kbd` |
| `--font-size-sm` | `0.875rem` (14px) | `.a-button`, `.a-chip`, `.a-select`, `.a-sticker`, sidebar hint/error |
| `--font-size-md` | `1rem` (16px) | `body` |
| `--font-size-lg` | `1.25rem` (20px) | `.o-toolbar__title`, `.o-sidebar__title`, `.m-paste-zone__title` |
| `--font-size-xl` | `1.5rem` (24px) | Reserved for larger headings (unused) |
| `--font-weight-regular` | `400` | Reserved (default weight) |
| `--font-weight-bold` | `600` | `.a-button`, `.a-sticker`, `.m-field__label`, `.m-paste-zone__title` |
| `--line-height-tight` | `1.2` | `.a-sticker` |
| `--line-height-base` | `1.5` | `body` |

---

## Spacing

4px base scale. Used for `padding`, `margin` and `gap`.

| Token | Value | Typical use |
|---|---|---|
| `--space-1` | `0.25rem` (4px) | Chip/sticker vertical padding, label gaps |
| `--space-2` | `0.5rem` (8px) | Button padding, gap between chips |
| `--space-3` | `0.75rem` (12px) | Chip/sticker horizontal padding, select padding |
| `--space-4` | `1rem` (16px) | Panel padding (sidebar, toolbar, stage) |
| `--space-5` | `1.25rem` (20px) | Reserved |
| `--space-6` | `1.5rem` (24px) | Reserved |
| `--space-7` | `2rem` (32px) | `.m-paste-zone` padding |
| `--space-8` | `3rem` (48px) | `.m-paste-zone` margin and icon size |

---

## Radius

| Token | Value | Used in |
|---|---|---|
| `--radius-sm` | `4px` | `.a-sticker`, `kbd` |
| `--radius-md` | `8px` | `.a-button`, `.a-select`, `.m-paste-zone`, `.m-term-item__tip` |
| `--radius-pill` | `999px` | `.a-chip` |

## Shadow

| Token | Value | Used in |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,.12)` | `.a-chip` (resting) |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,.18)` | `.a-sticker`, `.m-term-item__tip`, `.o-stage__canvas` |

---

## Layout sizes

| Token | Value | Used in |
|---|---|---|
| `--size-sidebar` | `280px` | `.t-workspace` column width; caps `.m-term-item__tip` width |
| `--size-toolbar` | `56px` | `.t-workspace` row height |
| `--size-paste-zone` | `28rem` | `.m-paste-zone` max width |

## Z-index layers

Layers are spaced out so new layers can be added between them.

| Token | Value | Used in |
|---|---|---|
| `--z-stage` | `1` | `.o-stage__canvas` (stacking context for stickers) |
| `--z-sticker` | `10` | `.a-sticker` |
| `--z-sticker-dragging` | `20` | `.a-sticker--dragging`, so the dragged sticker is on top |
| `--z-tooltip` | `30` | `.m-term-item__tip` |

## Motion

| Token | Value | Used in |
|---|---|---|
| `--duration-fast` | `120ms` | Hover/drop transitions on buttons, chips, tooltip, stage, sticker remove button |

---

## Checking that the docs are complete

Run from the repo root. The first command lists every token used in the CSS. The second should print nothing (every used token is defined):

```bash
grep -ohE "var\(--[a-z0-9-]+" assets/css/*.css | sort -u
grep -ohE "var\(--[a-z0-9-]+" assets/css/*.css | sed 's/var(//' | sort -u | while read v; do grep -q "^\s*$v:" assets/css/tokens.css || echo "$v"; done
```
