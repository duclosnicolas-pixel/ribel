/** RIBEL — module de bâtiment « taverne » : l'auberge du Foyer d'Or (zone Z05 Village).
 *
 * Contrat : createBuilding(context, config) → { root, update, dispose, getColliders, getInteractionPoints }
 * + ready (premier niveau affiché), readyAll, setQuality, isFloor, floorHeight, isEnclosed, classifyHit, contains.
 *
 * Modèle : export Meshy fourni par le MOA le 2026-10-23 (4,34 M triangles), rendu en haute qualité
 * par core/hq-building.js (décision MOA du 2026-10-23 : « haute qualité, comme les bâtiments suivants ») :
 *  - « max »    : géométrie complète, textures d'origine, occlusion cuite — téléphone, de près ;
 *  - « casque » : 200 000 triangles, reliefs de la géométrie complète cuits dans sa carte de normales ;
 *  - « loin »   : 52 000 triangles, au-delà de quelques dizaines de mètres.
 * Fichiers : hq/ (voir hq/hq.json et tools/hq/README.md).
 * Circulation : nav.json, calculée sur la géométrie complète. On peut se tenir entre les bancs,
 * sous les arcades et sous l'encorbellement ; l'intérieur reste inaccessible.
 * Portes extérieures : NON ouvrables pour l'instant (décision MOA du 2026-10-23).
 *
 * Le module ne crée ni renderer, ni caméra, ni boucle, ni éclairage global.
 */
import { createHQBuilding } from '../../../core/hq-building.js';

function decodeRle(runs, length) {
  const out = new Uint8Array(length);
  let o = 0;
  for (let i = 0; i < runs.length; i += 2) { out.fill(runs[i], o, o + runs[i + 1]); o += runs[i + 1]; }
  return out;
}

const CLOSED_MESSAGE = "L'auberge est fermée pour l'instant : on visitera l'intérieur plus tard.";

export function createBuilding(context, config = {}) {
  const { THREE } = context;
  const base = config.baseUrl || new URL('./', import.meta.url).href;
  const root = new THREE.Group();
  root.name = 'taverne';
  const placement = config.placement || { x: 0, y: 0, z: 0, rotationY: 0 };
  root.position.set(placement.x, placement.y || 0, placement.z);
  root.rotation.y = placement.rotationY || 0;

  let nav = null, walk = null, floorCm = null, enclosed = null, hq = null;
  let resolveHQ;
  const hqReady = new Promise((r) => { resolveHQ = r; });

  const navReady = fetch(base + 'nav.json').then((r) => { if (!r.ok) throw new Error('nav.json : ' + r.status); return r.json(); }).then((data) => {
    nav = data;
    walk = decodeRle(nav.praticable_rle, nav.nx * nav.nz);
    floorCm = decodeRle(nav.sol_cm_rle, nav.nx * nav.nz);
    enclosed = decodeRle(nav.bati_ferme_rle, nav.nx * nav.nz);
  });

  const specReady = fetch(base + 'hq/hq.json').then((r) => { if (!r.ok) throw new Error('hq.json : ' + r.status); return r.json(); }).then((spec) => {
    hq = createHQBuilding(context, { baseUrl: base + 'hq/', spec, quality: config.quality || 'max', shadows: config.shadows !== false });
    root.add(hq.root);
    resolveHQ(hq);
    return hq.ready;
  });

  const ready = Promise.all([navReady, specReady]).then(() => { root.updateMatrixWorld(true); return api; });

  // ----- Circulation (coordonnées locales, en mètres) -----
  function cellOf(lx, lz) {
    if (!nav) return -1;
    const ix = Math.floor((lx - nav.x0) / nav.cellule), iz = Math.floor((lz - nav.z0) / nav.cellule);
    if (ix < 0 || iz < 0 || ix >= nav.nx || iz >= nav.nz) return -1;
    return iz * nav.nx + ix;
  }
  /** Vrai si le point local tombe dans l'emprise couverte par la carte de circulation. */
  const contains = (lx, lz) => cellOf(lx, lz) >= 0;
  /** Vrai si un visiteur peut se tenir debout en ce point local. */
  const isFloor = (lx, lz) => { const c = cellOf(lx, lz); return c >= 0 && walk[c] === 1; };
  /** Hauteur du sol local (m), par rapport au sol du village : marches, perron, dallages. */
  const floorHeight = (lx, lz) => { const c = cellOf(lx, lz); return c >= 0 && walk[c] ? floorCm[c] / 100 : 0; };
  /** Vrai si le point local appartient au bâti fermé (murs, portes, volume intérieur). */
  const isEnclosed = (lx, lz) => { const c = cellOf(lx, lz); return c >= 0 && enclosed[c] === 1; };

  /** Lecture d'un point touché sur le modèle (coordonnées monde) : où aller, ou pourquoi refuser.
   *  - 'floor'  : sol praticable sous le point touché (sol, perron, entre les bancs, sous les arcades) ;
   *  - 'closed' : façade, porte ou mur — l'auberge est fermée pour l'instant ;
   *  - 'blocked': mobilier, poteau, ou endroit où l'on ne tient pas debout. */
  const tmpV = new THREE.Vector3();
  function classifyHit(point) {
    const l = root.worldToLocal(tmpV.copy(point));
    const c = cellOf(l.x, l.z);
    if (c < 0) return { kind: 'blocked' };
    if (walk[c] && point.y - root.position.y < floorCm[c] / 100 + 1.0) return { kind: 'floor', floorHeight: floorCm[c] / 100 };
    if (enclosed[c] && point.y - root.position.y < 3.2) return { kind: 'closed', message: CLOSED_MESSAGE };
    return { kind: 'blocked' };
  }

  // ----- Entrées : fermées pour l'instant -----
  const interactions = [
    {
      id: 'porte-principale', kind: 'door', enabled: false, label: 'porte principale',
      // Façade principale, en haut du perron (repère local, mètres).
      localPosition: { x: 0.25, y: 1.2, z: 6.3 }, radius: 1.6,
      isOpen: () => false,
      action: () => { context.events?.emit?.('building:door-refused', { sourceId: 'taverne', zoneId: 'village', timestamp: Date.now(), payload: { door: 'porte-principale' } }); return false; },
    },
  ];

  const api = {
    id: 'taverne', root, ready,
    get readyAll() { return hqReady.then((h) => h.readyAll).then(() => api); },
    update() { hq?.tick(); },                          // choix du niveau de détail : THREE.LOD, à chaque rendu
    dispose() { hq?.dispose(); root.parent?.remove(root); },
    getColliders: () => [],                            // circulation décrite par la carte nav.json (isFloor)
    getInteractionPoints: () => interactions,
    isFloor, floorHeight, contains, isEnclosed, classifyHit,
    closedMessage: CLOSED_MESSAGE,
    setQuality: (q) => hqReady.then((h) => h.setQuality(q)),
    getQuality: () => hq?.getQuality(),
    stats: () => (hq ? { loaded: true, ...hq.stats() } : { loaded: false }),
  };
  return api;
}
