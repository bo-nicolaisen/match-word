import { mount } from '../core/dom.js';
import { MatchWordPage, getSlot } from '../../components/pages/MatchWordPage.js';
import { SidebarView } from './SidebarView.js';
import { ToolbarView } from './ToolbarView.js';
import { StageView } from './StageView.js';

/** Mounts the page and creates one view per slot. */
export class AppView {
  /**
   * @param {HTMLElement} root
   * @param {{terms, screenshot, stickers}} models
   * @param {Object} handlers - all controller callbacks, passed through to the sub-views
   */
  constructor(root, { terms, screenshot, stickers }, handlers) {
    const page = MatchWordPage();
    mount(root, page);

    this.sidebar = new SidebarView(getSlot(page, 'sidebar'), terms, handlers);
    this.toolbar = new ToolbarView(getSlot(page, 'toolbar'), screenshot, stickers, handlers);
    this.stage = new StageView(getSlot(page, 'stage'), screenshot, stickers, handlers);
  }

  render() {
    this.sidebar.render();
    this.toolbar.render();
    this.stage.render();
  }
}
