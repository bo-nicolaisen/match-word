import { el } from '../../app/core/dom.js';
import { Select } from '../atoms/Select.js';
import { Icon } from '../atoms/Icon.js';

/**
 * Molecule: ImagePicker – choose one of the bundled screenshots.
 * @param {Object} props
 * @param {{title: string, src: string}[]} props.images
 * @param {string|null} props.value - src of the selected asset, null when a pasted image is shown
 * @param {(src: string) => void} props.onChange - '' means "none"
 * @returns {HTMLDivElement}
 */
export function ImagePicker({ images, value, onChange }) {
  const id = 'image-picker';
  return el(
    'div',
    { class: 'm-field m-field--inline' },
    el('label', { class: 'm-field__label', for: id }, Icon({ name: 'image' }), 'Example'),
    Select({
      id,
      value: value ?? '',
      options: [{ value: '', label: '— choose an image —' }, ...images.map((i) => ({ value: i.src, label: i.title }))],
      onChange,
    }),
  );
}
