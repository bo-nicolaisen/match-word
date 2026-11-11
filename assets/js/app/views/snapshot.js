/**
 * Draw the screenshot and its stickers onto a <canvas> and return it as a PNG blob.
 *
 * Renders at the image's natural resolution. Sticker size, position, colors, font, border,
 * radius and shadow are read from the rendered DOM (getComputedStyle), so the snapshot looks
 * like the screen and keeps following the design tokens.
 *
 * @param {HTMLElement} canvasEl - the `.o-stage__canvas` element (image + sticker layer)
 * @returns {Promise<Blob>} PNG
 */
export async function renderSnapshot(canvasEl) {
  const img = canvasEl.querySelector('.a-image');
  if (!img) throw new Error('No image to snapshot');
  await img.decode().catch(() => {}); // make sure the image is ready to draw

  const box = canvasEl.getBoundingClientRect();
  const scale = Math.min(
    img.naturalWidth ? img.naturalWidth / box.width : 2,
    MAX_SIDE / box.width,
    MAX_SIDE / box.height,
  );

  const out = document.createElement('canvas');
  out.width = Math.round(box.width * scale);
  out.height = Math.round(box.height * scale);
  const ctx = out.getContext('2d');
  ctx.drawImage(img, 0, 0, out.width, out.height);

  for (const sticker of canvasEl.querySelectorAll('.a-sticker')) {
    drawSticker(ctx, sticker, box, scale);
  }

  return new Promise((resolve, reject) =>
    out.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not create PNG'))), 'image/png'),
  );
}

/** Browsers limit canvas size; ~16k px per side is safe in Chrome, Firefox and Safari. */
const MAX_SIDE = 16000;

function drawSticker(ctx, el, box, scale) {
  const style = getComputedStyle(el);
  const label = el.querySelector('.a-sticker__label');
  const labelStyle = getComputedStyle(label);
  const rect = el.getBoundingClientRect();
  const labelRect = label.getBoundingClientRect();
  const border = parseFloat(style.borderTopWidth) || 0;

  // The box ends after the label: the (invisible) remove button is left out.
  const x = (rect.left - box.left) * scale;
  const y = (rect.top - box.top) * scale;
  const w = (labelRect.right - rect.left + parseFloat(style.paddingRight) + border) * scale;
  const h = rect.height * scale;
  const radius = (parseFloat(style.borderTopLeftRadius) || 0) * scale;

  ctx.save();

  const shadow = parseShadow(style.boxShadow);
  if (shadow) {
    ctx.shadowColor = shadow.color;
    ctx.shadowOffsetX = shadow.x * scale;
    ctx.shadowOffsetY = shadow.y * scale;
    ctx.shadowBlur = shadow.blur * scale;
  }
  ctx.fillStyle = style.backgroundColor;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
  ctx.restore();

  if (border) {
    ctx.save();
    ctx.lineWidth = border * scale;
    ctx.strokeStyle = style.borderTopColor;
    const inset = (border * scale) / 2;
    ctx.beginPath();
    ctx.roundRect(x + inset, y + inset, w - inset * 2, h - inset * 2, Math.max(0, radius - inset));
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.font = `${labelStyle.fontWeight} ${parseFloat(labelStyle.fontSize) * scale}px ${labelStyle.fontFamily}`;
  ctx.fillStyle = labelStyle.color;
  ctx.textBaseline = 'middle';
  ctx.fillText(label.textContent, (labelRect.left - box.left) * scale, (labelRect.top - box.top + labelRect.height / 2) * scale);
  ctx.restore();
}

/** Parse the first computed box-shadow, e.g. "rgba(0, 0, 0, 0.18) 0px 4px 12px 0px". */
function parseShadow(value) {
  if (!value || value === 'none') return null;
  const color = value.match(/rgba?\([^)]*\)|#[0-9a-f]+/i)?.[0];
  const [x = 0, y = 0, blur = 0] = value.replace(color ?? '', '').match(/-?[\d.]+(?=px)/g)?.map(Number) ?? [];
  return color ? { color, x, y, blur } : null;
}
