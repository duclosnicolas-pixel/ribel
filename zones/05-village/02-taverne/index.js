/** RIBEL — module de bâtiment « taverne » : l'auberge du Foyer d'Or (zone Z05 Village).
 *
 * Contrat : createBuilding(context, config) → { root, update, dispose, getColliders, getInteractionPoints }
 * + ready (promesse du chargement du modèle), isFloor, floorHeight, contains.
 *
 * Modèle : auberge.glb, issu de l'export Meshy fourni par le MOA le 2026-10-23
 * (137 Mo, 4,34 M triangles), allégé à 78 000 triangles et 2,3 Mo (tools/taverne/).
 * Circulation : nav.json, calculée sur la géométrie complète. On peut se tenir entre les bancs,
 * sous les arcades et sous l'encorbellement ; l'intérieur reste inaccessible.
 * Portes extérieures : NON ouvrables pour l'instant (décision MOA du 2026-10-23).
 *
 * Le module ne crée ni renderer, ni caméra, ni boucle, ni éclairage global.
 * Le chargeur glTF est fourni par l'hôte (context.loadGLTF) ou importé via la carte d'import « three/addons/ ».
 */

export const SCALE = 9;                  // mètres par unité du modèle Meshy (tables 0,85 m, bancs 0,5 m, arcades 2,3 m)
const SLAB_TOP = -0.517;                 // dessus de la dalle de base du modèle, en unités du modèle
const GROUND_OFFSET = 0.03;              // la dalle affleure 3 cm au-dessus du sol du village

function decodeRle(runs, length) {
  const out = new Uint8Array(length);
  let o = 0;
  for (let i = 0; i < runs.length; i += 2) { out.fill(runs[i], o, o + runs[i + 1]); o += runs[i + 1]; }
  return out;
}

export function createBuilding(context, config = {}) {
  const { THREE } = context;
  const base = config.baseUrl || new URL('./', import.meta.url).href;
  const root = new THREE.Group();
  root.name = 'taverne';
  const placement = config.placement || { x: 0, y: 0, z: 0, rotationY: 0 };
  root.position.set(placement.x, placement.y || 0, placement.z);
  root.rotation.y = placement.rotationY || 0;

  let nav = null, walk = null, floorCm = null, enclosed = null, model = null, material = null;

  async function loadGLTF(url) {
    if (context.loadGLTF) return context.loadGLTF(url);
    const [{ GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
      import('three/addons/loaders/GLTFLoader.js'),
      import('three/addons/libs/meshopt_decoder.module.js'),
    ]);
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    return loader.loadAsync(url);
  }

  const ready = Promise.all([
    loadGLTF(base + 'auberge.glb'),
    fetch(base + 'nav.json').then((r) => { if (!r.ok) throw new Error('nav.json : ' + r.status); return r.json(); }),
  ]).then(([gltf, navData]) => {
    nav = navData;
    walk = decodeRle(nav.praticable_rle, nav.nx * nav.nz);
    floorCm = decodeRle(nav.sol_cm_rle, nav.nx * nav.nz);
    enclosed = decodeRle(nav.bati_ferme_rle, nav.nx * nav.nz);
    model = gltf.scene;
    model.name = 'auberge-meshy';
    model.scale.setScalar(SCALE);
    model.position.y = -SLAB_TOP * SCALE + GROUND_OFFSET;
    model.traverse((o) => {
      if (!o.isMesh) return;
      material = o.material;
      if (context.maxAnisotropy && material.map) material.map.anisotropy = Math.min(8, context.maxAnisotropy);
      o.matrixAutoUpdate = false; o.updateMatrix();
    });
    root.add(model);
    root.updateMatrixWorld(true);
    return api;
  });

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
  const closed = () => false;
  const interactions = [
    {
      id: 'porte-principale', kind: 'door', enabled: false, label: 'porte principale',
      // Façade principale, en haut du perron (repère local, mètres).
      localPosition: { x: 0.25, y: 1.2, z: 6.3 }, radius: 1.6,
      isOpen: closed,
      action: () => { context.events?.emit?.('building:door-refused', { sourceId: 'taverne', zoneId: 'village', timestamp: Date.now(), payload: { door: 'porte-principale' } }); return false; },
    },
  ];
  const CLOSED_MESSAGE = "L'auberge est fermée pour l'instant : on visitera l'intérieur plus tard.";

  function dispose() {
    root.traverse((o) => {
      o.geometry?.dispose();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) { for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap']) m[k]?.dispose(); m.dispose(); }
    });
    root.parent?.remove(root);
  }

  const api = {
    id: 'taverne', root, ready,
    update() {},                                       // bâtiment immobile pour l'instant
    dispose,
    getColliders: () => [],                            // circulation décrite par la carte nav.json (isFloor)
    getInteractionPoints: () => interactions,
    isFloor, floorHeight, contains, isEnclosed, classifyHit,
    closedMessage: CLOSED_MESSAGE,
    stats: () => { let triangles = 0; model?.traverse((o) => { if (o.isMesh) triangles += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; }); return { loaded: !!model, triangles }; },
  };
  return api;
}
