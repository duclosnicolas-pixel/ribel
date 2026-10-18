/** RIBEL : contrats de modules (ES modules, indépendants de Three.js).
 * Ces validateurs sont utilisables dès maintenant ; ils n'intègrent pas les scènes historiques.
 */
export const CONTRACT_VERSION = '0.1.0';
export function assertManifest(m, type = 'building') {
  if (!m || typeof m !== 'object') throw new TypeError('Manifest must be an object');
  if (typeof m.id !== 'string' || !m.id.trim()) throw new TypeError('Manifest.id required');
  if (type === 'building' && (!m.zoneId || !m.placement)) throw new TypeError('Building requires zoneId and placement');
  if (m.placement) for (const key of ['x', 'y', 'z', 'rotationY']) {
    if (!Number.isFinite(m.placement[key])) throw new TypeError('Invalid placement.' + key);
  }
  return m;
}
export function assertBuildingInstance(instance) {
  if (!instance || !instance.root) throw new TypeError('Building must return root');
  for (const key of ['update', 'dispose', 'getColliders', 'getInteractionPoints']) {
    if (typeof instance[key] !== 'function') throw new TypeError('Building missing ' + key);
  }
  return instance;
}
export function assertZoneInstance(instance) {
  if (!instance || !instance.root) throw new TypeError('Zone must return root');
  for (const key of ['load', 'unload', 'update', 'dispose']) {
    if (typeof instance[key] !== 'function') throw new TypeError('Zone missing ' + key);
  }
  return instance;
}
export function assertCharacterInstance(instance) {
  if (!instance || !instance.root) throw new TypeError('Character must return root');
  for (const key of ['update', 'serialize', 'restore', 'dispose']) {
    if (typeof instance[key] !== 'function') throw new TypeError('Character missing ' + key);
  }
  return instance;
}
export function createEventBus() {
  const listeners = new Map();
  return {
    on(type, handler) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(handler);
      return () => listeners.get(type)?.delete(handler);
    },
    emit(type, event) {
      for (const fn of listeners.get(type) || []) fn(event);
    },
    clear() { listeners.clear(); },
  };
}
