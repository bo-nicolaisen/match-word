import { el } from '../../app/core/dom.js';

/**
 * Atom: Select – native dropdown.
 * @param {Object} props
 * @param {{value: string, label: string}[]} props.options
 * @param {string} [props.value] - selected value
 * @param {string} [props.id] - for pairing with a <label>
 * @param {(value: string) => void} [props.onChange]
 * @returns {HTMLSelectElement}
 */
export function Select({ options, value = '', id, onChange }) {
  const select = el(
    'select',
    { class: 'a-select', id, onChange: (e) => onChange?.(e.target.value) },
    options.map((o) => el('option', { value: o.value }, o.label)),
  );
  select.value = value;
  return select;
}
