import { el } from '../../app/core/dom.js';
import { Icon } from './Icon.js';

/**
 * Atom: Sticker – a placed term, positioned in % of the image. Centered on (x, y).
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.label
 * @param {string} [props.explanation] - shown as native tooltip
 * @param {number} props.x - left in %
 * @param {number} props.y - top in %
 * @param {(e: PointerEvent, id: string) => void} [props.onPointerDown] - start of a move
 * @param {(e: KeyboardEvent, id: string) => void} [props.onKeyDown] - arrow keys / Delete
 * @param {(id: string) => void} [props.onRemove]
 * @returns {HTMLDivElement}
 */
export function Sticker({ id, label, explanation, x, y, onPointerDown, onKeyDown, onRemove }) {
  const remove = el(
    'button',
    {
      type: 'button',
      class: 'a-sticker__remove',
      'aria-label': `Remove ${label}`,
      tabIndex: -1,
      onPointerdown: (e) => e.stopPropagation(),
      onClick: () => onRemove?.(id),
    },
    Icon({ name: 'close' }),
  );

  return el(
    'div',
    {
      class: 'a-sticker',
      tabIndex: 0,
      role: 'button',
      title: explanation,
      'aria-label': `${label}. Arrow keys move, Delete removes.`,
      dataset: { stickerId: id },
      style: { left: `${x}%`, top: `${y}%` },
      onPointerdown: (e) => onPointerDown?.(e, id),
      onKeydown: (e) => onKeyDown?.(e, id),
      onDblclick: () => onRemove?.(id),
    },
    el('span', { class: 'a-sticker__label' }, label),
    remove,
  );
}
