import { EventEmitter } from '../core/EventEmitter.js';

/**
 * @typedef {Object} Sticker
 * @property {string} id
 * @property {string} termId
 * @property {string} label
 * @property {string} explanation
 * @property {number} x - left position in % of the image width
 * @property {number} y - top position in % of the image height
 */

/** Stickers placed on the current screenshot. Not persisted. Emits 'change'. */
export class StickerModel extends EventEmitter {
  /** @type {Sticker[]} */
  stickers = [];
  #nextId = 1;

  add(term, x, y) {
    this.stickers.push({
      id: `s${this.#nextId++}`,
      termId: term.id,
      label: term.term,
      explanation: term.explanation,
      x: clamp(x),
      y: clamp(y),
    });
    this.emit('change');
  }

  move(id, x, y) {
    const sticker = this.stickers.find((s) => s.id === id);
    if (!sticker) return;
    sticker.x = clamp(x);
    sticker.y = clamp(y);
    this.emit('change');
  }

  remove(id) {
    this.stickers = this.stickers.filter((s) => s.id !== id);
    this.emit('change');
  }

  clear() {
    if (!this.stickers.length) return;
    this.stickers = [];
    this.emit('change');
  }
}

const clamp = (n) => Math.min(100, Math.max(0, n));
