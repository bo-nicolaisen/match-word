import { el } from '../../app/core/dom.js';
import { WordChip } from '../atoms/WordChip.js';

/**
 * Molecule: TermItem – a WordChip with its explanation shown as a tooltip on hover/focus.
 * @param {Object} props
 * @param {{id: string, term: string, explanation: string}} props.term
 * @param {(e: DragEvent, termId: string) => void} props.onDragStart
 * @param {(termId: string) => void} [props.onActivate] - keyboard placement
 * @returns {HTMLLIElement}
 */
export function TermItem({ term, onDragStart, onActivate }) {
  const tipId = `tip-${term.id}`;
  return el(
    'li',
    { class: 'm-term-item' },
    WordChip({ label: term.term, termId: term.id, onDragStart, onActivate, describedBy: tipId }),
    el('span', { class: 'm-term-item__tip', id: tipId, role: 'tooltip' }, term.explanation),
  );
}
