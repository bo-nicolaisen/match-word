/**
 * Atom: Icon – small inline SVG icon that uses the current text color.
 * @param {Object} props
 * @param {'close'|'paste'|'image'|'trash'|'copy'|'check'} props.name
 * @param {string} [props.className]
 * @returns {SVGElement}
 */
const PATHS = {
  close: 'M6 6l12 12M18 6L6 18',
  paste: 'M9 4h6v3H9zM7 6H5v15h14V6h-2M9 12h6M9 16h4',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  check: 'M5 12l5 5 9-10',
};

export function Icon({ name, className = '' }) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', `a-icon ${className}`.trim());
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', PATHS[name] ?? '');
  svg.append(path);
  return svg;
}
