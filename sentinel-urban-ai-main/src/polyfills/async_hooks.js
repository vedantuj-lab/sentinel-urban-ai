// Minimal stub for Node's async_hooks used by TanStack Start in the browser.
// Provides a no‑op createHook and a dummy AsyncLocalStorage implementation.
export function createHook() {
  return { enable: () => {}, disable: () => {} };
}
export class AsyncLocalStorage {
  constructor() {
    this.store = undefined;
  }
  run(store, callback) {
    this.store = store;
    const result = callback();
    this.store = undefined;
    return result;
  }
  getStore() {
    return this.store;
  }
}
export default { createHook, AsyncLocalStorage };
