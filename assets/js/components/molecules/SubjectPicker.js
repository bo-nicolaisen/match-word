import { el } from '../../app/core/dom.js';
import { Select } from '../atoms/Select.js';

/**
 * Molecule: SubjectPicker – label + Select for choosing a subject.
 * @param {Object} props
 * @param {{id: string, name: string}[]} props.subjects
 * @param {string} props.activeId
 * @param {(id: string) => void} props.onChange
 * @returns {HTMLDivElement}
 */
export function SubjectPicker({ subjects, activeId, onChange }) {
  const id = 'subject-picker';
  return el(
    'div',
    { class: 'm-field' },
    el('label', { class: 'm-field__label', for: id }, 'Subject'),
    Select({ id, value: activeId, options: subjects.map((s) => ({ value: s.id, label: s.name })), onChange }),
  );
}
