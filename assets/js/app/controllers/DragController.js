const TERM_MIME = 'application/x-match-word-term';
const KEY_STEP = 1; // % per arrow key press
const KEY_STEP_LARGE = 5; // with Shift

/**
 * Handles all drag interactions:
 *  - HTML5 drag of a term chip from the sidebar → new sticker on drop
 *  - dropping an image file on the stage → new screenshot
 *  - pointer-event moves of existing stickers (mouse + touch)
 *  - keyboard: place a term with Enter, move stickers with arrow keys, remove with Delete
 */
export class DragController {
  #move = null;

  /**
   * @param {{terms, stickers}} models
   * @param {() => import('../views/StageView.js').StageView} getStageView
   * @param {(file: File) => void} onImageFile
   */
  constructor({ terms, stickers }, getStageView, onImageFile) {
    this.terms = terms;
    this.stickers = stickers;
    this.getStageView = getStageView;
    this.onImageFile = onImageFile;
  }

  /** Handlers for the views. Arrow functions keep `this` bound. */
  get handlers() {
    return {
      onTermDragStart: (e, termId) => {
        e.dataTransfer.setData(TERM_MIME, termId);
        e.dataTransfer.setData('text/plain', termId);
        e.dataTransfer.effectAllowed = 'copy';
      },
      onTermActivate: (termId) => this.#placeAtViewCenter(termId),
      onDragOver: (e) => this.#onDragOver(e),
      onDragLeave: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) this.#stage.setDropActive(false);
      },
      onDrop: (e) => this.#onDrop(e),
      onStickerPointerDown: (e, id) => this.#startMove(e, id),
      onStickerKeyDown: (e, id) => this.#onStickerKey(e, id),
      onStickerRemove: (id) => this.stickers.remove(id),
    };
  }

  get #stage() {
    return this.getStageView();
  }

  /** Convert a viewport point to % of the image canvas. */
  #toPercent(clientX, clientY) {
    const rect = this.#stage.canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }

  #onDragOver(e) {
    const types = [...e.dataTransfer.types];
    const isTerm = types.includes(TERM_MIME) && this.#stage.canvas;
    const isFile = types.includes('Files');
    if (!isTerm && !isFile) return;
    e.preventDefault(); // allow drop
    e.dataTransfer.dropEffect = 'copy';
    this.#stage.setDropActive(true);
  }

  #onDrop(e) {
    e.preventDefault();
    this.#stage.setDropActive(false);

    const file = [...e.dataTransfer.files].find((f) => f.type.startsWith('image/'));
    if (file) return this.onImageFile(file);

    const term = this.terms.findTerm(e.dataTransfer.getData(TERM_MIME));
    if (!term || !this.#stage.canvas) return;
    const { x, y } = this.#toPercent(e.clientX, e.clientY);
    this.stickers.add(term, x, y);
  }

  /** Keyboard alternative to dragging: place the term in the middle of the visible part of the image. */
  #placeAtViewCenter(termId) {
    const term = this.terms.findTerm(termId);
    const { canvas, scroller } = this.#stage;
    if (!term || !canvas) return;
    const view = scroller.getBoundingClientRect();
    const { x, y } = this.#toPercent(view.left + view.width / 2, view.top + view.height / 2);
    this.stickers.add(term, x, y);
  }

  #startMove(e, id) {
    if (e.button !== 0) return;
    e.preventDefault();
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    // pointer offset from the sticker center, so it doesn't jump under the cursor
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);

    el.setPointerCapture(e.pointerId);
    el.classList.add('a-sticker--dragging');
    el.focus({ preventScroll: true });
    this.#move = { id, el, offsetX, offsetY, moved: false, x: 0, y: 0 };

    const onMove = (ev) => {
      const pos = this.#toPercent(ev.clientX - offsetX, ev.clientY - offsetY);
      this.#move.x = Math.min(100, Math.max(0, pos.x));
      this.#move.y = Math.min(100, Math.max(0, pos.y));
      this.#move.moved = true;
      el.style.left = `${this.#move.x}%`;
      el.style.top = `${this.#move.y}%`;
    };
    const onUp = () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.classList.remove('a-sticker--dragging');
      const { moved, x, y } = this.#move;
      this.#move = null;
      if (moved) this.stickers.move(id, x, y);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
  }

  #onStickerKey(e, id) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      return this.stickers.remove(id);
    }
    const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!delta) return;
    e.preventDefault();
    const s = this.stickers.stickers.find((st) => st.id === id);
    if (s) this.stickers.move(id, s.x + delta[0], s.y + delta[1]);
  }
}
