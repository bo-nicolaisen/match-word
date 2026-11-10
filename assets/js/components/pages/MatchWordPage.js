import { WorkspaceLayout } from '../templates/WorkspaceLayout.js';

/**
 * Page: MatchWordPage – the app's only page. Uses WorkspaceLayout with empty slots;
 * SidebarView, ToolbarView and StageView render their organisms into the slots.
 * @returns {HTMLDivElement}
 */
export function MatchWordPage() {
  return WorkspaceLayout();
}

/** Find a named slot in the page. */
export const getSlot = (page, name) => page.querySelector(`[data-slot="${name}"]`);
