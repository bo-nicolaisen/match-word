import { EventEmitter } from '../core/EventEmitter.js';

/**
 * Subjects and their technical terms, loaded from JSON.
 * Emits 'change' when data loads or the active subject changes.
 */
export class TermsModel extends EventEmitter {
  subjects = [];
  activeSubjectId = null;

  constructor(url = 'assets/data/terms.json') {
    super();
    this.url = url;
  }

  async load() {
    const res = await fetch(this.url);
    if (!res.ok) throw new Error(`Could not load ${this.url} (${res.status})`);
    const data = await res.json();
    this.subjects = data.subjects ?? [];
    this.activeSubjectId = this.subjects[0]?.id ?? null;
    this.emit('change');
  }

  setSubject(id) {
    if (id === this.activeSubjectId) return;
    this.activeSubjectId = id;
    this.emit('change');
  }

  get activeSubject() {
    return this.subjects.find((s) => s.id === this.activeSubjectId) ?? null;
  }

  get activeTerms() {
    return this.activeSubject?.terms ?? [];
  }

  /** Look up a term across all subjects. */
  findTerm(termId) {
    for (const subject of this.subjects) {
      const term = subject.terms.find((t) => t.id === termId);
      if (term) return term;
    }
    return null;
  }
}
