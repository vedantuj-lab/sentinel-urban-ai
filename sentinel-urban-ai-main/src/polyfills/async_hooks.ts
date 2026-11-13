// Stub for Node's async_hooks used by TanStack Start in the browser
// Provides a dummy createHook and a minimal AsyncLocalStorage implementation.

export function createHook() {
  return {
    enable: () => {},
    disable: () => {},
  };
}

export class AsyncLocalStorage<T = any> {
  private store: T | undefined = undefined;

  constructor() {
    this.store = undefined;
  }

  run<R>(store: T, callback: () => R): R {
    this.store = store;
    const result = callback();
    this.store = undefined;
    return result;
  }

  getStore(): T | undefined {
    return this.store;
  }
}

export default { createHook, AsyncLocalStorage };
