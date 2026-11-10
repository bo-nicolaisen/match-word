# Components

The UI follows **atomic design**. Every component lives in [`assets/js/components/`](../assets/js/components/) in a folder for its level, and its CSS is in the matching file in [`assets/css/`](../assets/css/).

| Level | Folder | CSS file | Class prefix | Rule |
|---|---|---|---|---|
| Atom | `atoms/` | `atoms.css` | `.a-` | Smallest building block. Uses no other components (except `Icon`). |
| Molecule | `molecules/` | `molecules.css` | `.m-` | A small group of atoms with one job. |
| Organism | `organisms/` | `organisms.css` | `.o-` | A distinct section of the UI, built from molecules and atoms. |
| Template | `templates/` | `templates.css` | `.t-` | Page layout only. Has slots and no content. |
| Page | `pages/` | – | – | A template filled for this app. |

## Component contract

```js
export function ComponentName(props) { /* … */ return element; }
```

- **Pure function:** `props → HTMLElement`, built with `el()` from [`app/core/dom.js`](../assets/js/app/core/dom.js).
- **No model access.** Components never import models or controllers. Data comes in through props, and user actions go out through callback props (`onChange`, `onDragStart`, …).
- **Re-render by replacing.** Views call the component again and swap the element with `mount()`. Components keep no internal state.
- **BEM classes:** `.{prefix}-{block}__{element}--{modifier}`, e.g. `.a-sticker__remove`, `.o-stage--drop-active`.
- **Tokens only** in CSS. See [design-tokens.md](design-tokens.md).
- Every component file has a JSDoc header with the same props as this document.

## How components connect to MVC

```
Model ──'change'──▶ View ──props──▶ Organism ──▶ Molecules ──▶ Atoms
  ▲                                                        │
  └──── Controller ◀──── callback props (user actions) ────┘
```

| View | Slot | Renders | Re-renders on |
|---|---|---|---|
| `SidebarView` | `sidebar` | `Sidebar` | `TermsModel` change |
| `ToolbarView` | `toolbar` | `Toolbar` | `ScreenshotModel` and `StickerModel` change |
| `StageView` | `stage` | `Stage`, then `Sticker` atoms into `.o-stage__layer` | `ScreenshotModel` (whole stage, only when `src` changes) and `StickerModel` (sticker layer only) |

---

# Atoms

## Icon
Small inline SVG icon that uses the current text color (`stroke: currentColor`).

**File:** [`atoms/Icon.js`](../assets/js/components/atoms/Icon.js) · **Returns:** `SVGElement`

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `name` | `'close' \| 'paste' \| 'image' \| 'trash'` | yes | – | Which icon to draw |
| `className` | `string` | no | `''` | Extra class, e.g. for sizing |

**Classes:** `.a-icon` (sized at `1.1em`, so it scales with the surrounding font size)
**Tokens:** none (inherits color)
**Accessibility:** always `aria-hidden="true"`. The parent must provide the accessible text.

```js
Icon({ name: 'trash' })
```

## Button
**File:** [`atoms/Button.js`](../assets/js/components/atoms/Button.js) · **Returns:** `HTMLButtonElement`

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `label` | `string` | no | `''` | Visible text |
| `variant` | `'primary' \| 'ghost' \| 'icon'` | no | `'primary'` | Visual style |
| `icon` | `Element` | no | – | An `Icon` placed before the label |
| `ariaLabel` | `string` | for `icon` | – | Accessible name when there is no visible label |
| `disabled` | `boolean` | no | `false` | Disables the button |
| `onClick` | `(e: MouseEvent) => void` | no | – | Click handler |

