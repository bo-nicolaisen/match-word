import { el } from '../../app/core/dom.js';
import { Icon } from '../atoms/Icon.js';

/**
 * Molecule: PasteZone – empty state shown on the stage before an image is loaded.
 * @param {Object} [props]
 * @param {string} [props.title='No screenshot yet']
 * @returns {HTMLDivElement}
 */
export function PasteZone({ title = 'No screenshot yet' } = {}) {
  return el(
    'div',
    { class: 'm-paste-zone' },
    Icon({ name: 'paste', className: 'm-paste-zone__icon' }),
    el('p', { class: 'm-paste-zone__title' }, title),
    el(
      'p',
      { class: 'm-paste-zone__hint' },
      'Take a screenshot (',
      el('kbd', {}, 'Win'), '+', el('kbd', {}, 'Shift'), '+', el('kbd', {}, 'S'),
      ') and press ',
      el('kbd', {}, 'Ctrl'), '+', el('kbd', {}, 'V'),
      ' here, drop an image file, or choose an example above.',
    ),
  );
}
