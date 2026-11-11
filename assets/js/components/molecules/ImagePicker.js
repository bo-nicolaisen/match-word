import { el } from '../../app/core/dom.js';
import { Select } from '../atoms/Select.js';
import { Icon } from '../atoms/Icon.js';

/** Special option values (never valid image paths). */
const PASTE = '__paste__';
const PASTED = '__pasted__';

/**
 * Molecule: ImagePicker – choose the background image: a bundled example,
 * "Paste image from clipboard", or (when one is shown) the pasted image.
 * @param {Object} props
 * @param {{title: string, src: string}[]} props.images
 * @param {string|null} props.value - src of the selected asset, null when none or a pasted image is shown
 * @param {boolean} [props.isPasted=false] - a pasted/dropped image is shown; adds and selects "Pasted image"
 * @param {(src: string) => void} props.onChange - an example was chosen; '' means "none"
 * @param {() => void} props.onPaste - "Paste image from clipboard" was chosen
 * @returns {HTMLDivElement}
 */
export function ImagePicker({ images, value, isPasted = false, onChange, onPaste }) {
  const id = 'image-picker';
  const current = isPasted ? PASTED : (value ?? '');

  const select = Select({
    id,
    value: current,
    options: [
      { value: '', label: '— choose an image —' },
      { value: PASTE, label: '📋 Paste image from clipboard…' },
      ...(isPasted ? [{ value: PASTED, label: 'Pasted image' }] : []),
      ...images.map((i) => ({ value: i.src, label: i.title })),
    ],
    onChange: (v) => {
      if (v === PASTE) {
        select.value = current; // keep showing the current image until the paste succeeds
        onPaste();
      } else if (v !== PASTED) {
        onChange(v);
      }
    },
  });

  return el(
    'div',
    { class: 'm-field m-field--inline' },
    el('label', { class: 'm-field__label', for: id }, Icon({ name: 'image' }), 'Image'),
    select,
  );
}