**Classes:** `.a-button`, `.a-button--primary`, `.a-button--ghost`, `.a-button--icon`, `.a-button__label`, state `:disabled`
**Tokens:** `--color-brand`, `--color-brand-hover`, `--color-brand-contrast`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-surface-muted`, `--space-2`, `--space-4`, `--radius-md`, `--font-size-sm`, `--font-weight-bold`, `--duration-fast`
**Accessibility:** native `<button type="button">`. Icon-only buttons must pass `ariaLabel`.

```js
Button({ label: 'Clear stickers', variant: 'ghost', icon: Icon({ name: 'trash' }), onClick })
```

## Select
Native dropdown.

**File:** [`atoms/Select.js`](../assets/js/components/atoms/Select.js) · **Returns:** `HTMLSelectElement`

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `options` | `{ value: string, label: string }[]` | yes | – | Options |
| `value` | `string` | no | `''` | Selected value |
| `id` | `string` | no | – | Links the select to a `<label for>` |
| `onChange` | `(value: string) => void` | no | – | Called with the new value |

**Classes:** `.a-select`
**Tokens:** `--color-border`, `--color-surface`, `--color-text`, `--radius-md`, `--space-2`, `--space-3`, `--font-size-sm`
**Accessibility:** always pair it with a `<label for={id}>` (the `m-field` molecules do this).

```js
Select({ id: 'x', value: 'css', options: [{ value: 'css', label: 'CSS' }], onChange: (v) => … })
```

## WordChip
A draggable pill holding one term. This is the drag source for stickers.

**File:** [`atoms/WordChip.js`](../assets/js/components/atoms/WordChip.js) · **Returns:** `HTMLSpanElement`

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `label` | `string` | yes | – | The term text |
| `termId` | `string` | yes | – | Stored as `data-term-id`; the controller writes it to `dataTransfer` |
| `onDragStart` | `(e: DragEvent, termId) => void` | no | – | HTML5 `dragstart` |
| `onActivate` | `(termId) => void` | no | – | Enter/Space; the keyboard alternative to dragging |
| `describedBy` | `string` | no | – | id of the element that explains the term |

**Classes:** `.a-chip`, `.a-chip--dragging` (while being dragged)
**Tokens:** `--color-border`, `--color-surface`, `--color-brand`, `--radius-pill`, `--shadow-sm`, `--font-family-mono`, `--font-size-sm`, `--space-1`, `--space-3`, `--duration-fast`
**Accessibility:** `role="button"` and `tabindex="0"`. Enter/Space places the term in the center of the visible part of the screenshot.

```js
WordChip({ label: 'Flexbox', termId: 'css-flexbox', onDragStart, onActivate })
```

## Image
The screenshot image. Native image dragging is turned off so it doesn't interfere with dropping terms.

**File:** [`atoms/Image.js`](../assets/js/components/atoms/Image.js) · **Returns:** `HTMLImageElement`

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `src` | `string` | yes | – | Asset path or `blob:` URL |
| `alt` | `string` | no | `''` | Alternative text |
| `onLoad` | `(e: Event) => void` | no | – | Fires when the image has loaded |

**Classes:** `.a-image` (shown at natural size, scaled down to fit the width)
**Tokens:** none

```js
Image({ src: 'assets/img/screenshots/coffee-shop.svg', alt: 'Screenshot' })
```

## Sticker
A placed term. Positioned in **percent of the image**, centered on `(x, y)`, so it stays in place when the image is scaled.

**File:** [`atoms/Sticker.js`](../assets/js/components/atoms/Sticker.js) · **Returns:** `HTMLDivElement`

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `string` | yes | – | Sticker id (`data-sticker-id`) |
| `label` | `string` | yes | – | Term text |
| `explanation` | `string` | no | – | Native tooltip (`title`) |
| `x` | `number` | yes | – | Left position, 0–100 % |
| `y` | `number` | yes | – | Top position, 0–100 % |
| `onPointerDown` | `(e: PointerEvent, id) => void` | no | – | Starts a move (mouse and touch) |
| `onKeyDown` | `(e: KeyboardEvent, id) => void` | no | – | Arrow keys move, Delete/Backspace removes |
| `onRemove` | `(id) => void` | no | – | × button or double-click |

**Classes:** `.a-sticker`, `.a-sticker--dragging`, `.a-sticker__label`, `.a-sticker__remove` (shown on hover or focus)
**Tokens:** `--color-sticker-bg`, `--color-sticker-text`, `--color-sticker-border`, `--color-danger`, `--z-sticker`, `--z-sticker-dragging`, `--shadow-md`, `--radius-sm`, `--font-family-mono`, `--font-size-sm`, `--font-weight-bold`, `--line-height-tight`, `--space-1`, `--space-3`, `--duration-fast`
**Accessibility:** focusable (`role="button"`), with an aria-label that explains the keyboard controls. `touch-action: none` makes touch dragging work.

```js
Sticker({ id: 's1', label: 'Flexbox', explanation: '…', x: 42, y: 10, onPointerDown, onKeyDown, onRemove })
```

---

# Molecules

## SubjectPicker
A label and `Select` for choosing the active subject.

**File:** [`molecules/SubjectPicker.js`](../assets/js/components/molecules/SubjectPicker.js) · **Built from:** `Select` · **Returns:** `HTMLDivElement`

| Prop | Type | Required | Description |
|---|---|---|---|
| `subjects` | `{ id, name }[]` | yes | Subjects from `terms.json` |
| `activeId` | `string` | yes | Selected subject id |
| `onChange` | `(id: string) => void` | yes | Subject chosen |

**Classes:** `.m-field`, `.m-field__label`
**Tokens:** `--space-1`, `--font-size-xs`, `--font-weight-bold`, `--color-text-muted`

## TermItem
A `WordChip` with its explanation, shown as a tooltip on hover or keyboard focus.

**File:** [`molecules/TermItem.js`](../assets/js/components/molecules/TermItem.js) · **Built from:** `WordChip` · **Returns:** `HTMLLIElement`

| Prop | Type | Required | Description |
|---|---|---|---|
| `term` | `{ id, term, explanation }` | yes | One term from `terms.json` |
| `onDragStart` | `(e, termId) => void` | yes | Passed to `WordChip` |
| `onActivate` | `(termId) => void` | no | Passed to `WordChip` |

**Classes:** `.m-term-item`, `.m-term-item__tip`
**Tokens:** `--color-text`, `--color-surface`, `--radius-md`, `--shadow-md`, `--z-tooltip`, `--font-size-xs`, `--space-1`, `--space-2`, `--space-3`, `--space-7`, `--size-sidebar`, `--duration-fast`
**Accessibility:** the tooltip has `role="tooltip"` and is linked to the chip with `aria-describedby`.

## ImagePicker
A label, icon and `Select` listing the bundled screenshots from `screenshots.json`.

**File:** [`molecules/ImagePicker.js`](../assets/js/components/molecules/ImagePicker.js) · **Built from:** `Select`, `Icon` · **Returns:** `HTMLDivElement`

| Prop | Type | Required | Description |
|---|---|---|---|
| `images` | `{ title, src }[]` | yes | Manifest entries |
| `value` | `string \| null` | yes | src of the selected asset; `null` while a pasted image is shown |
| `onChange` | `(src: string) => void` | yes | `''` means "no image" |

**Classes:** `.m-field`, `.m-field--inline`, `.m-field__label`
**Tokens:** same as SubjectPicker, plus `--space-2`

## PasteZone
The empty state on the stage before an image is loaded. It explains how to paste or drop an image.

**File:** [`molecules/PasteZone.js`](../assets/js/components/molecules/PasteZone.js) · **Built from:** `Icon` · **Returns:** `HTMLDivElement`

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | `string` | no | `'No screenshot yet'` | Heading text |

**Classes:** `.m-paste-zone`, `.m-paste-zone__icon`, `.m-paste-zone__title`, `.m-paste-zone__hint`
**Tokens:** `--color-border`, `--color-surface`, `--color-surface-muted`, `--color-text`, `--color-text-muted`, `--color-brand`, `--radius-sm`, `--radius-md`, `--space-1`, `--space-3`, `--space-7`, `--space-8`, `--size-paste-zone`, `--font-size-lg`, `--font-size-xs`, `--font-weight-bold`, `--font-family-mono`

---

# Organisms

## Sidebar
The left panel: title, subject picker, hint and the list of draggable terms. If `error` is set, it shows the error instead.

**File:** [`organisms/Sidebar.js`](../assets/js/components/organisms/Sidebar.js) · **Built from:** `SubjectPicker`, `TermItem` · **Returns:** `HTMLDivElement`

| Prop | Type | Required | Description |
|---|---|---|---|
| `subjects` | `{ id, name }[]` | yes | All subjects |
| `activeId` | `string` | yes | Active subject |
| `terms` | `{ id, term, explanation }[]` | yes | Terms of the active subject |
| `onSubjectChange` | `(id) => void` | yes | |
| `onTermDragStart` | `(e, termId) => void` | yes | |
| `onTermActivate` | `(termId) => void` | no | Keyboard placement |
| `error` | `string` | no | Load error shown with `role="alert"` |

**Classes:** `.o-sidebar`, `.o-sidebar__title`, `.o-sidebar__hint`, `.o-sidebar__error`, `.o-sidebar__list`
**Tokens:** `--space-2`, `--space-4`, `--font-size-lg`, `--font-size-sm`, `--color-text-muted`, `--color-danger`

## Toolbar
The top bar: app title, example image picker and the "Clear stickers" button, which shows the sticker count.

**File:** [`organisms/Toolbar.js`](../assets/js/components/organisms/Toolbar.js) · **Built from:** `ImagePicker`, `Button`, `Icon` · **Returns:** `HTMLDivElement`

| Prop | Type | Required | Description |
|---|---|---|---|
| `images` | `{ title, src }[]` | yes | Manifest |
| `value` | `string \| null` | yes | Selected asset |
| `stickerCount` | `number` | yes | Disables the clear button at 0 |
| `onImageChange` | `(src) => void` | yes | |
| `onClearStickers` | `() => void` | yes | |

**Classes:** `.o-toolbar`, `.o-toolbar__title`, `.o-toolbar__spacer`
**Tokens:** `--space-4`, `--font-size-lg`, `--color-brand`

## Stage
The scrollable area with the screenshot and a sticker layer on top. With no `src`, it shows `PasteZone`.

**File:** [`organisms/Stage.js`](../assets/js/components/organisms/Stage.js) · **Built from:** `Image`, `PasteZone` (stickers are added by `StageView`) · **Returns:** `HTMLDivElement`

| Prop | Type | Required | Description |
|---|---|---|---|
| `src` | `string \| null` | yes | Image source |
| `onDragOver` | `(e: DragEvent) => void` | yes | Must call `preventDefault()` to allow the drop |
| `onDragLeave` | `(e: DragEvent) => void` | yes | |
| `onDrop` | `(e: DragEvent) => void` | yes | Term or image file dropped |

**Structure:**
```
.o-stage                 ← scroll container (overflow: auto)
  .o-stage__canvas       ← position: relative, same size as the image; sticker % are relative to this
    img.a-image
    .o-stage__layer      ← position: absolute; inset: 0; StageView mounts Sticker atoms here
