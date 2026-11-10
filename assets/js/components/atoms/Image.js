import { el } from '../../app/core/dom.js';

/**
 * Atom: Image – the screenshot image. Native image dragging is disabled
 * so it doesn't interfere with dropping terms.
 * @param {Object} props
 * @param {string} props.src
 * @param {string} [props.alt='']
 * @param {(e: Event) => void} [props.onLoad]
 * @returns {HTMLImageElement}
 */
export function Image({ src, alt = '', onLoad }) {
  return el('img', { class: 'a-image', src, alt, draggable: false, onLoad });
}
