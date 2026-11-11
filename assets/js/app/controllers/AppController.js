import { TermsModel } from '../models/TermsModel.js';
import { ScreenshotModel } from '../models/ScreenshotModel.js';
import { StickerModel } from '../models/StickerModel.js';
import { AppView } from '../views/AppView.js';
import { DragController } from './DragController.js';

/** Creates models and views, connects them, and handles app-level input (paste, image choice). */
export class AppController {
  /** @param {HTMLElement} root */
  constructor(root) {
    this.root = root;
    this.models = {
      terms: new TermsModel(),
      screenshot: new ScreenshotModel(),
      stickers: new StickerModel(),
    };
  }

  async init() {
    const { terms, screenshot, stickers } = this.models;

    const drag = new DragController(this.models, () => this.view.stage, (file) => this.#loadImageBlob(file));

    this.view = new AppView(this.root, this.models, {
      ...drag.handlers,
      onSubjectChange: (id) => terms.setSubject(id),
      onImageChange: (src) => {
        stickers.clear();
        screenshot.setFromAsset(src);
      },
      onClearStickers: () => stickers.clear(),
      onCopySnapshot: () => this.#copySnapshot(),
      onPasteImage: () => this.#pasteFromClipboard(),
    });
    this.view.render();

    document.addEventListener('paste', (e) => this.#onPaste(e));

    const [termsResult, manifestResult] = await Promise.allSettled([terms.load(), screenshot.loadManifest()]);
    if (termsResult.status === 'rejected') this.view.sidebar.showError(this.#loadErrorMessage(termsResult.reason));
    if (manifestResult.status === 'rejected') console.error(manifestResult.reason);
  }

  #onPaste(e) {
    const item = [...(e.clipboardData?.items ?? [])].find((i) => i.type.startsWith('image/'));
    if (!item) return;
    e.preventDefault();
    this.#loadImageBlob(item.getAsFile());
  }

  /**
   * "Paste image from clipboard" in the image picker: read an image with the async Clipboard API.
   * The browser may ask for permission. If reading is unavailable or blocked, tell the user to use Ctrl+V.
   */
  async #pasteFromClipboard() {
    const { toolbar } = this.view;
    if (!navigator.clipboard?.read) {
      return toolbar.showNotice('Your browser can’t read the clipboard from a menu – press Ctrl+V instead.');
    }
    try {
      for (const item of await navigator.clipboard.read()) {
        const type = item.types.find((t) => t.startsWith('image/'));
        if (type) return this.#loadImageBlob(await item.getType(type));
      }
      toolbar.showNotice('No image on the clipboard – take a screenshot first (Win+Shift+S).');
    } catch (error) {
      console.warn('Clipboard read failed:', error);
      toolbar.showNotice('Clipboard access was blocked – press Ctrl+V instead.');
    }
  }

  #loadImageBlob(blob) {
    if (!blob) return;
    this.models.stickers.clear();
    this.models.screenshot.setFromBlob(blob);
  }

  /**
   * Copy the image with its stickers to the clipboard as a PNG, so students can paste it into a document.
   * If the clipboard can't be used (unsupported browser, not a secure context, permission denied),
   * the PNG is downloaded instead.
   */
  async #copySnapshot() {
    const { toolbar, stage } = this.view;
    if (toolbar.copyState === 'copying' || !stage.canvas) return;
    toolbar.setCopyState('copying');

    // Pass the blob *promise* to ClipboardItem: Safari only allows clipboard writes started
    // directly in the click handler, before any await.
    const pngPromise = stage.snapshot();
    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') throw new Error('Clipboard API unavailable');
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngPromise })]);
      toolbar.setCopyState('copied');
    } catch (clipboardError) {
      console.warn('Copy to clipboard failed, downloading instead:', clipboardError);
      try {
        downloadBlob(await pngPromise, 'match-word.png');
        toolbar.setCopyState('downloaded');
      } catch (renderError) {
        console.error(renderError);
        toolbar.setCopyState('error');
      }
    }
  }

  #loadErrorMessage(error) {
    console.error(error);
    return location.protocol === 'file:'
      ? 'Could not load the terms. Open the page through a local server (e.g. VS Code Live Server), not as a file.'
      : `Could not load the terms: ${error.message}`;
  }
}

/** Save a blob as a file through a temporary <a download> link. */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: filename });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
