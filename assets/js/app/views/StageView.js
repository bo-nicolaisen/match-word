import { mount } from '../core/dom.js';
import { Stage } from '../../components/organisms/Stage.js';
import { Sticker } from '../../components/atoms/Sticker.js';

/**
 * Renders the Stage organism. The image is only replaced when its src changes;
 * sticker changes re-render just the sticker layer, so scroll position is kept.
 */
export class StageView {
  #src = undefined;

  /**
   * @param {HTMLElement} slot
   * @param {import('../models/ScreenshotModel.js').ScreenshotModel} screenshot
   * @param {import('../models/StickerModel.js').StickerModel} stickers
   * @param {{onDragOver: Function, onDragLeave: Function, onDrop: Function,
   *          onStickerPointerDown: Function, onStickerKeyDown: Function, onStickerRemove: Function}} handlers
   */
  constructor(slot, screenshot, stickers, handlers) {
    this.slot = slot;
    this.screenshot = screenshot;
    this.stickers = stickers;
    this.handlers = handlers;
    screenshot.on('change', () => this.render());
    stickers.on('change', () => this.renderStickers());
  }

  /** The positioned wrapper around the image; sticker % are relative to it. */
  get canvas() {
    return this.slot.querySelector('.o-stage__canvas');
  }

  /** The scroll container. */
  get scroller() {
    return this.slot.querySelector('.o-stage');
  }

  setDropActive(active) {
    this.scroller?.classList.toggle('o-stage--drop-active', active);
  }

  render() {
    if (this.screenshot.src === this.#src) return;
    this.#src = this.screenshot.src;
    const { onDragOver, onDragLeave, onDrop } = this.handlers;
    mount(this.slot, Stage({ src: this.#src, onDragOver, onDragLeave, onDrop }));
    this.renderStickers();
  }

  renderStickers() {
    const layer = this.slot.querySelector('.o-stage__layer');
    if (!layer) return;
    const focusedId = document.activeElement?.dataset?.stickerId;
    const { onStickerPointerDown, onStickerKeyDown, onStickerRemove } = this.handlers;
    mount(
      layer,
      this.stickers.stickers.map((s) =>
        Sticker({
          ...s,
          onPointerDown: onStickerPointerDown,
          onKeyDown: onStickerKeyDown,
          onRemove: onStickerRemove,
        }),
      ),
    );
    if (focusedId) layer.querySelector(`[data-sticker-id="${focusedId}"]`)?.focus();
  }
}
