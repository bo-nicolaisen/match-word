import { mount } from '../core/dom.js';
import { Toolbar } from '../../components/organisms/Toolbar.js';

/** Renders the Toolbar organism from ScreenshotModel and StickerModel. */
export class ToolbarView {
  /**
   * @param {HTMLElement} slot
   * @param {import('../models/ScreenshotModel.js').ScreenshotModel} screenshot
   * @param {import('../models/StickerModel.js').StickerModel} stickers
   * @param {{onImageChange: Function, onClearStickers: Function}} handlers
   */
  constructor(slot, screenshot, stickers, handlers) {
    this.slot = slot;
    this.screenshot = screenshot;
    this.stickers = stickers;
    this.handlers = handlers;
    screenshot.on('change', () => this.render());
    stickers.on('change', () => this.render());
  }

  render() {
    const focusedId = document.activeElement?.id;
    mount(
      this.slot,
      Toolbar({
        images: this.screenshot.manifest,
        value: this.screenshot.assetSrc,
        stickerCount: this.stickers.stickers.length,
        ...this.handlers,
      }),
    );
    if (focusedId) this.slot.querySelector(`#${CSS.escape(focusedId)}`)?.focus();
  }
}
