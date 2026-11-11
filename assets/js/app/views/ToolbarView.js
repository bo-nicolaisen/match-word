import { mount } from '../core/dom.js';
import { Toolbar } from '../../components/organisms/Toolbar.js';

/** How long "Copied!" / "Copy failed" stays on the button before it resets. */
const COPY_FEEDBACK_MS = 2000;
/** How long a toolbar notice is shown. */
const NOTICE_MS = 5000;

/** Renders the Toolbar organism from ScreenshotModel and StickerModel. */
export class ToolbarView {
  #copyState = 'idle';
  #resetTimer = null;
  #notice = '';
  #noticeTimer = null;

  /**
   * @param {HTMLElement} slot
   * @param {import('../models/ScreenshotModel.js').ScreenshotModel} screenshot
   * @param {import('../models/StickerModel.js').StickerModel} stickers
   * @param {{onImageChange: Function, onPasteImage: Function, onCopySnapshot: Function, onClearStickers: Function}} handlers
   */
  constructor(slot, screenshot, stickers, handlers) {
    this.slot = slot;
    this.screenshot = screenshot;
    this.stickers = stickers;
    this.handlers = handlers;
    screenshot.on('change', () => this.render());
    stickers.on('change', () => this.render());
  }

  /**
   * Show copy progress/result on the copy button. Result states reset to 'idle' after a moment.
   * @param {'idle'|'copying'|'copied'|'downloaded'|'error'} state
   */
  setCopyState(state) {
    clearTimeout(this.#resetTimer);
    this.#copyState = state;
    this.render();
    if (state !== 'idle' && state !== 'copying') {
      this.#resetTimer = setTimeout(() => this.setCopyState('idle'), COPY_FEEDBACK_MS);
    }
  }

  /**
   * Show a short message in the toolbar (e.g. why a paste failed). Clears itself after a while.
   * @param {string} message
   */
  showNotice(message) {
    clearTimeout(this.#noticeTimer);
    this.#notice = message;
    this.render();
    this.#noticeTimer = setTimeout(() => {
      this.#notice = '';
      this.render();
    }, NOTICE_MS);
  }

  get copyState() {
    return this.#copyState;
  }

  render() {
    const focusedId = document.activeElement?.id;
    mount(
      this.slot,
      Toolbar({
        images: this.screenshot.manifest,
        value: this.screenshot.assetSrc,
        stickerCount: this.stickers.stickers.length,
        hasImage: Boolean(this.screenshot.src),
        isPasted: Boolean(this.screenshot.src) && !this.screenshot.assetSrc,
        copyState: this.#copyState,
        notice: this.#notice,
        ...this.handlers,
      }),
    );
    if (focusedId) this.slot.querySelector(`#${CSS.escape(focusedId)}`)?.focus();
  }
}
