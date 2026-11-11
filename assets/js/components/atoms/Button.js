import { el } from '../../app/core/dom.js';

/**
 * Atom: Button
 * @param {Object} props
 * @param {string} [props.label] - visible text
 * @param {'primary'|'ghost'|'icon'} [props.variant='primary']
 * @param {Element} [props.icon] - optional Icon atom placed before the label
 * @param {string} [props.ariaLabel] - required when variant is 'icon'
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.id] - lets a view restore focus after re-rendering
 * @param {(e: MouseEvent) => void} [props.onClick]
 * @returns {HTMLButtonElement}
 */
export function Button({ label = '', variant = 'primary', icon, ariaLabel, disabled = false, id, onClick }) {
  return el(
    'button',
    {
      type: 'button',
      id,
      class: ['a-button', `a-button--${variant}`],
      'aria-label': ariaLabel,
      disabled,
      onClick,
    },
    icon,
    label && el('span', { class: 'a-button__label' }, label),
  );
}
