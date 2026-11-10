import { el } from '../../app/core/dom.js';

/**
 * Template: WorkspaceLayout – sidebar on the left, toolbar on top, stage filling the rest.
 * Only handles layout. Each region is a slot (`data-slot`) that views render into.
 * @param {Object} [props]
 * @param {Node} [props.sidebar]
 * @param {Node} [props.toolbar]
 * @param {Node} [props.stage]
 * @returns {HTMLDivElement}
 */
export function WorkspaceLayout({ sidebar, toolbar, stage } = {}) {
  return el(
    'div',
    { class: 't-workspace' },
    el('aside', { class: 't-workspace__sidebar', dataset: { slot: 'sidebar' }, 'aria-label': 'Terms' }, sidebar),
    el('header', { class: 't-workspace__toolbar', dataset: { slot: 'toolbar' } }, toolbar),
    el('main', { class: 't-workspace__stage', dataset: { slot: 'stage' } }, stage),
  );
}
