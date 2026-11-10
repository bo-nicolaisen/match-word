import { EventEmitter } from '../core/EventEmitter.js';

/**
 * The current screenshot (pasted blob or bundled asset) and the list of bundled images.
 * Emits 'change' when the image or manifest changes.
 */
export class ScreenshotModel extends EventEmitter {
  /** @type {{title: string, src: string}[]} */
  manifest = [];
  src = null;
  /** asset path of the selected bundled image, or null for a pasted image */
  assetSrc = null;
  #objectUrl = null;

  constructor(url = 'assets/data/screenshots.json') {
    super();
    this.url = url;
  }

  async loadManifest() {
    const res = await fetch(this.url);
    if (!res.ok) throw new Error(`Could not load ${this.url} (${res.status})`);
    this.manifest = await res.json();
    this.emit('change');
  }

  /** Use a pasted/dropped image file. */
  setFromBlob(blob) {
    this.#revoke();
    this.#objectUrl = URL.createObjectURL(blob);
    this.src = this.#objectUrl;
    this.assetSrc = null;
    this.emit('change');
  }

  /** Use a bundled image from the manifest. Empty string clears the image. */
  setFromAsset(src) {
    this.#revoke();
    this.src = src || null;
    this.assetSrc = src || null;
    this.emit('change');
  }

  #revoke() {
    if (this.#objectUrl) URL.revokeObjectURL(this.#objectUrl);
    this.#objectUrl = null;
  }
}
