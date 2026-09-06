export const HERO_READY_EVENT = 'delie:hero-ready';

export function signalHeroReady() {
  if (typeof window === 'undefined') return;
  if (window.__DELIE_HERO_READY) return;
  window.__DELIE_HERO_READY = true;
  window.dispatchEvent(new Event(HERO_READY_EVENT));
}

export function onHeroReady(callback) {
  if (typeof window === 'undefined') return () => {};
  if (window.__DELIE_HERO_READY) {
    callback();
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener(HERO_READY_EVENT, handler);
  return () => window.removeEventListener(HERO_READY_EVENT, handler);
}
