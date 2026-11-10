/** Minimal pub/sub. Models extend this and emit 'change'. */
export class EventEmitter {
  #listeners = new Map();

  /** @returns {() => void} unsubscribe function */
  on(event, fn) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(fn);
    return () => this.#listeners.get(event).delete(fn);
  }

  emit(event, payload) {
    this.#listeners.get(event)?.forEach((fn) => fn(payload));
  }
}
