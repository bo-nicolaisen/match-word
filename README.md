# Match Word

Drag technical terms onto a screenshot of a landing page. Each term becomes a sticker that you can move later. It's a way to practise naming the parts of a web page.

- Paste a screenshot (`Win+Shift+S`, then `Ctrl+V` on the page), drop an image file, or pick a bundled example.
- Choose a subject in the left sidebar (HTML, CSS, UX/UI…) and drag its terms onto the image.
- Drag a sticker to move it, and double-click it or press × to remove it.
- Keyboard: focus a term and press Enter to place it. On a sticker, arrow keys move it (Shift for bigger steps) and Delete removes it.
- Stickers are not saved. They are cleared when the image changes or the page reloads.

## Run

The app loads JSON with `fetch()`, so it must be served over http. Opening it as a file (`file://`) won't work.

- VS Code: **Live Server** → "Open with Live Server", or
- `npx serve .` and open the URL it prints.

No build step and no dependencies: just vanilla JavaScript ES modules.

## Content

### Add or edit terms: [`assets/data/terms.json`](assets/data/terms.json)
```json
{ "subjects": [
  { "id": "html", "name": "HTML", "terms": [
    { "id": "html-nav", "term": "<nav>", "explanation": "Semantic element for navigation links." }
  ]}
]}
```
Term `id`s must be unique across all subjects.

### Add example screenshots: [`assets/data/screenshots.json`](assets/data/screenshots.json)
Put the image in `assets/img/screenshots/` and add an entry:
```json
{ "title": "Example: My site", "src": "assets/img/screenshots/my-site.png" }
```

## Architecture

```
assets/js/
  site.js                 entry point
  app/
    core/                 EventEmitter (pub/sub), dom helpers
    models/               TermsModel, ScreenshotModel, StickerModel   – state, no DOM
    views/                AppView, SidebarView, ToolbarView, StageView – render components from models
    controllers/          AppController (wiring, paste), DragController (drop, move, keyboard)
  components/             atomic design: atoms → molecules → organisms → templates → pages
assets/css/               tokens.css + one file per atomic level
```

- **MVC:** models emit `change`, views re-render, and component callbacks go to the controllers, which update the models.
- **Atomic design:** components are pure functions `props → HTMLElement` and never touch models.
- Sticker positions are stored as **percentages of the image**, so they stay in place when the image is resized.

## Documentation

- [Components](docs/components.md): every atom, molecule, organism, template and page, with props, classes, tokens and accessibility notes.
- [Design tokens](docs/design-tokens.md): all CSS custom properties, their values, where they are used, and the rules for using them.
