import { el } from '../../app/core/dom.js';
import { ImagePicker } from '../molecules/ImagePicker.js';
import { Button } from '../atoms/Button.js';
import { Icon } from '../atoms/Icon.js';

/**
 * Organism: Toolbar – app title, example image picker and "clear stickers".
 * @param {Object} props
 * @param {{title: string, src: string}[]} props.images
 * @param {string|null} props.value - selected asset src
 * @param {number} props.stickerCount
 * @param {(src: string) => void} props.onImageChange
 * @param {() => void} props.onClearStickers
 * @returns {HTMLDivElement}
 */
export function Toolbar({ images, value, stickerCount, onImageChange, onClearStickers }) {
  return el(
    'div',
    { class: 'o-toolbar' },
    el('h1', { class: 'o-toolbar__title' }, 'Match Word'),
    ImagePicker({ images, value, onChange: onImageChange }),
    el('span', { class: 'o-toolbar__spacer' }),
    Button({
      label: `Clear stickers (${stickerCount})`,
      variant: 'ghost',
      icon: Icon({ name: 'trash' }),
      disabled: stickerCount === 0,
      onClick: onClearStickers,
    }),
  );
}
