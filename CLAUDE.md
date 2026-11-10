# CLAUDE.md – Match Word

Vanilla JS (ES modules, no build step), MVC, UI built with atomic design. Serve over http (Live Server / `npx serve .`).

## The wiki is the source of truth

All documentation lives in the GitHub wiki: https://github.com/bo-nicolaisen/match-word/wiki
It is a separate git repo, cloned locally into `.wiki/` (gitignored).

| Wiki page | Documents |
|---|---|
| `Components.md` | Every file in `assets/js/components/` (atoms → molecules → organisms → templates → pages) |
| `Modules.md` | Everything else in `assets/js/` (site.js, core, models, views, controllers) and `assets/data/*.json` |
| `Design-Tokens.md` | Every custom property in `assets/css/tokens.css` |
| `Home.md`, `_Sidebar.md` | Page index and navigation. Add new pages or sections here. |

Do not create documentation in the code repo (no `docs/` folder). The README only covers running the app and links to the wiki.

## Workflow – every task that touches code

### 1. Before writing code: read the wiki
```bash
# first time
git clone https://github.com/bo-nicolaisen/match-word.wiki.git .wiki
# every task
git -C .wiki pull
```
- Read the pages that cover the area you're changing. Find existing components, models, handlers, tokens and conventions, and **reuse them before creating anything new**.
- Pick a component's atomic level from the rules on `Components.md`. Pick colors, spacing and so on from `Design-Tokens.md`.
- If the wiki and the code disagree, point out the conflict to the user instead of silently picking one.

### 2. While writing code: follow the documented conventions
- Components are pure functions `props → HTMLElement`, built with `el()`. They never import models or controllers, and they report user actions through callback props.
- Each component file starts with a JSDoc header listing its props.
- CSS goes in the file for the component's level (`atoms.css`, `molecules.css`, …), with BEM classes and the level prefix (`.a-`, `.m-`, `.o-`, `.t-`), and **uses tokens only**. Add a new token to `tokens.css` first.
- Models emit `'change'` and hold no DOM. Views render into a page slot. Controllers change the models.

### 3. After writing code: update the wiki in the same task
Every new, changed, renamed or deleted module, component, token or data format must be reflected in the wiki **before the task is done**:
- **New component:** add a section under its level in `Components.md`: purpose, file link, what it's built from, props table, classes and modifiers, tokens used, accessibility notes and a usage snippet.
- **New or changed module:** add or update its section in `Modules.md`: file link, exports, members and methods table, events it emits, and what it listens to or depends on.
- **New or changed token:** update `Design-Tokens.md`, including its value and where it's used.
- **Deleted or renamed:** remove or rename the section, and fix links in `Home.md` and `_Sidebar.md`.
- Links to source files use `https://github.com/bo-nicolaisen/match-word/blob/main/<path>`. Links between wiki pages use the page name, e.g. `[Modules](Modules#models)`.

Then run the coverage check below. It must print nothing. Commit and push the wiki:
```bash
git -C .wiki add -A && git -C .wiki commit -m "<what changed>" && git -C .wiki push
```
The wiki is published as soon as it's pushed, so pushing it is part of the task. Commit and push the **code** repo only when the user asks.

## Coverage check (run from the repo root, must print nothing)
```bash
# components without a section in Components.md
for f in assets/js/components/*/*.js; do n=$(basename "$f" .js); grep -q "^## $n$" .wiki/Components.md || echo "undocumented component: $n"; done
# modules without a section in Modules.md
for f in assets/js/site.js assets/js/app/*/*.js assets/data/*.json; do n=$(basename "$f" .js); grep -q "^## $n$" .wiki/Modules.md || echo "undocumented module: $n"; done
# tokens missing from Design-Tokens.md
for t in $(grep -oE "^\s+--[a-z0-9-]+" assets/css/tokens.css | tr -d ' '); do grep -q -- "\`$t\`" .wiki/Design-Tokens.md || echo "undocumented token: $t"; done
# CSS variables used but not defined
grep -ohE "var\(--[a-z0-9-]+" assets/css/*.css | sed 's/var(//' | sort -u | while read v; do grep -q "^\s*$v:" assets/css/tokens.css || echo "undefined token: $v"; done
```
