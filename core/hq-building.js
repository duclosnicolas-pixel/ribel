/** RIBEL — bâtiment « haute qualité » : niveaux de détail, textures partagées, ombres et reflets du ciel.
 *
 * Chaîne de production : tools/hq/ (voir son README). Pour chaque bâtiment, un fichier hq.json décrit :
 *  - les niveaux de géométrie (glb sans matériau, compressés meshopt) : « max » (géométrie complète),
 *    « casque » (allégée, reliefs de la géométrie complète cuits dans sa carte de normales), « loin » ;
 *  - les textures partagées par tous les niveaux : couleur, normales, ORM (occlusion cuite, rugosité, métal) ;
 *  - les jeux de distances par qualité : téléphone (« max »), casque (« casque »), « leger ».
 *
 * Le module ne crée ni renderer, ni caméra, ni boucle, ni lumière. L'hôte peut fournir :
 *  context.envMap (reflets du ciel, PMREM), context.onShadowsDirty() (ombres statiques à recalculer).
 * Le chargeur glTF vient de context.loadGLTF ou de la carte d'import « three/addons/ ».
 */

export async function defaultGLTFLoader() {
  const [{ GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/libs/meshopt_decoder.module.js'),
  ]);
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  return (url) => loader.loadAsync(url);
}

/**
 * @param context { THREE, maxAnisotropy?, envMap?, loadGLTF?, onShadowsDirty? }
 * @param opts    { baseUrl, spec, quality: 'max'|'casque'|'leger', shadows: boolean }
 * @returns { root, ready, readyAll, setQuality, getQuality, currentLevel, stats, dispose }
 */
export function createHQBuilding(context, opts) {
  const { THREE } = context;
  const spec = opts.spec;
  const base = opts.baseUrl;
  const root = new THREE.Group();
  root.name = 'hq:' + (spec.id || 'batiment');
  const model = new THREE.Group();                         // repère du modèle source (unités Meshy)
  model.scale.setScalar(spec.scale);
  model.position.y = -spec.slabTop * spec.scale + (spec.groundOffset || 0);
  root.add(model);
  const lod = new THREE.LOD();
  lod.name = 'niveaux';
  model.add(lod);

  let quality = opts.quality || 'max';
  const meshes = new Map();                               // id de niveau → THREE.Mesh
  const textures = new Map();
  const materials = [];
  let disposed = false;

  // ---------- Textures partagées ----------
  const texLoader = new THREE.TextureLoader();
  function loadTexture(key) {
    if (textures.has(key)) return textures.get(key);
    const t = spec.textures[key];
    const p = texLoader.loadAsync(base + t.file).then((tex) => {
      tex.flipY = false;                                   // convention glTF
      tex.colorSpace = t.colorSpace === 'srgb' ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = Math.min(context.maxAnisotropy || 4, 8);
      tex.needsUpdate = true;
      return tex;
    });
    textures.set(key, p);
    return p;
  }

  // ---------- Matériaux : un par jeu de textures ----------
  const materialCache = new Map();
  async function materialFor(level, hasTangents) {
    const t = level.textures;
    const key = [t.map, t.normalMap, t.orm, hasTangents].join('|');
    if (materialCache.has(key)) return materialCache.get(key);
    const p = (async () => {
      const [map, normalMap, orm] = await Promise.all([loadTexture(t.map), loadTexture(t.normalMap), loadTexture(t.orm)]);
      const m = spec.materiau || {};
      const mat = new THREE.MeshStandardMaterial({
        map, normalMap, aoMap: orm, roughnessMap: orm,
        roughness: m.roughness ?? 1, metalness: m.metalness ?? 0,
        aoMapIntensity: m.aoMapIntensity ?? 1,
        envMap: context.envMap || null, envMapIntensity: m.envMapIntensity ?? 0.6,
        side: m.side === 'double' ? THREE.DoubleSide : THREE.FrontSide,
      });
      // Même convention que GLTFLoader : sans tangentes, l'axe vert de la carte de normales est inversé.
      mat.normalScale.set(1, hasTangents ? 1 : -1);
      mat.name = spec.id + ':' + key;
      materials.push(mat);
      return mat;
    })();
    materialCache.set(key, p);
    return p;
  }

  // ---------- Niveaux ----------
  const loadGLTF = context.loadGLTF ? Promise.resolve(context.loadGLTF) : defaultGLTFLoader();
  async function loadLevel(id) {
    if (meshes.has(id)) return meshes.get(id);
    const level = spec.niveaux.find((l) => l.id === id);
    const load = await loadGLTF;
    const gltf = await load(base + level.file);
    let src = null;
    gltf.scene.traverse((o) => { if (!src && o.isMesh) src = o; });
    gltf.scene.updateMatrixWorld(true);
    const geometry = src.geometry;
    const material = await materialFor(level, !!geometry.attributes.tangent);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'niveau:' + id;
    mesh.matrixAutoUpdate = false;
    mesh.matrix.copy(src.matrixWorld);                     // déquantification des positions (KHR_mesh_quantization)
    mesh.castShadow = mesh.receiveShadow = !!opts.shadows;
    mesh.userData.level = id;
    meshes.set(id, mesh);
    if (!disposed) rebuildLevels();
    return mesh;
  }

  function rebuildLevels() {
    for (const l of [...lod.levels]) lod.remove(l.object);
    lod.levels.length = 0;
    const table = spec.qualites[quality] || spec.qualites.max;
    const loaded = table.filter(([id]) => meshes.has(id));
    loaded.forEach(([id, dist], i) => lod.addLevel(meshes.get(id), i === 0 ? 0 : dist, 0.08));
    context.onShadowsDirty?.();
  }

  let lastLevel = null;
  function currentLevel() {
    const visible = lod.levels.find((l) => l.object.visible);
    return visible ? visible.object.userData.level : null;
  }
  /** À appeler à chaque image : signale un changement de niveau (ombres statiques à recalculer). */
  function tick() {
    const lv = currentLevel();
    if (lv !== lastLevel) { lastLevel = lv; context.onShadowsDirty?.(); }
  }

  // Ordre de chargement : le plus léger d'abord, pour afficher vite, puis les niveaux utiles à la qualité.
  const order = (q) => {
    const ids = (spec.qualites[q] || []).map(([id]) => id);
    return [...ids].sort((a, b) => spec.niveaux.find((l) => l.id === a).triangles - spec.niveaux.find((l) => l.id === b).triangles);
  };
  const first = order(quality)[0];
  const ready = loadLevel(first).then(() => api);
  let readyAll = ready.then(async () => { for (const id of order(quality)) await loadLevel(id); return api; });

  function setQuality(q) {
    if (!spec.qualites[q] || q === quality) return readyAll;
    quality = q;
    rebuildLevels();
    readyAll = (async () => { for (const id of order(q)) await loadLevel(id); rebuildLevels(); return api; })();
    return readyAll;
  }

  function stats() {
    const lv = currentLevel();
    const level = spec.niveaux.find((l) => l.id === lv);
    return { quality, level: lv, triangles: level ? level.triangles : 0, loaded: [...meshes.keys()] };
  }

  function dispose() {
    disposed = true;
    for (const m of meshes.values()) m.geometry.dispose();
    for (const m of materials) m.dispose();
    Promise.all([...textures.values()]).then((ts) => ts.forEach((t) => t.dispose()));
    root.parent?.remove(root);
  }

  const api = { root, model, lod, ready, get readyAll() { return readyAll; }, setQuality, getQuality: () => quality, currentLevel, tick, stats, dispose };
  return api;
}
