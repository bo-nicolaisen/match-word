import { el } from '../../app/core/dom.js';
import { Image } from '../atoms/Image.js';
import { PasteZone } from '../molecules/PasteZone.js';

/**
 * Organism: Stage – scrollable area holding the screenshot and a sticker layer on top of it.
 * The sticker layer (`.o-stage__layer`) is filled by the view with Sticker atoms, so stickers
 * can be re-rendered without replacing the image or losing the scroll position.
 * @param {Object} props
 * @param {string|null} props.src - image source; null shows the PasteZone
 * @param {(e: DragEvent) => void} props.onDragOver
 * @param {(e: DragEvent) => void} props.onDragLeave
 * @param {(e: DragEvent) => void} props.onDrop
 * @returns {HTMLDivElement}
 */
export function Stage({ src, onDragOver, onDragLeave, onDrop }) {
  return el(
    'div',
    { class: 'o-stage', tabIndex: -1, onDragover: onDragOver, onDragleave: onDragLeave, onDrop },
    src
      ? el(
          'div',
          { class: 'o-stage__canvas' },
          Image({ src, alt: 'Screenshot of a landing page' }),
          el('div', { class: 'o-stage__layer' }),
        )
      : PasteZone(),
  );
}
