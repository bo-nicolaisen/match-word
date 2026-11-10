import { el } from '../../app/core/dom.js';

/**
 * Atom: WordChip – a draggable pill holding one term.
 * @param {Object} props
 * @param {string} props.label - the term text
 * @param {string} props.termId - written to dataTransfer on drag
 * @param {(e: DragEvent, termId: string) => void} [props.onDragStart]
 * @param {(termId: string) => void} [props.onActivate] - Enter/Space; keyboard alternative to dragging
 * @param {string} [props.describedBy] - id of an element describing the term
 * @returns {HTMLSpanElement}
 */
export function WordChip({ label, termId, onDragStart, onActivate, describedBy }) {
  const chip = el(
    'span',
    {
      class: 'a-chip',
      draggable: true,
      tabIndex: 0,
      role: 'button',
      'aria-describedby': describedBy,
      dataset: { termId },
      onDragstart: (e) => {
        chip.classList.add('a-chip--dragging');
        onDragStart?.(e, termId);
      },
      onDragend: () => chip.classList.remove('a-chip--dragging'),
      onKeydown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate?.(termId);
        }
      },
    },
    label,
  );
  return chip;
}
