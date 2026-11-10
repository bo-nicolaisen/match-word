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

  #loadImageBlob(blob) {
    if (!blob) return;
    this.models.stickers.clear();
    this.models.screenshot.setFromBlob(blob);
  }

  #loadErrorMessage(error) {
    console.error(error);
    return location.protocol === 'file:'
      ? 'Could not load the terms. Open the page through a local server (e.g. VS Code Live Server), not as a file.'
      : `Could not load the terms: ${error.message}`;
  }
}