```
**Classes:** `.o-stage`, `.o-stage--drop-active`, `.o-stage__canvas`, `.o-stage__layer`
**Tokens:** `--color-surface-stage`, `--color-drop-target`, `--shadow-md`, `--z-stage`, `--space-4`, `--duration-fast`

---

# Templates

## WorkspaceLayout
A CSS grid with the sidebar on the left (full height), the toolbar on top, and the stage filling the rest. Each region is a slot (`data-slot`).

**File:** [`templates/WorkspaceLayout.js`](../assets/js/components/templates/WorkspaceLayout.js) · **Returns:** `HTMLDivElement`

| Prop | Type | Required | Description |
|---|---|---|---|
| `sidebar` | `Node` | no | Content for `<aside data-slot="sidebar">` |
| `toolbar` | `Node` | no | Content for `<header data-slot="toolbar">` |
| `stage` | `Node` | no | Content for `<main data-slot="stage">` |

**Classes:** `.t-workspace`, `.t-workspace__sidebar`, `.t-workspace__toolbar`, `.t-workspace__stage`
**Tokens:** `--size-sidebar`, `--size-toolbar`, `--color-border`, `--color-surface`
**Accessibility:** uses the landmarks `aside` (labelled "Terms"), `header` and `main`.

---

# Pages

## MatchWordPage
The app's only page: a `WorkspaceLayout` with empty slots. `AppView` mounts it and passes each slot (via `getSlot(page, name)`) to its view.

**File:** [`pages/MatchWordPage.js`](../assets/js/components/pages/MatchWordPage.js) · **Built from:** `WorkspaceLayout`

```js
const page = MatchWordPage();
const sidebarSlot = getSlot(page, 'sidebar');
```

---

## Adding a new component

1. Choose the lowest level that fits, and create `assets/js/components/{level}/{Name}.js` with a JSDoc props header.
2. Add its styles to the matching CSS file, using the level prefix, BEM and tokens only.
3. Add a section to this file under the right level: purpose, props table, classes, tokens and accessibility.
